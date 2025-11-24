'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { RiMenu2Line } from 'react-icons/ri';
import { ActionIcon, Drawer } from 'rizzui';

import { useDrawerState } from '@/lib/store/drawer.store';
import { cn } from '@/lib/utils/cn';

export function HamburgerButton({
  drawerCloseDeps,
  children,
  className,
}: React.PropsWithChildren<{ className?: string; drawerCloseDeps?: any[] }>) {
  const deps = drawerCloseDeps ?? [];
  const pathname = usePathname();
  const { open, openDrawer, closeDrawer } = useDrawerState();
  useEffect(() => {
    closeDrawer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <>
      <ActionIcon
        variant="text"
        onClick={() => openDrawer()}
        className={cn('-ms-2 p-0.5', className)}
      >
        <RiMenu2Line size={21} />
      </ActionIcon>
      <Drawer
        isOpen={open}
        placement="left"
        customSize={300}
        onClose={() => closeDrawer()}
        containerClassName="min-w-[300px]"
      >
        {children}
      </Drawer>
    </>
  );
}
