import { useState, useRef, useCallback } from 'react';
import { CONFIG } from '../data/config';

export default function Checkout({ cart, getTotal, getSummary, clearCart, showToast }) {
  const [paymentMethod, setPaymentMethod] = useState('online');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [successHtml, setSuccessHtml] = useState('');
  const formRef = useRef(null);
  const lastSubmitRef = useRef(0);

  const fields = {
    fname: { test: (v) => v.trim().length >= 2, msg: 'Please enter your name (at least 2 characters).' },
    fphone: { test: (v) => /^0\d{10}$/.test(v.trim()), msg: 'Enter a valid Nigerian phone number (e.g. 08012345678).' },
    femail: { test: (v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), msg: 'Enter a valid email address.' },
  };

  const validateField = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return true;
    const errorEl = document.getElementById(id + '-error');
    const group = el.closest('.form-group');
    const rule = fields[id];
    let valid = true;
    if (rule) {
      valid = rule.test(el.value);
    } else {
      valid = el.value.trim().length > 0 || !el.hasAttribute('required');
    }
    if (!valid) {
      if (errorEl) { errorEl.textContent = rule ? rule.msg : 'This field is required.'; errorEl.classList.add('visible'); }
      if (group) group.classList.add('has-error');
    } else {
      if (errorEl) { errorEl.textContent = ''; errorEl.classList.remove('visible'); }
      if (group) group.classList.remove('has-error');
    }
    return valid;
  }, []);

  const validateAll = useCallback(() => {
    const ids = ['fname', 'fphone', 'femail'];
    let allValid = true;
    let firstInvalid = null;
    ids.forEach((id) => {
      const ok = validateField(id);
      if (!ok) { allValid = false; if (!firstInvalid) firstInvalid = document.getElementById(id); }
    });
    if (firstInvalid) firstInvalid.focus();
    return allValid;
  }, [validateField]);

  const sendWhatsApp = useCallback((name, phone, location, notes) => {
    const orderLines = getSummary();
    const total = getTotal();
    const msg =
      '*New Order — Teda Foods*\n\n*Name:* ' + name + '\n*Phone:* ' + phone + '\n*Deliver to:* ' + (location || 'Not specified') + '\n\n*Order:*\n' + orderLines + '\n*Total:* ₦' + total.toLocaleString() + '\n\n' + (notes ? '*Notes:* ' + notes + '\n\n' : '') + 'Ordered via Teda Foods website';
    window.open('https://wa.me/' + CONFIG.phoneInternational + '?text=' + encodeURIComponent(msg), '_blank');
  }, [getSummary, getTotal]);

  const showSuccess = useCallback((html) => {
    document.getElementById('order-form-wrap').style.display = 'none';
    const sm = document.getElementById('success-msg');
    if (sm) {
      sm.style.display = 'block';
      const detail = document.getElementById('success-detail');
      if (detail) detail.innerHTML = html;
    }
    setOrderPlaced(true);
    setSuccessHtml(html);
    clearCart();
    setTimeout(() => document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [clearCart]);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    const now = Date.now();
    if (now - lastSubmitRef.current < 3000) { showToast('Please wait a moment before trying again.'); return; }
    lastSubmitRef.current = now;

    const name = document.getElementById('fname')?.value.trim() || '';
    const phone = document.getElementById('fphone')?.value.trim() || '';
    const email = document.getElementById('femail')?.value.trim() || '';
    const location = document.getElementById('flocation')?.value.trim() || '';
    const notesRaw = document.getElementById('fnotes')?.value.trim() || '';
    const notes = notesRaw.slice(0, 500);

    if (!validateAll()) return;

    const count = Object.keys(cart).length;
    if (count === 0) { showToast('Please select at least one item from the board above.'); return; }

    setIsSubmitting(true);
    const btn = document.getElementById('submit-btn');
    const spinner = document.getElementById('submit-spinner');
    if (btn) { btn.disabled = true; btn.classList.add('loading'); }
    if (spinner) spinner.classList.add('visible');

    if (paymentMethod === 'whatsapp') {
      sendWhatsApp(name, phone, location, notes);
      setIsSubmitting(false);
      if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
      if (spinner) spinner.classList.remove('visible');
      showSuccess("Your order has been sent to us via WhatsApp. We'll confirm and get it ready for you!<br><br>Questions? Call us at <a href='tel:" + CONFIG.phone + "'>" + CONFIG.phone + '</a>');
      return;
    }

    if (!email) {
      showToast('Please enter your email address for the payment receipt.');
      setIsSubmitting(false);
      if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
      if (spinner) spinner.classList.remove('visible');
      return;
    }

    const total = getTotal();
    const orderLines = getSummary();
    const ref = 'TEDA-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);

    try {
      const response = await fetch(CONFIG.apiBase + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, email, location, notes, orderLines, total, paymentRef: ref, paymentMethod: 'online' }),
      });
      const data = await response.json();

      if (data.paystackKey) {
        const handler = window.PaystackPop.setup({
          key: data.paystackKey,
          email,
          amount: total * 100,
          currency: 'NGN',
          ref: data.reference || ref,
          metadata: {
            custom_fields: [
              { display_name: 'Customer Name', variable_name: 'customer_name', value: name },
              { display_name: 'Phone', variable_name: 'phone', value: phone },
              { display_name: 'Delivery Location', variable_name: 'location', value: location || 'Not specified' },
              { display_name: 'Order', variable_name: 'order', value: orderLines },
              { display_name: 'Notes', variable_name: 'notes', value: notes || 'None' },
            ],
          },
          callback(response) {
            fetch(CONFIG.apiBase + '/api/orders/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ reference: response.reference }),
            }).catch(() => {});
            sendWhatsApp(name, phone, location, (notes ? notes + '\n' : '') + 'PAID via Paystack. Ref: ' + response.reference);
            setIsSubmitting(false);
            if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
            if (spinner) spinner.classList.remove('visible');
            showSuccess('Payment successful! Your order is confirmed.<br><br>Reference: <strong>' + response.reference + '</strong><br><br>We\'ve also notified our kitchen via WhatsApp. Questions? Call <a href="tel:' + CONFIG.phone + '">' + CONFIG.phone + '</a>');
          },
          onClose() {
            setIsSubmitting(false);
            if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
            if (spinner) spinner.classList.remove('visible');
            showToast("Payment window closed. Tap 'Pay Now' whenever you're ready.");
          },
        });
        handler.openIframe();
      } else {
        sendWhatsApp(name, phone, location, notes);
        setIsSubmitting(false);
        if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
        if (spinner) spinner.classList.remove('visible');
        if (data.message) showSuccess(data.message);
        else showSuccess("Your order has been sent to us! We'll confirm shortly.");
      }
    } catch (err) {
      sendWhatsApp(name, phone, location, notes);
      setIsSubmitting(false);
      if (btn) { btn.disabled = false; btn.classList.remove('loading'); }
      if (spinner) spinner.classList.remove('visible');
      showSuccess("Your order has been sent to us via WhatsApp. We'll confirm and get it ready for you!");
    }
  }, [cart, getTotal, getSummary, paymentMethod, isSubmitting, validateAll, showToast, sendWhatsApp, showSuccess]);

  const selectPayment = useCallback((type) => {
    setPaymentMethod(type);
    const online = document.getElementById('pay-online');
    const whatsapp = document.getElementById('pay-whatsapp');
    if (online) { online.classList.toggle('active', type === 'online'); online.setAttribute('aria-checked', type === 'online'); }
    if (whatsapp) { whatsapp.classList.toggle('active', type === 'whatsapp'); whatsapp.setAttribute('aria-checked', type === 'whatsapp'); }
    const btn = document.getElementById('submit-btn');
    const btnText = btn?.querySelector('.btn-text');
    const btnIcon = btn?.querySelector('.btn-icon');
    const note = document.querySelector('.pay-note');
    if (type === 'online') {
      if (btnText) btnText.textContent = 'Pay Now — Secure Checkout';
      if (btnIcon) btnIcon.innerHTML = '<i class="hgi-stroke hgi-credit-card icon-inline"></i>';
      if (note) note.innerHTML = 'Powered by <strong>Paystack</strong> — 100% secure. Cards, bank transfer & USSD accepted.';
    } else {
      if (btnText) btnText.textContent = 'Send Order via WhatsApp';
      if (btnIcon) btnIcon.innerHTML = '<i class="hgi-stroke hgi-whatsapp icon-inline"></i>';
      if (note) note.innerHTML = 'Your order will open in WhatsApp. We\'ll confirm & get it ready fast. <span class="pay-note-success">Fast & easy!</span>';
    }
  }, []);

  const ids = Object.keys(cart);
  const total = getTotal();

  return (
    <section className="checkout-section" id="order">
      <div className="checkout-layout">
        <div>
          <div className="order-tray">
            <div className="tray-title">
              <i className="hgi-stroke hgi-shopping-cart-01 icon-inline" />
              Your Tray
            </div>
            {ids.length === 0 ? (
              <div className="tray-empty">Nothing here yet — go tap something from the board above!</div>
            ) : (
              <>
                <div className="tray-items" id="order-items">
                  {ids.map((id) => {
                    const item = cart[id];
                    const sub = item.price * item.qty;
                    return (
                      <div className="tray-item" key={id}>
                        <div className="tray-item-name">{item.name}</div>
                        <div className="tray-item-right">
                          <div className="tray-item-price">₦{sub.toLocaleString()}</div>
                          <div className="tray-item-qty">x{item.qty} @ ₦{item.price.toLocaleString()}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="tray-total" id="order-total">
                  <div className="tray-total-label">Total</div>
                  <div className="tray-total-amount" id="total-amt">₦{total.toLocaleString()}</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div>
          <div id="order-form-wrap" style={{ display: orderPlaced ? 'none' : 'block' }}>
            <div className="form-head">
              <h2 className="form-title">Your details</h2>
              <p className="form-sub">Fill this in to complete your order</p>
            </div>

            <form id="order-form" noValidate onSubmit={handleSubmit} ref={formRef}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fname">Your Name</label>
                  <input type="text" id="fname" placeholder="e.g. Amaka Obi" autoComplete="name" required onBlur={() => validateField('fname')} />
                  <span className="field-error" id="fname-error" />
                </div>
                <div className="form-group">
                  <label htmlFor="fphone">Phone Number</label>
                  <input type="tel" id="fphone" placeholder="e.g. 08012345678" autoComplete="tel" required onBlur={() => validateField('fphone')} />
                  <span className="field-error" id="fphone-error" />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="femail">Email Address</label>
                <input type="email" id="femail" placeholder="e.g. amaka@email.com" autoComplete="email" onBlur={() => validateField('femail')} />
                <span className="field-error" id="femail-error" />
              </div>

              <div className="form-group">
                <label htmlFor="flocation">Delivery / Pickup Location</label>
                <input type="text" id="flocation" placeholder="e.g. Block C hostel, FUNAAB or Come pick up" />
              </div>

              <div className="form-group">
                <label htmlFor="fnotes">Extra Notes (optional)</label>
                <textarea id="fnotes" placeholder="e.g. Extra spicy, less oil, no onions..." />
              </div>

              <div className="form-group">
                <label>How would you like to pay?</label>
                <div className="pay-methods" role="radiogroup" aria-label="Payment method">
                  <div className="pay-option active" id="pay-online" role="radio" aria-checked="true" tabIndex={0} onClick={() => selectPayment('online')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPayment('online'); } }}>
                    <div className="pay-option-icon"><i className="hgi-stroke hgi-credit-card icon-inline" /></div>
                    <div>
                      <div className="pay-option-label">Pay Online</div>
                      <div className="pay-option-sub">Card / Transfer / USSD</div>
                    </div>
                  </div>
                  <div className="pay-option" id="pay-whatsapp" role="radio" aria-checked="false" tabIndex={-1} onClick={() => selectPayment('whatsapp')} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectPayment('whatsapp'); } }}>
                    <div className="pay-option-icon"><i className="hgi-stroke hgi-whatsapp icon-inline" /></div>
                    <div>
                      <div className="pay-option-label">Pay on WhatsApp</div>
                      <div className="pay-option-sub">Confirm &amp; pay via chat</div>
                    </div>
                  </div>
                </div>
              </div>

              <button className="btn-submit" id="submit-btn" type="submit">
                <span className="btn-icon"><i className="hgi-stroke hgi-credit-card icon-inline" /></span>
                <span className="btn-text">Pay Now — Secure Checkout</span>
              </button>
              <div className="spinner" id="submit-spinner" aria-hidden="true" />
            </form>

            <p className="pay-note">Powered by <strong>Paystack</strong> — 100% secure. Cards, bank transfer &amp; USSD accepted.</p>
          </div>

          <div className="success-msg" id="success-msg" style={{ display: orderPlaced ? 'block' : 'none' }}>
            <div className="icon"><i className="hgi-stroke hgi-checkmark-circle-01 icon-success" /></div>
            <h3>Order placed!</h3>
            <p id="success-detail" dangerouslySetInnerHTML={{ __html: successHtml }} />
          </div>
        </div>
      </div>
    </section>
  );
}
