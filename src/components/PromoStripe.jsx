export default function PromoStripe({ onOrderClick }) {
  return (
    <div className="promo-stripe">
      <div>
        <div className="promo-stripe-text">First order? We've got you!</div>
        <div className="promo-stripe-sub">Tell us it's your first time when ordering — enjoy a little treat on us.</div>
      </div>
      <button className="promo-stripe-btn" id="promo-stripe-btn" onClick={onOrderClick}>Order Now →</button>
    </div>
  );
}
