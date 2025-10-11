import 'server-only';

import { db } from '@/db';
import {
  CompleteTeam,
  CompleteTeamMember,
  team,
  teamMember as teamMemberModel,
  TeamMemberStatus,
  team as teamModel,
  TeamRole,
  teamRole,
  users as usersModel,
  UserStatus,
} from '@/db/schema';
import { CurrentTeam, TeamPromise } from '@/server/dto/teams.dto';
import { TeamRoleService } from '@/server/service/team-role.service';
import { UserService } from '@/server/service/user.service';
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  or,
  sql,
  SQLWrapper,
} from 'drizzle-orm';
import slugify from 'slugify';
import { v4 } from 'uuid';

import { MESSAGES } from '@/config/messages';
import { PermissionNameType } from '@/config/permission';
import { TEAM_ROLES, TEAM_ROLES_PERMISSIONS } from '@/config/roles';
import { createUniqueSlug } from '@/lib/utils/createUniqueSlug';
import { getPermissionObject, PermissionObject } from '@/lib/utils/permission';
import {
  InviteMemberInput,
  UpdateMemberInput,
} from '@/lib/validations/member.schema';
import { TeamSettingsInput } from '@/lib/validations/team-general-settings.schema';

import { getCurrentTeamSubscription } from '../actions/billing.action';
import { BillingService } from './billing.service';

type TeamsWithCount = {
  teams: CompleteTeam[];
  count: number;
};

/**
 * Team Service
 *
 * This service is responsible for managing the team & team members
 *
 */
