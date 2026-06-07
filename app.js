// ─────────────────────────────────────────────
//  Teda Foods — app.js
// ─────────────────────────────────────────────

const CONFIG = {
  phone: '08070599262',
  phoneInternational: '2348070599262',
  paystackPublicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_live_2ac524dfe7371a9ad3ea0c3befb355d7e464b3d1',
  placeholderImage: 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 220 148%22%3E%3Crect fill=%22%232a2a2a%22 width=%22220%22 height=%22148%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22central%22 text-anchor=%22middle%22 fill=%22%23666%22 font-size=%2216%22 font-family=%22sans-serif%22%3EImage unavailable%3C/text%3E%3C/svg%3E',
};

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
let isSubmitting = false;
let lastSubmitTime = 0;

function sanitize(str) {
  const d = document.createElement('div');
  d.textContent = str;
  return d.textContent;
}

function truncate(str, max) {
  return str.length > max ? str.slice(0, max) : str;
}

function createEl(tag, attrs) {
  const el = document.createElement(tag);
  if (attrs) {
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
  }
  return el;
}

// ─── Render menu ───────────────────────────────────────────────
function renderMenu() {
  const container = document.getElementById('menu-container');
  if (!container) return;

  const fragment = document.createDocumentFragment();

  menuData.forEach((cat) => {
    const catBlock = createEl('div', { class: 'cat-block reveal' });
    const header = createEl('div', { class: 'cat-header' });
    const label = createEl('div', { class: 'cat-label' });
    label.textContent = cat.category;
    header.appendChild(label);
    const rule = createEl('div', { class: 'cat-rule' });
    header.appendChild(rule);
    catBlock.appendChild(header);

    const grid = createEl('div', { class: 'menu-grid stagger-children' });
    catBlock.appendChild(grid);

    cat.items.forEach((item) => {
      const card = createEl('div', {
        class: 'menu-card',
        'data-id': item.id,
        'data-name': item.name,
        'data-price': String(item.price),
        tabindex: '0',
        role: 'button',
        'aria-label': `Add ${item.displayName} — ${item.displayPrice}`,
      });

      const imgWrap = createEl('div', { class: 'card-img' });
      const picture = createEl('picture');
      const webpPath = item.image.replace(/\.png$/, '.webp');
      const source = createEl('source', {
        srcset: webpPath,
        type: 'image/webp',
      });
      const fallback = createEl('img', {
        src: item.image,
        alt: item.displayName,
        loading: 'lazy',
        width: '220',
        height: '148',
      });
      fallback.addEventListener('error', () => { fallback.src = CONFIG.placeholderImage; });
      picture.appendChild(source);
      picture.appendChild(fallback);
      imgWrap.appendChild(picture);
      card.appendChild(imgWrap);

      const body = createEl('div', { class: 'card-body' });
      const nameEl = createEl('div', { class: 'card-name' });
      nameEl.textContent = item.displayName;
      body.appendChild(nameEl);

      const footer = createEl('div', { class: 'card-footer' });
      const priceEl = createEl('div', { class: 'card-price' });
      priceEl.textContent = item.displayPrice;
      footer.appendChild(priceEl);

      const actions = createEl('div', { class: 'card-actions' });
      const addBtn = createEl('button', {
        class: 'btn-add main-plus',
        'aria-label': `Add ${item.displayName}`,
        type: 'button',
      });
      addBtn.textContent = '+';
      actions.appendChild(addBtn);

      const qtyWrap = createEl('div', { class: 'card-qty' });
      const decBtn = createEl('button', {
        class: 'qty-btn',
        'aria-label': 'Decrease quantity',
        type: 'button',
      });
      decBtn.textContent = '−';
      const qtyNum = createEl('span', { class: 'qty-num' });
      qtyNum.textContent = '1';
      const incBtn = createEl('button', {
        class: 'qty-btn',
        'aria-label': 'Increase quantity',
        type: 'button',
      });
      incBtn.textContent = '+';
      qtyWrap.appendChild(decBtn);
      qtyWrap.appendChild(qtyNum);
      qtyWrap.appendChild(incBtn);
      actions.appendChild(qtyWrap);
      footer.appendChild(actions);
      body.appendChild(footer);
      card.appendChild(body);

      card.addEventListener('click', () => toggleItem(card));
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleItem(card);
        }
      });

      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleItem(card);
      });
      decBtn.addEventListener('click', (e) => changeQty(e, decBtn, -1));
      incBtn.addEventListener('click', (e) => changeQty(e, incBtn, 1));

      grid.appendChild(card);
    });

    fragment.appendChild(catBlock);
  });

  container.appendChild(fragment);
}

