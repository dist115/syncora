'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

function isEmpty(value: any): boolean {
  return (
    typeof value === 'undefined' ||
    value === null ||
    (typeof value !== 'number' && value.length === 0)
  );
}

function deepMergeObjects(target: any, source: any) {
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object)
      Object.assign(source[key], deepMergeObjects(target[key], source[key]));
  }

  Object.assign(target || {}, source);

  for (const key of Object.keys(target)) {
    if (isEmpty(target[key])) {
      delete target[key];
    }
  }
  return target;
}

export default function useQueryParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams()!;

  const [urlParams, setUrlPrams] = useState(
    Object.fromEntries(searchParams.entries())
  );

  useEffect(() => {
    setUrlPrams(Object.fromEntries(searchParams.entries()));
  }, [searchParams]);

  const setQueryParams = (data: any, noScroll = false) => {
    const params = deepMergeObjects(urlParams, data);
    router.push(`${pathname}?${new URLSearchParams(params).toString()}`, {
      scroll: !noScroll,
    });
    setUrlPrams(params);
  };
  function clearQueryParams() {
    router.push(`${pathname}`);
  }

  function removeQueryParams(key: string[]) {
    let url = new URL(location.href);
    key.forEach((item) => url.searchParams.delete(item));
    router.push(`${pathname}${url.search}`);
  }

  return {
    removeQueryParams,
    clearQueryParams,
    setQueryParams,
    queryParams: urlParams,
  };
}