export const TeamService = {
  /**
   * Get all teams
   * @param params
   * @returns
   */
  getAllTeams: async (params: {
    size?: number;
    page?: number;
    text?: string;
  }): Promise<TeamsWithCount> => {
    const size = Number(params.size) || 10;
    const page = params.page ? Number(params.page) - 1 : 0;
    const text = params.text ?? '';

    const where = ilike(teamModel.name, `%${text}%`);
    const { teams, count }: TeamsWithCount = await db.transaction(
      async (db): Promise<any> => {
        const teams = await db.query.team.findMany({
          where,
          orderBy: [desc(teamModel.createdAt)],
          offset: page * size,
          limit: size,
        });
        const result = await db
          .select({ count: sql<number>`count(*)` })
          .from(teamModel)
          .where(where);
        const count = result[0].count;
        return {
          teams,
          count,
        };
      }
    );

    return {
      teams,
      count,
    };
  },

  getTeamById: async (id: string): TeamPromise => {
    return await db.query.team.findFirst({
      where: (team, { eq }) => eq(team.id, id),
    });
  },
  getTeamBySlug: async (slug: string): TeamPromise => {
    return await db.query.team.findFirst({
      where: (team, { eq }) => eq(team.slug, slug),
    });
  },

  getCurrentTeam: async (userId: string) => {
    const user = await UserService.find(userId);
    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }
    if (!user.currentTeamId) {
      throw new Error(MESSAGES.USER_HAS_NO_CURRENT_TEAM);
    }
    const team = await TeamService.getTeamById(user.currentTeamId);
    if (!team) {
      throw new Error(MESSAGES.TEAM_NOT_FOUND);
    }

    const currentMember = await TeamService.getTeamMember(
      userId,
      user.currentTeamId
    );

    if (!currentMember) {
      throw new Error(MESSAGES.USER_IS_NOT_A_MEMBER_OF_THIS_TEAM);
    }

    if (team.avatar && team.avatar?.startsWith('http') == false) {
      team.avatar = `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${team.avatar}`;
    }

    const allPermissions: PermissionObject[] = [];
    const permissionsList = currentMember.role
      ?.permissions as PermissionNameType[];
    if (permissionsList) {
      allPermissions.push(...getPermissionObject(permissionsList));
    }

    return {
      ...team,
      permissions: allPermissions,
      role: currentMember.role?.name,
    } as CurrentTeam;
  },

  createTeam: async (createdBy: string, name: string) => {
    let slug = slugify(name, {
      lower: true,
      locale: 'en',
      trim: true,
    });
    //const teamCount = result.total as number

    return await db.transaction(async (tx) => {
      const totalTeam = await tx
        .select({
          total: count(teamModel.id), // Assuming 'id' is a column in your 'users' table
        })
        .from(teamModel)
        .execute();
      const existingTeam = await tx.query.team.findFirst({
        where: (team, { eq }) => eq(team.slug, slug),
      });
      slug = existingTeam ? createUniqueSlug(slug) : slug;
      const [team] = await tx
        .insert(teamModel)
        .values({
          createdBy,
          name,
          slug: slug.toLowerCase(),
        })
        .onConflictDoNothing()
        .returning();
      // const currentPlan = await getCurrentTeamSubscription();
      // console.log(currentPlan);
      console.log(totalTeam);
      // if(typeof currentPlan!=='undefined' && currentPlan?.maxTeam !== null && totalTeam[0].total < currentPlan?.maxTeam){
      const x = true;
      if (x) {
        if (!team) {
          throw new Error(MESSAGES.ERROR_CREATING_TEAM);
        }

        const user = await UserService.find(createdBy);
        if (!user) {
          throw new Error(MESSAGES.USER_NOT_FOUND);
        }

        const ownerRole = await TeamService.findOwnerRoleId(team.id);

        const [teamMember] = await tx
          .insert(teamMemberModel)
          .values({
            userId: createdBy,
            teamId: team.id,
            inviterId: createdBy,
            email: user.email,
            token: v4(),
            tokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
            status: TeamMemberStatus.Active,
            roleId: ownerRole,
          })
          .onConflictDoNothing()
          .returning();

        if (!teamMember) {
          throw new Error(MESSAGES.ERROR_CREATING_TEAM_MEMBER);
        }

        await UserService.update(createdBy, { currentTeamId: team.id });

        return team;
      } else {
        throw new Error(MESSAGES.UPDATE_CURRENT_SUBSCRIPTION);
      }
    });
  },

  findOwnerRoleId: async (teamId: string) => {
    const ownerRole = await db.query.teamRole.findFirst({
      where: (teamRole, { eq, and }) =>
        and(eq(teamRole.teamId, teamId), eq(teamRole.name, TEAM_ROLES.ADMIN)),
    });
    if (!ownerRole) {
      const seedTeamRoles = TEAM_ROLES_PERMISSIONS.map((role) => ({
        name: role.name,
        teamId: teamId,
        permissions: role.permissions,
        description: role.description,
        generated: true,
      }));

      const inserted: TeamRole[] = await db
        .insert(teamRole)
        .values(seedTeamRoles)
        .returning();
      if (!inserted) {
        throw new Error(MESSAGES.ERROR_CREATING_TEAM_ROLES);
      }
      const adminRole = inserted.find(
        (role: TeamRole) => role.name === TEAM_ROLES.ADMIN
      );
      return adminRole?.id;
    }
    return ownerRole.id;
  },

  /**
   * Update team settings
   * @param teamId  String
   * @param data TeamSettingsInput
   * @param requestedBy String - user id of the one who requested the update
   * @returns
   */
  updateTeam: async (
    teamId: string,
    data: TeamSettingsInput,
    requestedBy: string
  ) => {
    const existingTeam = await db.query.team.findFirst({
      where: (team, { eq }) => eq(team.id, teamId),
    });
    if (!existingTeam) {
      throw new Error(MESSAGES.TEAM_DOES_NOT_EXIST);
    }
    const isOwner = await TeamService.isOwner(teamId, requestedBy);
    if (!isOwner) {
      throw new Error(MESSAGES.YOU_ARE_NOT_THE_OWNER_OF_THIS_TEAM);
    }
    const existingSlug = await db.query.team.findFirst({
      where: (team, { eq }) => eq(team.slug, data.slug),
    });

    if (existingSlug && existingSlug.id !== teamId) {
      throw new Error(MESSAGES.SLUG_IS_ALREADY_TAKEN);
    }

    const [updated] = await db
      .update(team)
      .set(data)
      .where(eq(teamModel.id, teamId))
      .returning();
    return updated;
  },

  deleteTeam: async (id: string, requestedBy: string) => {
    const existingTeam = await db.query.team.findFirst({
      where: (teams, { eq }) => eq(teams.id, id),
    });

    if (!existingTeam) {
      throw new Error(MESSAGES.TEAM_DOES_NOT_EXIST);
    }
    const isOwner = await TeamService.isOwner(id, requestedBy);
    if (!isOwner) {
      throw new Error(MESSAGES.YOU_ARE_NOT_THE_OWNER_OF_THIS_TEAM);
    }
    await db.delete(teamMemberModel).where(eq(teamMemberModel.teamId, id));

    const [deleted] = await db
      .delete(teamModel)
      .where(eq(teamModel.id, id))
      .returning();
    return deleted;
  },
  bulkDelete: async (ids: string[]) => {
    await db
      .delete(teamMemberModel)
      .where(sql`team_id IN (${sql.join(ids, sql`, `)})`);

    const [deleted] = await db
      .delete(team)
      .where(sql`id IN (${sql.join(ids, sql`, `)})`)
      .returning();

    return deleted;
  },

  mapTeamMemberStatus: (status: string) => {
    switch (status.toUpperCase()) {
      case 'INVITED':
        return TeamMemberStatus.Invited;
      case 'ACTIVE':
        return TeamMemberStatus.Active;
      case 'INACTIVE':
        return TeamMemberStatus.Inactive;
      default:
        return undefined;
    }
  },

  exportTeamMembers: async (
    id: string,
    params: {
      text?: string;
      status?: string;
      role?: string;
    }
  ) => {
    const text = params.text || '';
    const status = TeamService.mapTeamMemberStatus(params.status || '*');
    const where = and(
      eq(teamMemberModel.teamId, id),
      status && eq(teamMemberModel.status, status),
      or(
        ilike(teamMemberModel.name, `%${text}%`),
        ilike(teamMemberModel.email, `%${text}%`),
        ilike(usersModel.name, `%${text}%`)
      )
    );
    return await db.query.teamMember.findMany({
      where,
      with: {
        user: true,
      },
      orderBy: [desc(teamMemberModel.createdAt)],
    });
  },

  getTeamMembers: async (
    id: string,
    params: {
      size?: number;
      page?: number;
      text?: string;
      status?: string;
      role?: string;
    }
  ) => {
    const size = Number(params.size) || 10;
    const page = params.page ? Number(params.page) - 1 : 0;
    const text = params.text || '';
    const status = TeamService.mapTeamMemberStatus(params.status || '*');
    const role = params.role as string;

    const conditions: SQLWrapper[] = [];

    if (role && role !== '*') {
      conditions.push(eq(teamMemberModel.roleId, +role));
    }
    if (status) {
      conditions.push(eq(teamMemberModel.status, status));
    }

    const where = and(
      eq(teamMemberModel.teamId, id),
      ...conditions,
      or(
        ilike(teamMemberModel.name, `%${text}%`),
        ilike(teamMemberModel.email, `%${text}%`)
      )
    );

    const { members, count }: { members: CompleteTeamMember[]; count: number } =
      await db.transaction(async (db): Promise<any> => {
        const members = await db.query.teamMember.findMany({
          where,
          with: {
            user: true,
            role: true,
          },
          orderBy: [desc(teamMemberModel.createdAt)],
          offset: page * size,
          limit: size,
        });
        const result = await db
          .select({ count: sql<number>`count(*)` })
          .from(teamMemberModel)
          .where(where);
        const count = result[0].count;
        return {
          members,
          count,
        };
      });
    return {
      members,
      count,
    };
  },

  getTeamMember: async (userId: string, teamId: string) => {
    return await db.query.teamMember.findFirst({
      where: (teamMember, { eq, and }) =>
        and(eq(teamMember.userId, userId), eq(teamMember.teamId, teamId)),
      with: {
        user: true,
        role: true,
      },
    });
  },

  getTeamsByUserId: async (userId: string) => {
    const result = await db
      .select()
      .from(teamModel)
      .innerJoin(teamMemberModel, eq(teamModel.id, teamMemberModel.teamId))
      .where(eq(teamMemberModel.userId, userId))
      .orderBy(asc(teamModel.createdAt));

    const completeTeam = result.reduce<
      Record<string, Omit<CompleteTeam, 'owner' | 'users'>>
    >((acc, row) => {
      const team = row.teams;
      const teamMember = row.team_members;

      if (!acc[team.id]) {
        acc[team.id] = { ...team, members: [] };
      }

      acc[team.id].members.push(teamMember);

      return acc;
    }, {});

    const teams = Object.values(completeTeam);

    return teams;
  },

  isMember: async (userId: string, teamId: string | null) => {
    return await db.query.teamMember.findFirst({
      where: (teamMember, { eq, and }) =>
        and(
          eq(teamMember.userId, userId),
          eq(teamMember.teamId, teamId as string)
        ),
    });
  },

  isOwner: async (teamId: string, userId: string) => {
    const isOwner = await db.execute(sql`SELECT
    teams.id
  FROM
    teams
    LEFT JOIN team_roles ON team_roles.team_id = teams.id
      AND team_roles.name = ${TEAM_ROLES.ADMIN}
    LEFT JOIN team_members ON team_members.team_id = teams.id
  WHERE
    teams.id = ${teamId}
    AND team_members.user_id = ${userId}`);

    return isOwner.rowCount != null && isOwner.rowCount > 0;
  },

  inviteUserToTeam: async (
    teamId: string,
    data: InviteMemberInput,
    requestedBy: string
  ) => {
    return await db.transaction(async (db): Promise<any> => {
      const existingTeam = await db.query.team.findFirst({
        where: (team, { eq }) => eq(team.id, teamId),
      });
      if (!existingTeam) {
        throw new Error(MESSAGES.TEAM_DOES_NOT_EXIST);
      }
      const isOwner = await TeamService.isOwner(teamId, requestedBy);
      if (!isOwner) {
        throw new Error(MESSAGES.YOU_DONT_HAVE_PERMISSION_TO_INVITE);
      }
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, data.email as string),
      });
      if (user) {
        const isMember = await db.query.teamMember.findFirst({
          where: (teamMember, { eq, and }) =>
            and(eq(teamMember.userId, user.id), eq(teamMember.teamId, teamId)),
        });
        if (isMember) {
          throw new Error(MESSAGES.USER_IS_ALREADY_A_MEMBER_OR_INVITED);
        }
      }
      const [invitation] = await db
        .insert(teamMemberModel)
        .values({
          teamId: teamId,
          name: data.name,
          roleId: data.roleId,
          userId: user?.id,
          inviterId: requestedBy,
          status: TeamMemberStatus.Invited,
          email: data.email as string,
          token: v4(),
          tokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        })
        .returning();
      if (!invitation) {
        throw new Error(MESSAGES.ERROR_CREATING_INVITATION);
      }
      return invitation;
    });
  },

  resendInvitation: async (invitationId: number, requestedBy: string) => {
    const invitation = await db.query.teamMember.findFirst({
      where: (teamMember, { eq, and }) =>
        and(
          eq(teamMember.id, invitationId),
          eq(teamMember.status, TeamMemberStatus.Invited)
        ),
    });

    if (!invitation) {
      throw new Error(MESSAGES.INVITATION_NOT_FOUND);
    }
    const isOwner = await TeamService.isOwner(
      invitation.teamId as string,
      requestedBy
    );
    if (!isOwner) {
      throw new Error(MESSAGES.YOU_ARE_NOT_THE_OWNER_OF_THIS_TEAM);
    }

    const [updated] = await db
      .update(teamMemberModel)
      .set({
        token: v4(),
        tokenExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      })
      .where(eq(teamMemberModel.id, invitation.id))
      .returning();
    return updated;
  },

  acceptInvitation: async (token: string) => {
    const invitation = await db.query.teamMember.findFirst({
      where: (teamMember, { eq, and }) =>
        and(
          eq(teamMember.token, token),
          eq(teamMember.status, TeamMemberStatus.Invited)
        ),
    });

    if (!invitation) {
      throw new Error(MESSAGES.INVITATION_NOT_FOUND);
    }
    if (invitation.tokenExpires < new Date()) {
      throw new Error(MESSAGES.INVITATION_EXPIRED);
    }
    let user = await UserService.findByEmail(invitation.email);
    if (!user) {
      const createdUser = await UserService.create({
        email: invitation.email,
        name: invitation.name,
        currentTeamId: invitation.teamId,
        status: UserStatus.Active,
      });

      user = createdUser;
    }
    const [teamMember] = await db
      .update(teamMemberModel)
      .set({
        userId: user?.id,
        status: TeamMemberStatus.Active,
      })
      .where(eq(teamMemberModel.id, invitation.id))
      .returning();
    if (!teamMember) {
      throw new Error(MESSAGES.ERROR_CREATING_TEAM_MEMBER);
    }
    return true;
  },

  /**
   * Delete invitation
   *
   * @param memberId String
   * @param requestedBy String
   * @returns Object
   */
  deleteInvitation: async (memberId: string, requestedBy: string) => {
    const invitation = await db.query.teamMember.findFirst({
      where: (teamMember, { eq, and }) =>
        and(
          eq(teamMember.teamId, memberId),
          eq(teamMember.status, TeamMemberStatus.Invited)
        ),
    });
    if (!invitation) {
      throw new Error(MESSAGES.INVITATION_NOT_FOUND);
    }
    const isOwner = await TeamService.isOwner(
      invitation.teamId as string,
      requestedBy
    );
    if (!isOwner) {
      throw new Error(MESSAGES.YOU_ARE_NOT_THE_OWNER_OF_THIS_TEAM);
    }
    const [deleted] = await db
      .delete(teamMemberModel)
      .where(eq(teamMemberModel.id, invitation.id))
      .returning();
    return deleted;
  },

  /**
   *
   * @param teamId String
   * @param memberId String
   * @param requestedBy String
   * @returns Object
   */
  removeTeamMember: async (
    teamId: string,
    memberId: number,
    requestedBy: string
  ) => {
    const member = await db.query.teamMember.findFirst({
      //@ts-ignore
      where: eq(teamMemberModel.id, memberId),
    });

    if (!member) {
      throw new Error(MESSAGES.MEMBER_NOT_FOUND);
    }
    if (member.userId === requestedBy) {
      throw new Error(
        MESSAGES.YOU_CANNOT_REMOVE_YOURSELF_PLEASE_DELETE_THE_TEAM_INSTEAD
      );
    }
    const isOwner = await TeamService.isOwner(teamId, requestedBy);
    if (!isOwner) {
      throw new Error(MESSAGES.YOU_ARE_NOT_THE_OWNER_OF_THIS_TEAM);
    }
    const [deleted] = await db
      .delete(teamMemberModel)
      .where(eq(teamMemberModel.id, member.id))
      .returning();
    return deleted;
  },

  /**
   * Get all invited members
   * @param teamId String
   * @param requestedBy String
   * @returns Array
   */
  getInvitedMembers: async (teamId: string, requestedBy: string) => {
    const isOwner = await TeamService.isOwner(teamId, requestedBy);
    if (!isOwner) {
      return [];
    }
    return await db.query.teamMember.findMany({
      where: and(
        eq(teamMemberModel.teamId, teamId),
        eq(teamMemberModel.status, TeamMemberStatus.Invited)
      ),
      orderBy: [desc(teamMemberModel.createdAt)],
    });
  },

  /**
   * Update team member role
   * @param teamId String
   * @param memberId String
   * @param data UpdateMemberInput
   * @param requestedBy String
   * @returns Object
   */
  updateTeamMember: async (
    teamId: string,
    memberId: number,
    data: UpdateMemberInput,
    requestedBy: string
  ) => {
    const isOwner = await TeamService.isOwner(teamId, requestedBy);

    const { roleId, status } = data;
    if (!isOwner) {
      throw new Error(MESSAGES.YOU_ARE_NOT_THE_OWNER_OF_THIS_TEAM);
    }
    const member = await db.query.teamMember.findFirst({
      where: eq(teamMemberModel.id, memberId),
      with: {
        role: true,
      },
    });
    if (!member) {
      throw new Error(MESSAGES.MEMBER_NOT_FOUND);
    }

    const ownerRole = await TeamRoleService.findOwner(teamId);
    // if team does not have any other owner, do not allow to update role
    if (
      String(roleId) !== String(ownerRole.id) &&
      member.userId === String(requestedBy)
    ) {
      const teamMembers = await db.query.teamMember.findMany({
        where: and(
          eq(teamMemberModel.teamId, teamId),
          eq(teamMemberModel.roleId, ownerRole.id)
        ),
      });

      if (teamMembers.length === 1) {
        throw new Error(MESSAGES.TEAM_MUST_HAVE_AT_LEAST_ONE_OWNER);
      }
    }
  },

  exportAllTeams: async (params: { text?: string }) => {
    const text = params.text ?? '';
    const where = ilike(teamModel.name, `%${text}%`);
    return await db.query.team.findMany({
      where,
      orderBy: [desc(teamModel.createdAt)],
    });
  },
  removeMembers: async (ids: string[]) => {
    const [deleted] = await db
      .delete(teamMemberModel)
      .where(sql`id IN (${sql.join(ids, sql`, `)})`)
      .returning();

    return deleted;
  },
};