// ─── Payment method selector ──────────────────────────────────
function selectPayment(type) {
  selectedPayment = type;
  const online = document.getElementById('pay-online');
  const whatsapp = document.getElementById('pay-whatsapp');
  online.classList.toggle('active', type === 'online');
  whatsapp.classList.toggle('active', type === 'whatsapp');
  online.setAttribute('aria-checked', type === 'online');
  whatsapp.setAttribute('aria-checked', type === 'whatsapp');

  const btn = document.getElementById('submit-btn');
  const btnText = btn.querySelector('.btn-text');
  const btnIcon = btn.querySelector('.btn-icon');
  const note = document.querySelector('.pay-note');
  if (type === 'online') {
    if (btnText) btnText.textContent = 'Pay Now — Secure Checkout';
    if (btnIcon) btnIcon.innerHTML = '<i class="hgi-stroke hgi-credit-card icon-inline"></i>';
    if (note) {
      note.textContent = '';
      const s1 = document.createElement('strong');
      s1.textContent = 'Paystack';
      note.appendChild(document.createTextNode('Powered by '));
      note.appendChild(s1);
      note.appendChild(document.createTextNode(' — 100% secure. Cards, bank transfer & USSD accepted.'));
    }
  } else {
    if (btnText) btnText.textContent = 'Send Order via WhatsApp';
    if (btnIcon) btnIcon.innerHTML = '<i class="hgi-stroke hgi-whatsapp icon-inline"></i>';
    if (note) {
      note.textContent = '';
      note.appendChild(document.createTextNode("Your order will open in WhatsApp. We'll confirm & get it ready fast. "));
      const span = document.createElement('span');
      span.className = 'pay-note-success';
      span.textContent = 'Fast & easy!';
      note.appendChild(span);
    }
  }
}

// ─── Toggle item in/out of cart ──────────────────────────────
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
      price: parseInt(card.dataset.price, 10),
      qty: 1,
    };
  }
  updateCart();
}

// ─── Quantity change ──────────────────────────────────────────
function changeQty(e, btn, delta) {
  e.stopPropagation();
  const card = btn.closest('.menu-card');
  const id = card.dataset.id;
  const qtyEl = card.querySelector('.qty-num');
  let qty = parseInt(qtyEl.textContent, 10) + delta;
  if (qty < 1) {
    toggleItem(card);
    return;
  }
  qtyEl.textContent = qty;
  if (cart[id]) cart[id].qty = qty;
  updateCart();
}

// ─── Sync DOM with cart state ─────────────────────────────────
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

  osItems.textContent = '';
  const fragment = document.createDocumentFragment();
  let total = 0;
  ids.forEach((id) => {
    const item = cart[id];
    const sub = item.price * item.qty;
    total += sub;

    const row = createEl('div', { class: 'tray-item' });
    const nameDiv = createEl('div', { class: 'tray-item-name' });
    nameDiv.textContent = item.name;
    row.appendChild(nameDiv);

    const right = createEl('div', { class: 'tray-item-right' });
    const priceDiv = createEl('div', { class: 'tray-item-price' });
    priceDiv.textContent = '₦' + sub.toLocaleString();
    right.appendChild(priceDiv);
    const qtyDiv = createEl('div', { class: 'tray-item-qty' });
    qtyDiv.textContent = 'x' + item.qty + ' @ ₦' + item.price.toLocaleString();
    right.appendChild(qtyDiv);
    row.appendChild(right);

    fragment.appendChild(row);
  });
  osItems.appendChild(fragment);
  totalAmt.textContent = '₦' + total.toLocaleString();
}

// ─── Toast ─────────────────────────────────────────────────────
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ─── Cart summary ──────────────────────────────────────────────
function getOrderSummary() {
  let orderLines = '';
  let total = 0;
  Object.values(cart).forEach((item) => {
    const sub = item.price * item.qty;
    total += sub;
    orderLines += '• ' + item.name + ' x' + item.qty + ' = ₦' + sub.toLocaleString() + '\n';
  });
  return { orderLines, total };
}

