import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const WEBHOOK_SECRET = Deno.env.get("RAZORPAY_WEBHOOK_SECRET")!;
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function hmacSha256Hex(secret: string, message: string) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  // Read the RAW body. Signature is computed over these exact bytes,
  // so never JSON.parse before verifying.
  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  const expected = await hmacSha256Hex(WEBHOOK_SECRET, raw);
  if (!safeEqual(expected, signature)) {
    console.error("Bad webhook signature");
    return new Response("Invalid signature", { status: 401 });
  }

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch {
    return new Response("Bad JSON", { status: 400 });
  }

  const event = body.event;
  console.log("Webhook event:", event);

  if (event !== "payment.captured" && event !== "order.paid") {
    return new Response("ignored", { status: 200 });
  }

  const payment = body.payload?.payment?.entity;
  if (!payment) return new Response("no payment entity", { status: 200 });

  const notes = payment.notes ?? {};

  try {
    // Skip if we already have this payment (browser may have saved it).
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("payment_id", payment.id)
      .limit(1);

    if (existing && existing.length > 0) {
      console.log("Already saved:", payment.id);
      return new Response("duplicate", { status: 200 });
    }

    const { error } = await supabase.from("orders").insert([{
      customer_name: notes.name ?? null,
      customer_phone: notes.phone ?? payment.contact ?? null,
      customer_email: notes.email ?? payment.email ?? null,
      shipping_address: notes.address ?? null,
      total_amount: payment.amount / 100,
      items: notes.items ?? null,
      payment_id: payment.id,
      payment_status: "PAID",
      created_at: new Date().toISOString(),
    }]);

    if (error) {
      console.error("Insert failed:", error);
      // 500 makes Razorpay retry the webhook later.
      return new Response("db error", { status: 500 });
    }

    console.log("Saved via webhook:", payment.id);
    return new Response("ok", { status: 200 });
  } catch (err) {
    console.error("Webhook error:", err);
    return new Response("error", { status: 500 });
  }
});
