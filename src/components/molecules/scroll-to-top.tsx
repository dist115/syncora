'use client';

import { useEffect, useRef, useState } from 'react';

import { cn } from '@/lib/utils/cn';

import { panelMainContentRef } from '../atoms/resizable-layout/resizable-layout';

type Props = {
  className?: string;
  variant?: 'dashboard' | 'landing';
};

export function ScrollToTop({ className, variant, ...props }: Props) {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const elementRef = useRef<any>(null);

  useEffect(() => {
    function windowScrollTop() {
      if (window.scrollY > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    }

    function elementScrollTop() {
      if (elementRef.current?.scrollTop > 400) {
        setShowTopBtn(true);
      } else {
        setShowTopBtn(false);
      }
    }

    if (variant === 'dashboard') {
      elementRef.current = panelMainContentRef.current;
      elementRef.current?.addEventListener('scroll', elementScrollTop);
    } else {
      window.addEventListener('scroll', windowScrollTop);
    }

    return () => {
      if (variant === 'dashboard') {
        elementRef.current?.removeEventListener('scroll', elementScrollTop);
      } else {
        window.removeEventListener('scroll', windowScrollTop);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const goToTop = () => {
    if (variant === 'dashboard') {
      elementRef.current?.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  };
  return showTopBtn ? (
    <>
      <button
        onClick={goToTop}
        aria-label="Back to Top Button"
        className={cn(
          ' md:p-2.5 p-2 fixed right-4 z-[999] rounded-md bg-white/10 dark:bg-steel-900 aspect-square bottom-4 border border-[#40C17B] transition duration-300',
          className
        )}
        {...props}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 18 18"
          className="w-4 h-4"
        >
          <path
            fill="#40C17B"
            d="M9 5c.25 0 .502.096.693.288l6.02 6.034a.985.985 0 0 1 0 1.39.979.979 0 0 1-1.387 0L9 7.372l-5.326 5.34a.979.979 0 0 1-1.387 0 .984.984 0 0 1 0-1.39l6.02-6.034A.976.976 0 0 1 9 5Z"
          />
        </svg>
      </button>
    </>
  ) : (
    <></>
  );
}
