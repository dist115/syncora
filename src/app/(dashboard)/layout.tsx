import { cookies } from 'next/headers';
import { getUserPermission } from '@/server/actions/permission.action';
import { getAllSettings } from '@/server/actions/settings.action';
import { Box } from 'rizzui';

import { Flex } from '@/components/atoms/layout';
import { ResizablePanel } from '@/components/atoms/resizable-layout/resizable-layout';
import Footer from '@/components/organisms/footer';
import Header from '@/components/organisms/header';
import { Providers } from '@/components/organisms/providers';
import { Sidebar } from '@/components/organisms/sidebar';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getAllSettings();
  const permissions = await getUserPermission();

  const defaultSizeCookies = cookies().get(
    'layout-resizable-panels:default-size'
  );
  const defaultCollapsedCookies = cookies().get(
    'layout-resizable-panels:default-collapsed'
  );

  const defaultSize = defaultSizeCookies
    ? JSON.parse(defaultSizeCookies.value)
    : undefined;
  const defaultCollapsed = defaultCollapsedCookies
    ? JSON.parse(defaultCollapsedCookies.value)
    : undefined;

  return (
    <Providers settings={settings} permissions={permissions}>
      <main className="grid flex-grow grid-cols-1 font-geist">
        <ResizablePanel
          defaultSize={defaultSize}
          defaultCollapsed={defaultCollapsed}
          sidebar={
            <Sidebar
              defaultCollapsed={defaultCollapsed}
              className="w-full h-full shrink-[unset] relative"
            />
          }
          childrenWrapperClassName="!min-h-screen"
        >
          <div className="flex flex-col h-full bg-background relative">
            <Flex
              direction="col"
              justify="start"
              className="p-5 pt-0 3xl:p-10 3xl:pt-0 grow"
            >
              <Header />
              <Box className="relative mt-4 w-full">{children}</Box>
            </Flex>
            <Footer variant="dashboard" />
          </div>
        </ResizablePanel>
      </main>
    </Providers>
  );
}
