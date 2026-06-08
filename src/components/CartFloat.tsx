interface CartFloatProps {
  count: number;
  onOrderClick: () => void;
}

export default function CartFloat({ count, onOrderClick }: CartFloatProps) {
  return (
    <button
      className={`cart-float${count > 0 ? ' visible' : ''}`}
      id="cart-float"
      aria-label="View your order"
      onClick={onOrderClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOrderClick(); } }}
    >
      <span>View Tray</span>
      <div className="cart-badge" id="cart-count">{count}</div>
    </button>
  );
}
