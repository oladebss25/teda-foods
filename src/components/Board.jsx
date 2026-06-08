import { useCallback } from 'react';
import { CONFIG } from '../data/config';

export default function Board({ cart, onToggle, onChangeQty, menuData }) {
  const handleToggle = useCallback((id, name, price) => {
    onToggle(id, name, price);
  }, [onToggle]);

  const handleQty = useCallback((e, id, delta) => {
    e.stopPropagation();
    onChangeQty(id, delta);
  }, [onChangeQty]);

  return (
    <section className="board-section" id="menu">
      <div className="board-header">
        <h2 className="board-title">Today's Board</h2>
        <p className="board-sub">Tap any item to add it to your tray</p>
      </div>

      {menuData.map((cat) => (
        <div className="cat-block reveal" key={cat.category}>
          <div className="cat-header">
            <div className="cat-label">{cat.category}</div>
            <div className="cat-rule" />
          </div>
          <div className="menu-grid stagger-children">
            {cat.items.map((item) => {
              const selected = !!cart[item.id];
              const cartItem = cart[item.id];
              return (
                <div
                  className={`menu-card${selected ? ' selected' : ''}`}
                  key={item.id}
                  data-id={item.id}
                  tabIndex={0}
                  role="button"
                  aria-label={`Add ${item.displayName} — ${item.displayPrice}`}
                  onClick={() => handleToggle(item.id, item.name, item.price)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleToggle(item.id, item.name, item.price);
                    }
                  }}
                >
                  <div className="card-img">
                    <picture>
                      <source srcSet={item.image.replace(/\.png$/, '.webp')} type="image/webp" />
                      <img
                        src={item.image}
                        alt={item.displayName}
                        loading="lazy"
                        width="220"
                        height="148"
                        onError={(e) => { e.target.src = CONFIG.placeholderImage; }}
                      />
                    </picture>
                  </div>
                  <div className="card-body">
                    <div className="card-name">{item.displayName}</div>
                    <div className="card-footer">
                      <div className="card-price">{item.displayPrice}</div>
                      <div className="card-actions">
                        <button
                          className="btn-add main-plus"
                          aria-label={`Add ${item.displayName}`}
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleToggle(item.id, item.name, item.price); }}
                        >+</button>
                        <div className="card-qty">
                          <button
                            className="qty-btn"
                            aria-label="Decrease quantity"
                            type="button"
                            onClick={(e) => handleQty(e, item.id, -1)}
                          >−</button>
                          <span className="qty-num">{cartItem ? cartItem.qty : 1}</span>
                          <button
                            className="qty-btn"
                            aria-label="Increase quantity"
                            type="button"
                            onClick={(e) => handleQty(e, item.id, 1)}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
