import { useState, useRef, useCallback, useEffect } from 'react';
import { menuData } from './data/menu';
import { useCart } from './hooks/useCart';
import { useReveal } from './hooks/useReveal';
import SkipLink from './components/SkipLink';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Board from './components/Board';
import StorySection from './components/StorySection';
import PromoStripe from './components/PromoStripe';
import Checkout from './components/Checkout';
import Footer from './components/Footer';
import Toast from './components/Toast';
import CartFloat from './components/CartFloat';
import GrainOverlay from './components/GrainOverlay';
import GlowOrbs from './components/GlowOrbs';

export default function App() {
  const { cart, toggleItem, changeQty, getTotal, getSummary, clearCart } = useCart();
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const revealRef = useReveal();

  const toastTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const showToast = useCallback((msg: string) => {
    setToastMsg(msg);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2800);
  }, []);

  const scrollToOrder = useCallback(() => {
    document.getElementById('order')?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').catch(() => {});
      });
    }
  }, []);

  useEffect(() => {
    const handleTab = (e: KeyboardEvent) => {
      const links = document.getElementById('nav-links');
      if (!links || !links.classList.contains('active')) return;
      const focusable = links.querySelectorAll<HTMLElement>('a[href], button, [tabindex]:not([tabindex="-1"])');
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener('keydown', handleTab);
    return () => document.removeEventListener('keydown', handleTab);
  }, []);

  return (
    <div ref={revealRef}>
      <SkipLink />
      <Nav onOrderClick={scrollToOrder} />
      <Hero />
      <Board cart={cart} onToggle={toggleItem} onChangeQty={changeQty} menuData={menuData} />
      <StorySection />
      <PromoStripe onOrderClick={scrollToOrder} />
      <Checkout
        cart={cart}
        getTotal={getTotal}
        getSummary={getSummary}
        clearCart={clearCart}
        showToast={showToast}
      />
      <Footer />
      <Toast message={toastMsg} />
      <CartFloat count={Object.keys(cart).length} onOrderClick={scrollToOrder} />
      <GrainOverlay />
      <GlowOrbs />
    </div>
  );
}
