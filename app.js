// ─────────────────────────────────────────────
//  Teda Foods — app.js
//  Hallmark redesign · counter-service structure
//  Class names aligned with style.css token system
// ─────────────────────────────────────────────

// Menu dataset, divided by category
const menuData = [
  {
    category: 'Rice Combos',
    items: [
      {
        id: '1',
        name: 'Jollof Rice + Chicken + Zobo (35cl)',
        displayName: 'Jollof Rice + Chicken + Zobo',
        price: 3000,
        displayPrice: '₦3,000',
        image: 'images/rice_combo.png',
      },
      {
        id: '2',
        name: 'Jollof Rice + Turkey + Zobo (35cl)',
        displayName: 'Jollof Rice + Turkey + Zobo',
        price: 4000,
        displayPrice: '₦4,000',
        image: 'images/rice_combo.png',
      },
      {
        id: '3',
        name: 'Asun Jollof + Chicken',
        displayName: 'Asun Jollof + Chicken',
        price: 3500,
        displayPrice: '₦3,500',
        image: 'images/rice_combo.png',
      },
      {
        id: '4',
        name: 'Asun Jollof + Turkey',
        displayName: 'Asun Jollof + Turkey',
        price: 4500,
        displayPrice: '₦4,500',
        image: 'images/rice_combo.png',
      },
      {
        id: '5',
        name: 'Fried Rice + Chicken',
        displayName: 'Fried Rice + Chicken',
        price: 2800,
        displayPrice: '₦2,800',
        image: 'images/fried_rice.png',
      },
      {
        id: '6',
        name: 'Fried Rice + Turkey',
        displayName: 'Fried Rice + Turkey',
        price: 4000,
        displayPrice: '₦4,000',
        image: 'images/fried_rice.png',
      },
      {
        id: '7',
        name: 'Ofada Rice Special (per pack)',
        displayName: 'Ofada Rice Special',
        price: 2700,
        displayPrice: '₦2,700 / pack',
        image: 'images/ofada_rice.png',
      },
    ],
  },
  {
    category: 'Pasta & Others',
    items: [
      {
        id: '8',
        name: 'Stir Fry Pasta + Chicken',
        displayName: 'Stir Fry Pasta + Chicken',
        price: 2500,
        displayPrice: '₦2,500',
        image: 'images/pasta.png',
      },
      {
        id: '9',
        name: 'Stir Fry Pasta + Turkey',
        displayName: 'Stir Fry Pasta + Turkey',
        price: 3500,
        displayPrice: '₦3,500',
        image: 'images/pasta.png',
      },
      {
        id: '10',
        name: 'Ewa-agoyin (per pack, with proteins)',
        displayName: 'Ewa-agoyin (with proteins)',
        price: 2500,
        displayPrice: '₦2,500 / pack',
        image: 'images/ewa_agoyin.png',
      },
    ],
  },
  {
    category: 'Sides & Extras',
    items: [
      {
        id: '11',
        name: 'Plantain (small pack)',
        displayName: 'Plantain (small pack)',
        price: 500,
        displayPrice: '₦500',
        image: 'images/sides_extras.png',
      },
      {
        id: '12',
        name: 'Plantain (medium pack)',
        displayName: 'Plantain (medium pack)',
        price: 700,
        displayPrice: '₦700',
        image: 'images/sides_extras.png',
      },
      {
        id: '13',
        name: 'Coleslaw (small pack)',
        displayName: 'Coleslaw (small pack)',
        price: 400,
        displayPrice: '₦400',
        image: 'images/sides_extras.png',
      },
      {
        id: '14',
        name: 'Coleslaw (medium pack)',
        displayName: 'Coleslaw (medium pack)',
        price: 700,
        displayPrice: '₦700',
        image: 'images/sides_extras.png',
      },
      {
        id: '15',
        name: 'Fried Fish',
        displayName: 'Fried Fish',
        price: 500,
        displayPrice: '₦500',
        image: 'images/sides_extras.png',
      },
      {
        id: '16',
        name: 'Egg',
        displayName: 'Egg',
        price: 300,
        displayPrice: '₦300',
        image: 'images/sides_extras.png',
      },
    ],
  },
  {
    category: 'Drinks',
    items: [
      {
        id: '17',
        name: "Teda's Zobo Drink (35cl)",
        displayName: "Teda's Zobo Drink (35cl)",
        price: 700,
        displayPrice: '₦700',
        image: 'images/drinks.png',
      },
      {
        id: '18',
        name: "Teda's Special Milkshake (50cl)",
        displayName: "Teda's Special Milkshake (50cl)",
        price: 2000,
        displayPrice: '₦2,000',
        image: 'images/drinks.png',
      },
    ],
  },
];

let cart = {};
let selectedPayment = 'online';

