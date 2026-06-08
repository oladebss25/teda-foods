export default function Hero() {
  return (
    <>
      <div className="identity-strip">
        <div className="identity-text">
          <div className="identity-eyebrow">
            <i className="hgi-stroke hgi-location-01 icon-inline" />
            Alabata Abeokuta · FUNAAB
          </div>
          <h1 className="identity-headline">Crave. Eat.<br /><em>Repeat.</em></h1>
          <p className="identity-sub">
            Fresh jollof, fried rice, grilled proteins &amp; more — made to order, served hot, right here on campus.
          </p>
          <div className="identity-actions">
            <a href="#menu" className="btn-primary">See Today's Menu</a>
            <a href="#order" className="btn-ghost-light">Place an Order</a>
          </div>
        </div>
        <div className="identity-meta">
          <div className="identity-badge">
            <span className="identity-badge-num">100%</span>
            <div className="identity-badge-label">Homemade</div>
          </div>
          <div className="identity-badge">
            <span className="identity-badge-num">Fresh</span>
            <div className="identity-badge-label">Made daily</div>
          </div>
        </div>
      </div>

      <div className="ticker" aria-hidden="true">
        <div className="ticker-track">
          {[
            ['Jollof Rice + Chicken + Zobo ₦3,000', 'Jollof Rice + Turkey + Zobo ₦4,000', 'Asun Jollof + Chicken ₦3,500', 'Stir Fry Pasta + Chicken ₦2,500', 'Fried Rice + Chicken ₦2,800', "Teda's Milkshake (50cl) ₦2,000", 'Ofada Rice Special ₦2,700', 'Ewa-agoyin (with protein) ₦2,500', "Teda's Zobo (35cl) ₦700", 'Fried Fish ₦500'],
            ['Jollof Rice + Chicken + Zobo ₦3,000', 'Jollof Rice + Turkey + Zobo ₦4,000', 'Asun Jollof + Chicken ₦3,500', 'Stir Fry Pasta + Chicken ₦2,500', 'Fried Rice + Chicken ₦2,800', "Teda's Milkshake (50cl) ₦2,000", 'Ofada Rice Special ₦2,700', 'Ewa-agoyin (with protein) ₦2,500', "Teda's Zobo (35cl) ₦700", 'Fried Fish ₦500'],
          ].flat().map((item, i) => (
            <span key={i}>
              <span className="ticker-item">{item}</span>
              <span className="ticker-dot">·</span>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
