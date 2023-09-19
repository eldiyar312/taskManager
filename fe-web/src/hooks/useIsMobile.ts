import { useLayoutEffect, useState } from 'react';

const checkIsMobile = () => window.innerWidth <= 991;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(checkIsMobile());

  useLayoutEffect((): (() => void) => {
    const handler = () => setIsMobile(checkIsMobile());
    window.addEventListener('resize', handler);

    return () => window.removeEventListener('resize', handler);
  }, []);

  return isMobile;
};
