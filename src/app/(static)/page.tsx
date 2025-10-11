import Landing from '@/components/templates/landing';
import { getSetting } from '@/server/actions/settings.action';

export default async function Home() {
  const faq = await getSetting('faq');
  return <Landing faq={faq?.value ?? ''} />;
}
