import { useEffect, useState } from 'react';
import { ArrowUpIcon } from '@heroicons/react/24/outline';

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-30 rounded-full bg-emerald-600 p-3 text-slate-500 shadow-lg transition hover:bg-emerald-700"
      aria-label="Remonter en haut"
    >
      <ArrowUpIcon className="h-5 w-5" />
    </button>
  );
}