// ─── Render menu categories and cards ──────────────────────────
function renderMenu() {
  const container = document.getElementById('menu-container');
  if (!container) return;

  let html = '';
  menuData.forEach((cat) => {
    html += `
      <div class="cat-block">
        <div class="cat-header">
          <div class="cat-label">${cat.category}</div>
          <div class="cat-rule"></div>
        </div>
        <div class="menu-grid">
    `;

    cat.items.forEach((item) => {
      html += `
        <div class="menu-card" data-id="${item.id}" data-name="${item.name}" data-price="${item.price}" onclick="toggleItem(this)">
          <div class="card-img">
            <img src="${item.image}" alt="${item.displayName}" loading="lazy" width="220" height="148">
          </div>
          <div class="card-body">
            <div class="card-name">${item.displayName}</div>
            <div class="card-footer">
              <div class="card-price">${item.displayPrice}</div>
              <div class="card-actions">
                <button class="btn-add main-plus" aria-label="Add ${item.displayName}" onclick="void(0)">+</button>
                <div class="card-qty">
                  <button class="qty-btn" onclick="changeQty(event, this, -1)" aria-label="Decrease quantity">−</button>
                  <span class="qty-num">1</span>
                  <button class="qty-btn" onclick="changeQty(event, this, 1)" aria-label="Increase quantity">+</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
    });

    html += `
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

// ─── Payment method selector ────────────────────────────────────
function selectPayment(type) {
  selectedPayment = type;
  document.getElementById('pay-online').classList.toggle('active', type === 'online');
  document.getElementById('pay-whatsapp').classList.toggle('active', type === 'whatsapp');
  const btn = document.getElementById('submit-btn');
  const btnText = btn.querySelector('.btn-text');
  const btnIcon = btn.querySelector('.btn-icon');
  const note = document.querySelector('.pay-note');
  if (type === 'online') {
    if (btnText) btnText.textContent = 'Pay Now — Secure Checkout';
    if (btnIcon) btnIcon.innerHTML = `<i class="hgi-stroke hgi-credit-card icon-inline"></i>`;
    if (note)
      note.innerHTML =
        'Powered by <strong>Paystack</strong> — 100% secure. Cards, bank transfer &amp; USSD accepted.';
  } else {
    if (btnText) btnText.textContent = 'Send Order via WhatsApp';
    if (btnIcon) btnIcon.innerHTML = `<i class="hgi-stroke hgi-whatsapp icon-inline"></i>`;
    if (note)
      note.innerHTML =
        'Your order will open in WhatsApp. We\'ll confirm &amp; get it ready fast. <span class="pay-note-success">Fast &amp; easy!</span>';
  }
}

// ─── Toggle item in/out of cart ────────────────────────────────
function toggleItem(card) {
  const id = card.dataset.id;
  if (card.classList.contains('selected')) {
    card.classList.remove('selected');
    delete cart[id];
    card.querySelector('.qty-num').textContent = '1';
  } else {
    card.classList.add('selected');
    cart[id] = {
      name: card.dataset.name,
      price: parseInt(card.dataset.price),
      qty: 1,
    };
  }
  updateCart();
}

// ─── Quantity change ────────────────────────────────────────────
function changeQty(e, btn, delta) {
  e.stopPropagation();
  const card = btn.closest('.menu-card');
  const id = card.dataset.id;
  const qtyEl = card.querySelector('.qty-num');
  let qty = parseInt(qtyEl.textContent) + delta;
  if (qty < 1) {
    toggleItem(card);
    return;
  }
  qtyEl.textContent = qty;
  if (cart[id]) cart[id].qty = qty;
  updateCart();
}

// ─── Sync DOM with cart state ───────────────────────────────────
function updateCart() {
  const ids = Object.keys(cart);
  const cartFloat = document.getElementById('cart-float');
  const cartCount = document.getElementById('cart-count');
  const osEmpty = document.getElementById('order-empty');
  const osItems = document.getElementById('order-items');
  const osTotal = document.getElementById('order-total');
  const totalAmt = document.getElementById('total-amt');

  cartCount.textContent = ids.length;
  cartFloat.classList.toggle('visible', ids.length > 0);

  if (ids.length === 0) {
    osEmpty.style.display = 'block';
    osItems.style.display = 'none';
    osTotal.style.display = 'none';
    return;
  }

  osEmpty.style.display = 'none';
  osItems.style.display = 'block';
  osTotal.style.display = 'flex';

  let html = '';
  let total = 0;
  ids.forEach((id) => {
    const item = cart[id];
    const sub = item.price * item.qty;
    total += sub;
    html += `
      <div class="tray-item">
        <div class="tray-item-name">${item.name}</div>
        <div class="tray-item-right">
          <div class="tray-item-price">₦${sub.toLocaleString()}</div>
          <div class="tray-item-qty">x${item.qty} @ ₦${item.price.toLocaleString()}</div>
        </div>
      </div>`;
  });
  osItems.innerHTML = html;
  totalAmt.textContent = '₦' + total.toLocaleString();
}

// ─── Toast notifications ────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── Cart summary string builder ────────────────────────────────
function getOrderSummary() {
  let orderLines = '';
  let total = 0;
  Object.values(cart).forEach((item) => {
    const sub = item.price * item.qty;
    total += sub;
    orderLines += `• ${item.name} x${item.qty} = ₦${sub.toLocaleString()}\n`;
  });
  return { orderLines, total };
}

// ─── WhatsApp order sender ──────────────────────────────────────
function sendWhatsApp(name, phone, location, notes) {
  const { orderLines, total } = getOrderSummary();
  const msg =
    `*New Order — Teda Foods*\n\n` +
    `*Name:* ${name}\n` +
    `*Phone:* ${phone}\n` +
    `*Deliver to:* ${location || 'Not specified'}\n\n` +
    `*Order:*\n${orderLines}\n` +
    `*Total:* ₦${total.toLocaleString()}\n\n` +
    (notes ? `*Notes:* ${notes}\n\n` : '') +
    `Ordered via Teda Foods website`;
  window.open(`https://wa.me/2348070599262?text=${encodeURIComponent(msg)}`, '_blank');
}

// ─── Success UI state ───────────────────────────────────────────
function showSuccess(message) {
  document.getElementById('order-form-wrap').style.display = 'none';
  const sm = document.getElementById('success-msg');
  sm.style.display = 'block';
  document.getElementById('success-detail').innerHTML = message;
  document.getElementById('cart-float').classList.remove('visible');
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

// ─── Place order entry point ────────────────────────────────────
function placeOrder() {
  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const emailEl = document.getElementById('femail');
  const email = emailEl ? emailEl.value.trim() : '';
  const location = document.getElementById('flocation').value.trim();
  const notes = document.getElementById('fnotes').value.trim();

  if (!name || !phone) {
    showToast('Please enter your name and phone number.');
    return;
  }
  if (Object.keys(cart).length === 0) {
    showToast('Please select at least one item from the board above.');
    return;
  }

  if (selectedPayment === 'whatsapp') {
    sendWhatsApp(name, phone, location, notes);
    showSuccess(
      "Your order has been sent to us via WhatsApp. We'll confirm and get it ready for you!<br><br>" +
        'Questions? Call us at <a href="tel:08070599262">08070599262</a>',
    );
    return;
  }

  // Online payment via Paystack
  if (!email) {
    showToast('Please enter your email address for the payment receipt.');
    return;
  }

  const { total, orderLines } = getOrderSummary();

  const handler = PaystackPop.setup({
    key: 'pk_live_2ac524dfe7371a9ad3ea0c3befb355d7e464b3d1',
    email,
    amount: total * 100, // kobo
    currency: 'NGN',
    ref: 'TEDA-' + Date.now(),
    metadata: {
      custom_fields: [
        { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
        { display_name: 'Phone', variable_name: 'phone', value: phone },
        {
          display_name: 'Delivery Location',
          variable_name: 'location',
          value: location || 'Not specified',
        },
        { display_name: 'Order', variable_name: 'order', value: orderLines },
        { display_name: 'Notes', variable_name: 'notes', value: notes || 'None' },
      ],
    },
    callback(response) {
      // Also ping WhatsApp so merchant is notified instantly
      sendWhatsApp(
        name,
        phone,
        location,
        (notes ? notes + '\n' : '') + `PAID via Paystack. Ref: ${response.reference}`,
      );
      showSuccess(
        `Payment successful! Your order is confirmed.<br><br>` +
          `Reference: <strong>${response.reference}</strong><br><br>` +
          `We've also notified our kitchen via WhatsApp. ` +
          `Questions? Call <a href="tel:08070599262">08070599262</a>`,
      );
    },
    onClose() {
      showToast('Payment window closed. Tap "Pay Now" whenever you\'re ready.');
    },
  });
  handler.openIframe();
}

// ─── Mobile nav drawer toggle ───────────────────────────────────
function toggleMenu() {
  const links = document.getElementById('nav-links');
  const hamburger = document.getElementById('nav-hamburger');
  const isOpen = links.classList.toggle('active');

  if (hamburger) hamburger.classList.toggle('active', isOpen);

  // Backdrop mask — create once, reuse
  let mask = document.querySelector('.nav-mask');
  if (!mask) {
    mask = document.createElement('div');
    mask.className = 'nav-mask';
    document.body.appendChild(mask);
    mask.addEventListener('click', toggleMenu);
  }
  mask.classList.toggle('active', isOpen);
}

// ─── Keyboard support for nav hamburger & cart float ───────────
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();

  const hamburger = document.getElementById('nav-hamburger');
  if (hamburger) {
    hamburger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleMenu();
      }
    });
  }

  const cartFloat = document.getElementById('cart-float');
  if (cartFloat) {
    cartFloat.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
