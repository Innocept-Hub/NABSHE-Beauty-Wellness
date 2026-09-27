import { useEffect } from 'react';

/**
 * High-performance IntersectionObserver hook to trigger smooth, luxury
 * scroll-reveal animations across sections and content cards as the user scrolls.
 */
export function useScrollReveal(dependencies: unknown[] = []) {
  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
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
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    // Short timeout to ensure newly mounted DOM nodes are ready
    const timer = setTimeout(() => {
      const elements = document.querySelectorAll('.reveal-on-scroll');
      elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // If element is already in initial view, reveal it immediately
        if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
          el.classList.add('is-revealed');
        } else {
          observer.observe(el);
        }
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, dependencies);
}
