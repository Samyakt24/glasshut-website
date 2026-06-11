/* GlassHut — app.js */

var UPI_ID = 'samyaktjain1999-2@okicici';
var cart = [];
var isChampionApplied = false; // Just a simple ON/OFF switch! 
var pendingProduct = null;
var selectedSize = null;

var cartBtn = document.getElementById('cartBtn');
var cartOverlay = document.getElementById('cartOverlay');
var cartDrawer = document.getElementById('cartDrawer');
var cartClose = document.getElementById('cartClose');
var cartItems = document.getElementById('cartItems');
var cartEmpty = document.getElementById('cartEmpty');
var cartFooter = document.getElementById('cartFooter');
var cartCount = document.getElementById('cartCount');
var cartTotal = document.getElementById('cartTotal');
var sizeModal = document.getElementById('sizeModal');
var sizeConfirm = document.getElementById('sizeConfirm');
var sizeCancel = document.getElementById('sizeCancel');
var sizeModalTitle = document.getElementById('sizeModalTitle');
var placeOrderBtn = document.getElementById('placeOrderBtn');

/* ===== CART DRAWER ===== */
function openCart() { 
    cartOverlay.classList.add('open'); 
    cartDrawer.classList.add('open'); 
    document.body.style.overflow = 'hidden'; 
    loadSavedCustomer(); 
}
function closeCart() { 
    cartOverlay.classList.remove('open'); 
    cartDrawer.classList.remove('open'); 
    document.body.style.overflow = ''; 
}
cartBtn.onclick = openCart;
cartOverlay.onclick = closeCart;
cartClose.onclick = closeCart;

