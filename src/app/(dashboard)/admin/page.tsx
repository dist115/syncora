import { Button, Title } from 'rizzui';

import { PAGES } from '@/config/pages';
import { getCurrentUser } from '@/lib/utils/session';
import { AdminIllustration } from '@/components/atoms/illustrations/admin-illustration';
import Link from '@/components/atoms/next/link';

export default async function Admin() {
  const user = await getCurrentUser();

  return (
    <div className="flex justify-center items-center w-auto p-8 space-y-3 text-center min-h-[calc(100vh_-_274px)] lg:min-h-[calc(100vh_-_286px)] xl:min-h-[calc(100vh_-_316px)] 3xl:min-h-[calc(100vh_-_324px)] ">
      <div className="flex flex-col pt-4 3xl:pt-8 4xl:pt-10 5xl:p-20">
        <AdminIllustration className="w-[280px] md:w-[350px]" />
        <Title className="text-xl font-semibold capitalize !mt-10 !mb-5">
          Super Admin Page
        </Title>
        <Link href={PAGES.ADMIN.USER}>
          <Button>Manage Users</Button>
        </Link>
      </div>
    </div>
  );
}