// ─── WhatsApp order sender ────────────────────────────────────
function sendWhatsApp(name, phone, location, notes) {
  const { orderLines, total } = getOrderSummary();
  const msg =
    '*New Order — Teda Foods*\n\n' +
    '*Name:* ' + name + '\n' +
    '*Phone:* ' + phone + '\n' +
    '*Deliver to:* ' + (location || 'Not specified') + '\n\n' +
    '*Order:*\n' + orderLines + '\n' +
    '*Total:* ₦' + total.toLocaleString() + '\n\n' +
    (notes ? '*Notes:* ' + notes + '\n\n' : '') +
    'Ordered via Teda Foods website';
  window.open('https://wa.me/' + CONFIG.phoneInternational + '?text=' + encodeURIComponent(msg), '_blank');
}

// ─── Inline validation ────────────────────────────────────────
const validators = {
  fname: {
    test: (v) => v.trim().length >= 2,
    msg: 'Please enter your name (at least 2 characters).',
  },
  fphone: {
    test: (v) => /^0\d{10}$/.test(v.trim()),
    msg: 'Enter a valid Nigerian phone number (e.g. 08012345678).',
  },
  femail: {
    test: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    msg: 'Enter a valid email address.',
  },
};

function validateField(id) {
  const el = document.getElementById(id);
  const errorEl = document.getElementById(id + '-error');
  const group = el.closest('.form-group');
  const raw = el.value;
  const val = raw.trim();
  const rule = validators[id];
  let valid = true;

  if (rule) {
    valid = rule.test(raw);
  } else {
    valid = val.length > 0 || !el.hasAttribute('required');
  }

  if (!valid) {
    errorEl.textContent = rule ? rule.msg : 'This field is required.';
    errorEl.classList.add('visible');
    if (group) group.classList.add('has-error');
  } else {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
    if (group) group.classList.remove('has-error');
  }
  return valid;
}

function validateAll() {
  const fields = ['fname', 'fphone', 'femail'];
  let allValid = true;
  let firstInvalid = null;
  fields.forEach((id) => {
    const ok = validateField(id);
    if (!ok) {
      allValid = false;
      if (!firstInvalid) firstInvalid = document.getElementById(id);
    }
  });
  if (firstInvalid) firstInvalid.focus();
  return allValid;
}

// ─── Form submit handler ──────────────────────────────────────
function placeOrder(e) {
  if (e) e.preventDefault();

  if (isSubmitting) return;
  const now = Date.now();
  if (now - lastSubmitTime < 3000) {
    showToast('Please wait a moment before trying again.');
    return;
  }

  const name = document.getElementById('fname').value.trim();
  const phone = document.getElementById('fphone').value.trim();
  const emailEl = document.getElementById('femail');
  const email = emailEl ? emailEl.value.trim() : '';
  const location = document.getElementById('flocation').value.trim();
  const notes = sanitize(truncate(document.getElementById('fnotes').value.trim(), 500));

  if (!validateAll()) return;

  if (Object.keys(cart).length === 0) {
    showToast('Please select at least one item from the board above.');
    return;
  }

  isSubmitting = true;
  lastSubmitTime = now;
  const btn = document.getElementById('submit-btn');
  const spinner = document.getElementById('submit-spinner');
  btn.disabled = true;
  btn.classList.add('loading');
  spinner.classList.add('visible');

  if (selectedPayment === 'whatsapp') {
    sendWhatsApp(name, phone, location, notes);
    isSubmitting = false;
    btn.disabled = false;
    btn.classList.remove('loading');
    spinner.classList.remove('visible');
    showSuccess(
      "Your order has been sent to us via WhatsApp. We'll confirm and get it ready for you!<br><br>" +
        'Questions? Call us at <a href="tel:' + CONFIG.phone + '">' + CONFIG.phone + '</a>',
    );
    return;
  }

  if (!email) {
    showToast('Please enter your email address for the payment receipt.');
    isSubmitting = false;
    btn.disabled = false;
    btn.classList.remove('loading');
    spinner.classList.remove('visible');
    return;
  }

  const { total, orderLines } = getOrderSummary();
  const ref = 'TEDA-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);

  const handler = PaystackPop.setup({
    key: CONFIG.paystackPublicKey,
    email,
    amount: total * 100,
    currency: 'NGN',
    ref: ref,
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
      sendWhatsApp(
        name,
        phone,
        location,
        (notes ? notes + '\n' : '') + 'PAID via Paystack. Ref: ' + response.reference,
      );
      isSubmitting = false;
      btn.disabled = false;
      btn.classList.remove('loading');
      spinner.classList.remove('visible');
      showSuccess(
        'Payment successful! Your order is confirmed.<br><br>' +
          'Reference: <strong>' + response.reference + '</strong><br><br>' +
          "We've also notified our kitchen via WhatsApp. " +
          'Questions? Call <a href="tel:' + CONFIG.phone + '">' + CONFIG.phone + '</a>',
      );
    },
    onClose() {
      isSubmitting = false;
      btn.disabled = false;
      btn.classList.remove('loading');
      spinner.classList.remove('visible');
      showToast("Payment window closed. Tap 'Pay Now' whenever you're ready.");
    },
  });
  handler.openIframe();
}

