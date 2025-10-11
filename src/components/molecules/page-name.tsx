'use client';

import { usePathname } from 'next/navigation';
import { Text } from 'rizzui';

export default function PageName() {
  const pathname = usePathname();
  const currentPage = pathname.split('/');
  return (
    <Text className="text-2xl hidden xl:block font-semibold capitalize text-custom-black dark:text-steel-100 shrink-0">
      {currentPage[2] === 'folders'
        ? 'Folder'
        : currentPage[currentPage.length - 1]}
    </Text>
  );
}
