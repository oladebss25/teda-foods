import { useRef, useCallback, useEffect } from 'react';

export default function Nav({ onOrderClick }) {
  const linksRef = useRef(null);
  const hamburgerRef = useRef(null);

  const toggleMenu = useCallback(() => {
    const links = linksRef.current;
    const hamburger = hamburgerRef.current;
    if (!links || !hamburger) return;

    const isOpen = links.classList.toggle('active');
    hamburger.classList.toggle('active', isOpen);
    hamburger.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    hamburger.setAttribute('aria-expanded', String(isOpen));

    let mask = document.querySelector('.nav-mask');
    if (!mask) {
      mask = document.createElement('div');
      mask.className = 'nav-mask';
      document.body.appendChild(mask);
      mask.addEventListener('click', toggleMenu);
    }
    mask.classList.toggle('active', isOpen);
  }, []);

  const closeMobile = useCallback(() => {
    if (window.innerWidth <= 640) {
      const links = linksRef.current;
      if (links && links.classList.contains('active')) toggleMenu();
    }
  }, [toggleMenu]);

  useEffect(() => {
    const hamburger = hamburgerRef.current;
    if (!hamburger) return;
    hamburger.setAttribute('aria-haspopup', 'true');
    hamburger.setAttribute('aria-expanded', 'false');
  }, []);

  return (
    <nav className="site-nav" id="top">
      <div className="nav-logo">
        <img src="images/teda_foods_logo.png" alt="Teda Foods" loading="eager" />
        Teda <span className="nav-logo-accent">Foods</span>
      </div>
      <ul className="nav-links" id="nav-links" ref={linksRef}>
        <li><a href="#menu" onClick={closeMobile}>Menu</a></li>
        <li><a href="#order" onClick={closeMobile}>Order</a></li>
        <li><a href="#contact" onClick={closeMobile}>Contact</a></li>
      </ul>
      <button className="nav-cta" onClick={onOrderClick}>Order Now</button>
      <button
        className="nav-hamburger"
        id="nav-hamburger"
        aria-label="Open menu"
        type="button"
        ref={hamburgerRef}
        onClick={toggleMenu}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleMenu(); } }}
      >
        <span /><span /><span />
      </button>
    </nav>
  );
}
