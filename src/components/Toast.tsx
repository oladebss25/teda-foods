import { useEffect } from 'react';

interface ToastProps {
  message: string | null;
}

export default function Toast({ message }: ToastProps) {
  useEffect(() => {
    if (!message) return;
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    const timer = setTimeout(() => el.classList.remove('show'), 2800);
    return () => clearTimeout(timer);
  }, [message]);

  return <div className="toast" id="toast" role="alert" aria-live="polite" />;
}
