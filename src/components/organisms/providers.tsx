'use client';

import { useEffect } from 'react';
import { Toaster } from 'sonner';

import { usePermissionStore } from '@/lib/store/permission.store';
import { hideRechartsConsoleError } from '@/lib/utils/hideRechartsConsoleError';
import { PermissionObject } from '@/lib/utils/permission';
import { SiteSettingsInput } from '@/lib/validations/site-settings.schema';
import { ThemeProvider } from '@/components/molecules/theme-provider';
import { Modal } from '@/components/organisms/modal';

import { RightDrawer } from './right-drawer';

hideRechartsConsoleError();

export function Providers({
  children,
  settings,
  permissions,
}: {
  children: React.ReactNode;
  settings?: SiteSettingsInput;
  permissions?: PermissionObject[];
}) {
  const { setPermissions } = usePermissionStore();
  useEffect(() => {
    const colors = [
      {
        variable: '--saaskit-header-color',
        value: settings?.header_color ?? '#ffffff',
      },
      {
        variable: '--saaskit-sidebar-color',
        value: settings?.sidebar_color ?? '#ffffff',
      },
      {
        variable: '--saaskit-background-color',
        value: settings?.background_color ?? '#ffffff',
      },
    ];

    colors.forEach(({ variable, value }) => {
      document.documentElement.style.setProperty(variable, value);
    });
  }, [
    settings?.background_color,
    settings?.header_color,
    settings?.sidebar_color,
  ]);
  useEffect(() => {
    permissions && setPermissions(permissions);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions]);

  return (
    <ThemeProvider attribute="data-theme" defaultTheme="light">
      {children}
      <Toaster
        richColors
        position="top-center"
        gap={8}
        toastOptions={{
          className: 'sm:!w-auto',
          duration: 5000,
        }}
      />
      <Modal />
      <RightDrawer />
    </ThemeProvider>
  );
}