/* ===== SIZE MODAL ===== */
function openSizeModal(p) {
  pendingProduct = p; selectedSize = null;
  sizeModalTitle.textContent = p.name;
  document.querySelectorAll('.size-opt').forEach(function(b) { b.classList.remove('selected'); });
  sizeConfirm.disabled = true;
  sizeModal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeSizeModal() {
  sizeModal.classList.remove('open');
  document.body.style.overflow = '';
  pendingProduct = null; selectedSize = null;
}
document.querySelectorAll('.size-opt').forEach(function(btn) {
  btn.onclick = function() {
    document.querySelectorAll('.size-opt').forEach(function(b) { b.classList.remove('selected'); });
    this.classList.add('selected');
    selectedSize = this.dataset.size;
    sizeConfirm.disabled = false;
  };
});
sizeCancel.onclick = closeSizeModal;
sizeModal.onclick = function(e) { if (e.target === sizeModal) closeSizeModal(); };
sizeConfirm.onclick = function() {
  if (!pendingProduct || !selectedSize) return;
  addToCart(pendingProduct.name, pendingProduct.price, pendingProduct.color, selectedSize);
  closeSizeModal();
  openCart();
};
document.querySelectorAll('.add-to-cart').forEach(function(btn) {
  btn.onclick = function() {
    openSizeModal({ name: this.dataset.name, price: parseInt(this.dataset.price), color: this.dataset.color });
  };
});

/* ===== VARIANT SELECTOR ===== */
function selectVariant(btn, productId, name, price) {
  btn.parentElement.querySelectorAll('.variant-btn').forEach(function(b) { b.classList.remove('active'); });
  btn.classList.add('active');
  document.getElementById('price-' + productId).innerHTML = '&#8377;' + price;
  var atcBtn = document.getElementById('atc-' + productId);
  atcBtn.dataset.name = name;
  atcBtn.dataset.price = price;
}

/* ===== CART LOGIC ===== */
function addToCart(name, price, color, size) {
  var key = name + '-' + size;
  var ex = cart.find(function(i) { return i.key === key; });
  if (ex) ex.qty++;
  else cart.push({ key: key, name: name, price: price, color: color, size: size, qty: 1 });
  updateCartUI();
  cartCount.classList.remove('bump');
  void cartCount.offsetWidth;
  cartCount.classList.add('bump');
}

function getTotal() { return cart.reduce(function(s, i) { return s + i.price * i.qty; }, 0); }
function getShipping() { return getTotal() >= 250 ? 0 : 50; }

// --- DYNAMIC DISCOUNT MATH ---
function getDiscountAmount() { 
    if (!isChampionApplied) return 0; 
    return getTotal() > 240 ? 40 : 20; 
}

function getGrandTotal() { 
    return Math.max(0, getTotal() + getShipping() - getDiscountAmount()); 
}

function updateCartUI() {
  var subtotal = getTotal(), shipping = getShipping(), total = getGrandTotal();
  var count = cart.reduce(function(s, i) { return s + i.qty; }, 0);
  
  cartCount.textContent = count;
  cartCount.style.display = count > 0 ? 'flex' : 'none';
  
  var cartSubtotal = document.getElementById('cartSubtotal');
  var cartShipping = document.getElementById('cartShipping');
  var shippingLabel = document.getElementById('shippingLabel');

  if (cart.length === 0) {
    cartEmpty.style.display = 'block';
    cartFooter.style.display = 'none';
    cartItems.querySelectorAll('.cart-item').forEach(function(i) { i.remove(); });
  } else {
    cartEmpty.style.display = 'none';
    cartFooter.style.display = 'block';
    
    cartSubtotal.innerHTML = '&#8377;' + subtotal.toLocaleString('en-IN');
    
    if (shipping === 0) {
      cartShipping.innerHTML = 'FREE';
      cartShipping.style.color = 'var(--teal)';
      shippingLabel.textContent = 'Shipping';
    } else {
      cartShipping.innerHTML = '&#8377;' + shipping;
      cartShipping.style.color = 'var(--copper-dark)';
      shippingLabel.innerHTML = 'Shipping <span style="font-size:10px;opacity:0.6">(Free above &#8377;250)</span>';
    }
    
    if (cartTotal) {
        cartTotal.innerHTML = '&#8377;' + total.toLocaleString('en-IN');
    }
    
    cartItems.querySelectorAll('.cart-item').forEach(function(i) { i.remove(); });

    cart.forEach(function(item, idx) {
      var d = document.createElement('div');
      d.className = 'cart-item';
      var bg = item.color;
      d.innerHTML = '<div class="cart-item-color" style="background:' + bg + '"></div>' +
        '<div class="cart-item-info"><div class="cart-item-name">' + item.name + '</div>' +
        '<div class="cart-item-meta">Glass Bangles</div>' +
        '<div class="cart-item-size">Size: ' + item.size + '</div>' +
        '<div class="cart-qty"><button class="qm" data-i="' + idx + '">&#8722;</button>' +
        '<span>' + item.qty + '</span>' +
        '<button class="qp" data-i="' + idx + '">+</button></div></div>' +
        '<div style="text-align:right"><div class="cart-item-price">&#8377;' + (item.price * item.qty).toLocaleString('en-IN') + '</div>' +
        '<button class="cart-item-remove" data-i="' + idx + '">&#10005;</button></div>';
      cartItems.appendChild(d);
    });

    cartItems.querySelectorAll('.qp').forEach(function(b) {
      b.onclick = function() { cart[this.dataset.i].qty++; updateCartUI(); };
    });
    cartItems.querySelectorAll('.qm').forEach(function(b) {
      b.onclick = function() { var i = this.dataset.i; cart[i].qty--; if (cart[i].qty <= 0) cart.splice(i, 1); updateCartUI(); };
    });
    cartItems.querySelectorAll('.cart-item-remove').forEach(function(b) {
      b.onclick = function() { cart.splice(this.dataset.i, 1); updateCartUI(); };
    });
  }
}

placeOrderBtn.onclick = function() {
  if (cart.length === 0 || !validateForm()) return;
  showPaymentStep();
};

document.getElementById('copyUpiBtn2').onclick = function() {
  var btn = this;
  navigator.clipboard.writeText(UPI_ID).then(function() {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(function() { btn.textContent = 'Copy UPI ID'; btn.classList.remove('copied'); }, 2000);
  });
};

updateCartUI();

/* ===== MOBILE MENU ===== */
var hamburgerBtn = document.getElementById('hamburgerBtn');
var mobileMenu = document.getElementById('mobileMenu');
var mobileOverlay = document.getElementById('mobileOverlay');

function openMobileMenu() {
  hamburgerBtn.classList.add('open');
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMobileMenu() {
  hamburgerBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
hamburgerBtn.onclick = function() {
  mobileMenu.classList.contains('open') ? closeMobileMenu() : openMobileMenu();
};
mobileOverlay.onclick = closeMobileMenu;

/* ===== FORM VALIDATION ===== */
function validateForm() {
  var valid = true;
  var name = document.getElementById('custName').value.trim();
  var phone = document.getElementById('custPhone').value.trim();
  var email = document.getElementById('custEmail').value.trim();
  var address = document.getElementById('custAddress').value.trim();
  var city = document.getElementById('custCity').value.trim();
  var pincode = document.getElementById('custPincode').value.trim();
  var state = document.getElementById('custState').value.trim();
  document.querySelectorAll('.form-error').forEach(function(e) { e.classList.remove('show'); });
  if (!name) { document.getElementById('errName').classList.add('show'); valid = false; }
  if (!phone || phone.length !== 10 || isNaN(phone)) { document.getElementById('errPhone').classList.add('show'); valid = false; }
  if (!email || !email.includes('@') || !email.includes('.')) { document.getElementById('errEmail').classList.add('show'); valid = false; }
  if (!address) { document.getElementById('errAddress').classList.add('show'); valid = false; }
  if (!city) { document.getElementById('errCity').classList.add('show'); valid = false; }
  if (!pincode || pincode.length !== 6 || isNaN(pincode)) { document.getElementById('errPin').classList.add('show'); valid = false; }
  if (!state || state === '') { document.getElementById('errState').classList.add('show'); valid = false; }
  if (!valid) { document.getElementById('cartFooter').scrollTop = 0; }
  return valid;
}

/* ===== AUTO-FILL FROM PINCODE ===== */
function autoPincode(val) {
  if (val.length !== 6 || isNaN(val)) return;
  var loader = document.getElementById('pinLoading');
  loader.textContent = 'Looking up pincode...';
  loader.style.display = 'block';
  fetch('https://api.postalpincode.in/pincode/' + val)
    .then(function(r) { return r.json(); })
    .then(function(data) {
      if (data && data[0] && data[0].Status === 'Success' && data[0].PostOffice && data[0].PostOffice.length > 0) {
        var po = data[0].PostOffice[0];
        document.getElementById('custCity').value = po.District || po.Name || '';
        var stateSelect = document.getElementById('custState');
        for (var i = 0; i < stateSelect.options.length; i++) {
          if (stateSelect.options[i].text === po.State) { stateSelect.selectedIndex = i; break; }
        }
        loader.textContent = 'Found: ' + po.District + ', ' + po.State;
        setTimeout(function() { loader.style.display = 'none'; }, 3000);
      } else {
        loader.textContent = 'Pincode not found — please fill manually';
        setTimeout(function() { loader.style.display = 'none'; }, 3000);
      }
    })
    .catch(function() { loader.style.display = 'none'; });
}
let pincodeInput = document.getElementById('custPincode');
if (pincodeInput) {
    pincodeInput.addEventListener('input', function() {
        autoPincode(this.value);
    });
}

/* ===== GOOGLE SHEET API ===== */
var SHEET_API = 'https://script.google.com/macros/s/AKfycbwQbmL-6ORgm_t96KRwDpd4S4MluzY9Tq6hO2THwPrsDIaBbIx8l6U3XVFoBjAAV9s78w/exec';

function sendToSheet(data) {
  try {
    var form = document.createElement('form');
    form.method = 'POST';
    form.action = SHEET_API;
    form.target = 'ghOrderFrame';
    form.style.display = 'none';
    Object.keys(data).forEach(function(key) {
      var input = document.createElement('input');
      input.type = 'hidden';
      input.name = key;
      input.value = String(data[key]);
      form.appendChild(input);
    });
    document.body.appendChild(form);
    form.submit();
    setTimeout(function() { form.remove(); }, 3000);
  } catch (err) {
    try {
      var params = Object.keys(data).map(function(k) { return encodeURIComponent(k) + '=' + encodeURIComponent(data[k]); }).join('&');
      var img = new Image();
      img.src = SHEET_API + '?' + params;
    } catch (e) { }
  }
}

/* ===== PAYMENT ===== */
var pendingOrder = null;
var pendingQR = null;

function loadQRLibrary() {
  return new Promise(function(resolve) {
    if (window.QRCode) return resolve();
    var s = document.createElement('script');
    s.src = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
    s.onload = resolve;
    s.onerror = resolve;
    document.head.appendChild(s);
  });
}

function showPaymentStep() {
  loadQRLibrary().then(function() { _showPaymentStep(); });
}

function _showPaymentStep() {
  try {
    var ordNum = 'GH-' + Date.now().toString().slice(-6);
    var subtotal = getTotal(), shipping = getShipping(), total = getGrandTotal();
    var custName = document.getElementById('custName').value.trim();
    var custPhone = document.getElementById('custPhone').value.trim();
    var custEmail = document.getElementById('custEmail').value.trim();
    var custAddress = document.getElementById('custAddress').value.trim();
    var custCity = document.getElementById('custCity').value.trim();
    var custPincode = document.getElementById('custPincode').value.trim();
    var custState = document.getElementById('custState').value.trim();
    var itemsList = cart.map(function(i) { return i.name + ' (Size ' + i.size + ') x' + i.qty + ' = Rs.' + (i.price * i.qty); }).join(', ');

    pendingOrder = {
      orderId: ordNum,
      date: new Date().toLocaleDateString('en-IN'),
      time: new Date().toLocaleTimeString('en-IN'),
      customerName: custName, phone: custPhone, email: custEmail,
      address: custAddress, city: custCity, state: custState, pincode: custPincode,
      items: itemsList, subtotal: String(subtotal), shipping: String(shipping), total: String(total)
    };

    document.getElementById('payAmountDisplay').innerHTML = '&#8377;' + total.toLocaleString('en-IN');

    var html = '';
    cart.forEach(function(item) {
      html += '<div class="os-row"><span>' + item.name + ' (Size ' + item.size + ') x' + item.qty + '</span><span>&#8377;' + (item.price * item.qty) + '</span></div>';
    });
    
    // Add discount line to summary if applied
    if (isChampionApplied) {
       html += '<div class="os-row" style="color:#d9534f"><span>Discount</span><span>- &#8377;' + getDiscountAmount() + '</span></div>';
    }
    
    html += '<div class="os-row"><span>Shipping</span><span>' + (shipping === 0 ? 'FREE' : '&#8377;' + shipping) + '</span></div>';
    html += '<div class="os-row total"><span>Total</span><span>&#8377;' + total + '</span></div>';
    html += '<div style="margin-top:10px;padding-top:10px;border-top:1px solid rgba(42,139,122,0.15)"><div class="os-row"><span>Deliver to</span></div><div style="color:#1E2D50;font-weight:600;padding:4px 0">' + custName + '</div><div style="font-size:12px;color:#6B7A8D">' + custAddress + ', ' + custCity + ', ' + custState + ' - ' + custPincode + '</div></div>';
    document.getElementById('orderSummaryBox').innerHTML = html;

    var upiUrl = 'upi://pay?pa=' + encodeURIComponent(UPI_ID) + '&pn=GlassHut&am=' + total + '&cu=INR&tn=' + encodeURIComponent('GlassHut Order ' + ordNum);
    var qrBox = document.getElementById('qrCodeBox');
    qrBox.innerHTML = '';
    if (pendingQR) pendingQR = null;
    pendingQR = new QRCode(qrBox, { text: upiUrl, width: 180, height: 180, colorDark: '#1E2D50', colorLight: '#ffffff', correctLevel: QRCode.CorrectLevel.M });

    document.getElementById('payStep').style.display = 'block';
    document.getElementById('confirmStep').style.display = 'none';

    closeCart();
    document.getElementById('orderConfirmOverlay').classList.add('open');
    document.body.style.overflow = 'hidden';
  } catch (err) {
    alert('Error: ' + err.message + '. Please try again.');
  }
}

document.getElementById('iHavePaidBtn').onclick = function() {
  if (!pendingOrder) return;
  document.getElementById('orderId').textContent = 'Order #' + pendingOrder.orderId;
  document.getElementById('orderConfirmSummary').innerHTML = document.getElementById('orderSummaryBox').innerHTML;
  sendToSheet(pendingOrder);
  saveCustomerDetails();
  document.getElementById('payStep').style.display = 'none';
  document.getElementById('confirmStep').style.display = 'block';
};

document.getElementById('cancelPayBtn').onclick = function() {
  document.getElementById('orderConfirmOverlay').classList.remove('open');
  document.body.style.overflow = '';
  pendingOrder = null;
  openCart();
};

document.getElementById('orderDoneBtn').onclick = function() {
  document.getElementById('orderConfirmOverlay').classList.remove('open');
  document.body.style.overflow = '';
  cart = [];
  updateCartUI();
  document.querySelectorAll('#checkoutForm input').forEach(function(i) { i.value = ''; });
  document.getElementById('custState').selectedIndex = 0;
  pendingOrder = null;
};

/* ===== PRODUCT IMAGE SLIDESHOW ===== */
function slideProduct(groupId, idx) {
  var imgs = document.querySelectorAll('img[data-slide="' + groupId + '"]');
  var dots = document.querySelectorAll('.slide-dot[data-slide="' + groupId + '"]');
  imgs.forEach(function(img) { img.classList.remove('active'); });
  dots.forEach(function(dot) { dot.classList.remove('active'); });
  if(imgs[idx]) imgs[idx].classList.add('active');
  if(dots[idx]) dots[idx].classList.add('active');
}

document.querySelectorAll('.slide-dot').forEach(function(dot) {
  dot.onclick = function() { slideProduct(this.dataset.slide, parseInt(this.dataset.idx)); };
});

var slideGroups = ['lm', 'dm', 'lgc', 'dmc', 'rnc', 'sb', 'cr'];
var slideshowStarted = false;
var productsSection = document.getElementById('products');
var slideObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting && !slideshowStarted) {
      slideshowStarted = true;
      slideGroups.forEach(function(gid) {
        var imgs = document.querySelectorAll('img[data-slide="' + gid + '"]');
        if (imgs.length < 2) return;
        var current = 0;
        setInterval(function() {
          current = (current + 1) % imgs.length;
          slideProduct(gid, current);
        }, 3000);
      });
      slideObs.disconnect();
    }
  });
}, { threshold: 0.1 });
if (productsSection) slideObs.observe(productsSection);

