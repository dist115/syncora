import { Team } from '@/db/schema';

import { PermissionObject } from '@/lib/utils/permission';

export type TeamPromise = Promise<Team | undefined>;

export type CurrentTeam = {
  permissions: PermissionObject[];
  role: string | undefined;
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  slug: string;
  avatar: string | null;
  domain: string | null;
  createdBy: string;
};