// ─── Success ──────────────────────────────────────────────────
function showSuccess(message) {
  document.getElementById('order-form-wrap').style.display = 'none';
  const sm = document.getElementById('success-msg');
  sm.style.display = 'block';
  const detail = document.getElementById('success-detail');
  detail.textContent = '';
  const p = document.createElement('p');
  p.innerHTML = message;
  detail.appendChild(p);
  document.getElementById('cart-float').classList.remove('visible');
  document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
}

// ─── Mobile nav drawer ────────────────────────────────────────
function toggleMenu() {
  const links = document.getElementById('nav-links');
  const hamburger = document.getElementById('nav-hamburger');
  const isOpen = links.classList.toggle('active');

  if (hamburger) {
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  }

  let mask = document.querySelector('.nav-mask');
  if (!mask) {
    mask = document.createElement('div');
    mask.className = 'nav-mask';
    document.body.appendChild(mask);
    mask.addEventListener('click', toggleMenu);
  }
  mask.classList.toggle('active', isOpen);

  if (isOpen) {
    trapFocus(links);
  } else {
    releaseFocus();
  }
}

// ─── Focus trap ──────────────────────────────────────────────
let focusTrapRoot = null;
let focusTrapActive = false;

function trapFocus(root) {
  focusTrapRoot = root;
  focusTrapActive = true;
}

function releaseFocus() {
  focusTrapActive = false;
  focusTrapRoot = null;
}

function handleTab(e) {
  if (!focusTrapActive || !focusTrapRoot) return;
  const focusable = focusTrapRoot.querySelectorAll('a[href], button, [tabindex]:not([tabindex="-1"])');
  if (focusable.length === 0) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];
  if (e.shiftKey) {
    if (document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  } else {
    if (document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }
}

// ─── Intersection Observer ────────────────────────────────────
let observer = null;

function initRevealObserver() {
  if (observer) observer.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll('.reveal, .stagger-children').forEach((el) => {
    observer.observe(el);
  });
}

// ─── DOMContentLoaded ─────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  initRevealObserver();

  const form = document.getElementById('order-form');
  if (form) {
    form.addEventListener('submit', placeOrder);
  }

  const hamburger = document.getElementById('nav-hamburger');
  if (hamburger) {
    hamburger.setAttribute('aria-haspopup', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
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

  document.querySelectorAll('.pay-option').forEach((el) => {
    el.addEventListener('click', () => {
      const type = el.id === 'pay-online' ? 'online' : 'whatsapp';
      selectPayment(type);
    });
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const type = el.id === 'pay-online' ? 'online' : 'whatsapp';
        selectPayment(type);
      }
    });
  });

  ['fname', 'fphone'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => validateField(id));
  });
  const emailEl = document.getElementById('femail');
  if (emailEl) emailEl.addEventListener('blur', () => validateField('femail'));

  document.addEventListener('keydown', handleTab);

  function scrollToOrder() {
    document.getElementById('order').scrollIntoView({ behavior: 'smooth' });
  }
  const navCta = document.getElementById('nav-cta');
  if (navCta) navCta.addEventListener('click', scrollToOrder);
  const promoBtn = document.getElementById('promo-stripe-btn');
  if (promoBtn) promoBtn.addEventListener('click', scrollToOrder);

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 640) {
        const links = document.getElementById('nav-links');
        if (links && links.classList.contains('active')) toggleMenu();
      }
    });
  });
});
