import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RAZORPAY_KEY_ID = Deno.env.get("RAZORPAY_KEY_ID")!;
const RAZORPAY_KEY_SECRET = Deno.env.get("RAZORPAY_KEY_SECRET")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { order_id } = await req.json();
    if (!order_id) return json({ error: "order_id required" }, 400);

    const auth = btoa(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`);

    const res = await fetch(
      `https://api.razorpay.com/v1/orders/${order_id}/payments`,
      { headers: { Authorization: `Basic ${auth}` } },
    );
    const data = await res.json();

    if (!res.ok) {
      console.error("Razorpay error:", data);
      return json({ paid: false, error: data?.error?.description }, 502);
    }

    // Find a payment that actually went through.
    const good = (data.items ?? []).find(
      (p: any) => p.status === "captured" || p.status === "authorized",
    );

    if (!good) return json({ paid: false });

    return json({
      paid: true,
      payment_id: good.id,
      status: good.status,
      amount: good.amount / 100,
      method: good.method,
    });
  } catch (err) {
    return json({ paid: false, error: (err as Error).message }, 500);
  }
});
