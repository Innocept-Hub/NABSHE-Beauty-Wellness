import { useEffect } from 'react';

/**
 * High-performance, non-blocking scroll-reveal hook.
 * Uses a generous positive rootMargin (200px) and pure IntersectionObserver
 * without calling getBoundingClientRect in loops, preventing main-thread layout thrashing.
 */
export function useScrollReveal(dependencies: unknown[] = []) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.reveal-on-scroll').forEach((el) => {
        el.classList.add('is-revealed');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.01,
        // Pre-reveal 250px before entering viewport so below-the-fold content is always ready
        rootMargin: '250px 0px 250px 0px',
      }
    );

    // Use requestAnimationFrame to avoid interrupting initial paint
    const rafId = requestAnimationFrame(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => {
        observer.observe(el);
      });
    });

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, dependencies);
}
