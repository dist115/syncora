import 'server-only';

import { db } from '@/db';
import { teamRole, TeamRoleInsert } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

import { MESSAGES } from '@/config/messages';
import { TEAM_ROLES } from '@/config/roles';
import { TeamRoleInput } from '@/lib/validations/team-role.schema';

export const TeamRoleService = {
  find: async (id: number) => {
    const role = await db.query.teamRole.findFirst({
      where: (teamRole, { eq }) => eq(teamRole.id, id),
    });

    return role;
  },

  findByRole: async (name: string, teamId: string) => {
    const role = await db.query.teamRole.findFirst({
      where: (teamRole, { and, eq }) =>
        and(
          eq(teamRole.name, name),
          eq(teamRole.teamId, teamId)
        ),
    });

    return role;
  },

  findOwner: async (teamId: string) => {
    const role = await db.query.teamRole.findFirst({
      where: (teamRole, { and, eq }) =>
        and(
          eq(teamRole.name, TEAM_ROLES.ADMIN),
          eq(teamRole.teamId, teamId)
        ),
    });

    if (!role) {
      throw new Error(MESSAGES.OWNER_ROLE_NOT_FOUND);
    }

    return role;
  },

  findMember: async (teamId: string) => {
    const role = await db.query.teamRole.findFirst({
      where: (teamRole, { and, eq }) =>
        and(
          eq(teamRole.name, TEAM_ROLES.MEMBER),
          eq(teamRole.teamId, teamId)
        ),
    });

    if (!role) {
      throw new Error(MESSAGES.OWNER_ROLE_NOT_FOUND);
    }

    return role;
  },

  findRolesByTeamId: async (teamId: string) => {
    const roles = await db.query.teamRole.findMany({
      where: (teamRole, { eq }) => eq(teamRole.teamId, teamId),
    });

    return roles;
  },

  create: async (data: TeamRoleInput) => {
    const existingTeamRole = await db.query.teamRole.findFirst({
      where: (teamRole, { and, eq }) =>
        and(
          eq(teamRole?.name, data?.name!),
          eq(teamRole?.teamId, data?.teamId!)
        ),
    });
    if (existingTeamRole) {
      throw new Error(MESSAGES.TEAM_ROLE_ALREADY_EXIST);
    }
    const [inserted] = await db
      .insert(teamRole)
      .values(data as TeamRoleInsert)
      .returning();

    return inserted;
  },

  delete: async (id: number) => {
    const [deleted] = await db
      .delete(teamRole)
      .where(
        and(
          eq(teamRole.id, id),
          eq(teamRole.generated, false)
        )
      )
      .returning();

    return deleted;
  },

  update: async (id: number, data: Partial<TeamRoleInput>) => {
    const existingTeamRole = await db.query.teamRole.findFirst({
      where: (teamRole, { and, eq }) =>
        and(
          eq(teamRole?.name, data?.name!),
          eq(teamRole?.teamId, data?.teamId!)
        ),
    });
    if (existingTeamRole) {
      throw new Error(MESSAGES.TEAM_ROLE_ALREADY_EXIST);
    }
    const [updated] = await db
      .update(teamRole)
      .set(data)
      .where(
        and(
          eq(teamRole.id, id),
          eq(teamRole.generated, false)
        )
      )
      .returning();

    return updated;
  },
};
