import { getCurrentUser } from '@/lib/utils/session';
import DummyPageTemplate from '@/components/templates/dummy-page-template';

export default async function Page() {
  const user = await getCurrentUser();

  return <DummyPageTemplate />;
}
