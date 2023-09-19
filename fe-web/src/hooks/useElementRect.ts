import { LegacyRef, useLayoutEffect, useState } from 'react';

export const useElementRect = <T extends HTMLElement>(): [
  DOMRect | null,
  LegacyRef<T>
] => {
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [current, setCurrent] = useState<T | null>(null);

  useLayoutEffect(() => {
    if (current) {
      const observer = new ResizeObserver((e) => setRect(e[0].contentRect));

      observer.observe(current);
      return () => observer.unobserve(current);
    }
  }, [current]);

  return [rect, setCurrent];
};
