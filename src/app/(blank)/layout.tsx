import { Box } from '@/components/atoms/layout';
import { Providers } from '@/components/organisms/providers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex h-[100dvh] flex-col overflow-x-hidden">
        <Box className="grow">{children}</Box>
      </main>
    </Providers>
  );
}
