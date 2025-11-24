'use client';

import { useEffect, useState } from 'react';

export function useIsMozilla() {
  const [isMozilla, setIsMozilla] = useState(false);

  useEffect(() => {
    setIsMozilla(!!navigator.userAgent.match(/firefox/i));
  }, []);

  return isMozilla;
}
