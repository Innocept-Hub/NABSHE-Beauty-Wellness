import { useState, useEffect } from 'react';

/**
 * Returns the card chunk interval based on the current screen width:
 * - Desktop (>= 1024px): 8 cards (2 rows × 4 cards)
 * - Tablet (>= 768px && < 1024px): 9 cards (3 rows × 3 cards)
 * - Mobile (< 768px): 4 cards (4 vertical cards / 2 rows × 2 cards)
 */
export function useGridInterval(): number {
  const computeInterval = (): number => {
    if (typeof window === 'undefined') return 8;
    const width = window.innerWidth;
    if (width < 768) {
      return 4; // 4 cards on mobile
    }
    if (width < 1024) {
      return 9; // 3 rows of 3 on tablet
    }
    return 8; // 2 rows of 4 on desktop
  };

  const [interval, setInterval] = useState<number>(computeInterval);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const handleResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        setInterval(computeInterval());
      }, 150);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return interval;
}

/**
 * Splits an array into sub-arrays of maximum size `chunkSize`.
 */
export function chunkItems<T>(items: T[], chunkSize: number): T[][] {
  if (!items || items.length === 0) return [];
  const validChunkSize = Math.max(1, chunkSize);
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += validChunkSize) {
    chunks.push(items.slice(i, i + validChunkSize));
  }
  return chunks;
}