/* ===== FILTER ===== */
function filterProducts(cat) {
  document.querySelectorAll('.filter-tab').forEach(function(t) { t.classList.remove('active'); });
  if (cat !== 'all') {
    document.querySelectorAll('.filter-tab').forEach(function(t) {
      if (t.textContent.toLowerCase().replace(' wear', '').replace(' ', '') === cat) t.classList.add('active');
    });
  } else {
    document.querySelector('.filter-tab').classList.add('active');
  }
  document.querySelectorAll('.product-card').forEach(function(c) {
    if (cat === 'all') { c.classList.remove('hidden'); }
    else { var cats = c.dataset.cat || ''; c.classList.toggle('hidden', !cats.includes(cat)); }
  });
  document.getElementById('products').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ===== SCROLL REVEAL ===== */
var obs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(function(el) { obs.observe(el); });

/* ===== MODALS ===== */
function openModal(id) { document.getElementById(id).classList.add('open'); document.body.style.overflow = 'hidden'; }
function closeModal(id) { document.getElementById(id).classList.remove('open'); document.body.style.overflow = ''; }
function openPolicy() { openModal('policyOverlay'); }

document.getElementById('policyClose').onclick = function() { closeModal('policyOverlay'); };
document.getElementById('policyOverlay').onclick = function(e) { if (e.target === this) closeModal('policyOverlay'); };
document.getElementById('shippingOverlay').onclick = function(e) { if (e.target === this) closeModal('shippingOverlay'); };
document.getElementById('trackOverlay').onclick = function(e) { if (e.target === this) closeModal('trackOverlay'); };
document.getElementById('faqOverlay').onclick = function(e) { if (e.target === this) closeModal('faqOverlay'); };

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(function(a) {
  a.addEventListener('click', function(e) {
    var href = this.getAttribute('href');
    if (!href || href === '#' || href.length < 2) return;
    e.preventDefault();
    var t = document.querySelector(href);
    if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ==========================================
//        COUPON CODE SYSTEM
// ==========================================

function applyDiscount() {
    let couponInput = document.getElementById("couponCode");
    if(!couponInput) return; // safety check
    
    let enteredCode = couponInput.value.trim().toUpperCase(); 

    if (btoa(enteredCode) === "UkVFTDEw") { 
        isChampionApplied = true; 
        updateCartUI(); 

        if (getTotal() > 240) {
            alert("Success! You unlocked the VIP tier: ₹40 off!");
        } else {
            alert("Success! Champion discount applied: ₹20 off.");
        }
        
        let btn = document.querySelector("button[onclick='applyDiscount()']");
        if (btn) {
            btn.innerText = "Remove";
            btn.style.backgroundColor = "#d9534f"; 
            btn.setAttribute("onclick", "removeDiscount()"); 
        }
        couponInput.disabled = true;

    } else {
        alert("Sorry, that code is invalid or expired.");
    }
}

function removeDiscount() {
    isChampionApplied = false;
    updateCartUI(); 

    let couponInput = document.getElementById("couponCode");
    if(couponInput) {
        couponInput.value = "";
        couponInput.disabled = false;
    }

    let btn = document.querySelector("button[onclick='removeDiscount()']");
    if (btn) {
        btn.innerText = "Apply";
        btn.style.backgroundColor = "#2e8b74"; 
        btn.setAttribute("onclick", "applyDiscount()"); 
    }
}

// ==========================================
//        SAVE CUSTOMER DETAILS
// ==========================================

function loadSavedCustomer() {
    let savedData = localStorage.getItem("glasshut_customer");
    if (savedData) {
        let customer = JSON.parse(savedData);
        if(document.getElementById('custName')) document.getElementById('custName').value = customer.name || '';
        if(document.getElementById('custPhone')) document.getElementById('custPhone').value = customer.phone || '';
        if(document.getElementById('custEmail')) document.getElementById('custEmail').value = customer.email || '';
        if(document.getElementById('custAddress')) document.getElementById('custAddress').value = customer.address || '';
        if(document.getElementById('custPincode')) document.getElementById('custPincode').value = customer.pincode || '';
        
        if (customer.pincode && customer.pincode.length === 6) {
            autoPincode(customer.pincode);
        }
    }
}

function saveCustomerDetails() {
    let customer = {
        name: document.getElementById('custName') ? document.getElementById('custName').value.trim() : "",
        phone: document.getElementById('custPhone') ? document.getElementById('custPhone').value.trim() : "",
        email: document.getElementById('custEmail') ? document.getElementById('custEmail').value.trim() : "",
        address: document.getElementById('custAddress') ? document.getElementById('custAddress').value.trim() : "",
        pincode: document.getElementById('custPincode') ? document.getElementById('custPincode').value.trim() : ""
    };
    localStorage.setItem("glasshut_customer", JSON.stringify(customer));
}

document.addEventListener("DOMContentLoaded", function() {
    loadSavedCustomer();
});