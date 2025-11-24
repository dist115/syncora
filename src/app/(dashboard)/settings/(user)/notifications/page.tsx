import { PageHeader } from '@/components/atoms/page-header';

export default async function Page() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Manage your notifications"
        titleClassName="text-xl"
      />
    </>
  );
}
