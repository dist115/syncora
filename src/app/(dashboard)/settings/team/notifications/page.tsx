import { TeamNotificationSettings } from '@/components/organisms/forms/team-notifications';
import { getAllPermissions} from '@/server/actions/permission.action';
export default async function Page() {
  return <TeamNotificationSettings />;
}
