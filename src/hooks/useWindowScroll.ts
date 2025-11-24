import { useLayoutEffect, useState } from 'react';

export function useWindowScroll() {
  const [scrollY, setScrollY] = useState<number>(0);

  useLayoutEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    handleScroll();

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
}
