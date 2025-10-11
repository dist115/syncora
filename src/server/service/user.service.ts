import 'server-only';

import { db } from '@/db';
import {
  CompleteUser,
  NewUser,
  roles as rolesModel,
  sessions as sessionsModel,
  teamMember,
  User,
  userRoles,
  userRoles as userRolesModel,
  users as usersModel,
  UserStatus,
} from '@/db/schema';
import { and, desc, eq, ilike, or, sql } from 'drizzle-orm';
import { flattenDeep } from 'lodash';

import { MESSAGES } from '@/config/messages';
import { USER_ROLES } from '@/config/roles';

import { TeamService } from './team.service';

type UserPromise = Promise<User | undefined>;

export const UserService = {
  find: async (id: string) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
      with: {
        currentTeam: true,
        roles: {
          with: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const permissions = user.roles.map((role) => role.role.permissions);

    return {
      ...user,
      userPermissions: flattenDeep(permissions),
      roleNames: user?.roles.map((role) => role.role.name),
    };
  },

  findByEmail: async (email: string): UserPromise => {
    return await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, email),
    });
  },

  getUserByCustomerId: async (customerId: string): UserPromise => {
    return await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.customerId, customerId),
    });
  },

  getUserDetails: async (id: string) => {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, id),
      with: {
        currentTeam: true,
        roles: {
          with: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }
    // intentionally changing image url here
    if (user.image && user.image?.startsWith('http') == false) {
      user.image = `${process.env.NEXT_PUBLIC_UPLOAD_URL}/${user.image}`;
    }
    return {
      ...user,
      roleNames: user.roles.map((role) => role.role.name),
    };
  },

  updateCurrentTeam: async (id: string, teamId: string | null): UserPromise => {
    if (teamId !== null) {
      const isTeamMember = TeamService.isMember(id, teamId);
      if (!isTeamMember) {
        throw new Error(MESSAGES.USER_IS_NOT_A_MEMBER_OF_THIS_TEAM);
      }
    }
    const [updated] = await db
      .update(usersModel)
      .set({ currentTeamId: teamId })
      .where(eq(usersModel.id, id))
      .returning();

    return updated;
  },

  create: async (data: NewUser) => {
    const [inserted] = await db.insert(usersModel).values(data).returning();
    const userRole={
      roleId:2,
      userId:inserted.id
    }
    const [updateRole]=await db.insert(userRoles).values(userRole).returning()

    return inserted;
  },

  delete: async (id: string): UserPromise => {
    await db.delete(teamMember).where(eq(teamMember.userId, id));
    await db.delete(userRoles).where(eq(userRoles.userId,id));

    const [deleted] = await db
      .delete(usersModel)
      .where(eq(usersModel.id, id))
      .returning();

    return deleted;
  },

  update: async (id: string, data: Partial<NewUser>): UserPromise => {
    const [updated] = await db
      .update(usersModel)
      .set(data)
      .where(eq(usersModel.id, id))
      .returning();

    return updated;
  },

  updateByEmail: async (email: string, data: Partial<NewUser>): UserPromise => {
    const [updated] = await db
      .update(usersModel)
      .set(data)
      .where(eq(usersModel.email, email))
      .returning();

    return updated;
  },

  getAll: async (): Promise<User[]> => {
    return await db.query.users.findMany({
      orderBy: [desc(usersModel.createdAt)],
    });
  },

  mapUserStatus: (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
        return UserStatus.Active;
      case 'INACTIVE':
        return UserStatus.Inactive;
      default:
        return undefined;
    }
  },

  updateRole: async (userId: string, roleId?: number) => {
    await db.delete(userRolesModel).where(eq(userRolesModel.userId, userId));
    let roleIdToInsert: number = roleId || 2; // default user role
    if (!roleId) {
      const role = await db.query.roles.findFirst({
        where: (roles, { eq }) => eq(roles.name, USER_ROLES.USER),
      });

      roleIdToInsert = role?.id || 2;
    }
    await db.insert(userRolesModel).values([
      {
        userId,
        roleId: roleIdToInsert,
      },
    ]);
  },

  /**
   * Get users
   * @param params
   * @returns
   */
  getUsers: async (params: {
    size?: number;
    page?: number;
    text?: string;
    status?: string;
    role?: string;
  }): Promise<{ users: User[]; count: number }> => {
    const size = Number(params.size) || 10;
    const page = params.page ? Number(params.page) - 1 : 0;
    const text = params.text || '';
    const status = UserService.mapUserStatus(params.status || '*');

    const where = and(
      status && eq(usersModel.status, status),
      or(
        ilike(usersModel.name, `%${text}%`),
        ilike(usersModel.email, `%${text}%`)
      )
    );
    const { users, count }: { users: User[]; count: number } =
      await db.transaction(async (db): Promise<any> => {
        const users = await db.query.users.findMany({
          where,
          orderBy: [desc(usersModel.createdAt)],
          offset: page * size,
          limit: size,
          with: {
            roles: {
              with: {
                role: true,
              },
            },
          },
        });
        const result = await db
          .select({ count: sql<number>`count(*)` })
          .from(usersModel)
          .where(where);
        const count = result[0].count;
        return {
          users,
          count,
        };
      });

    return {
      users,
      count,
    };
  },

  getUserSession: async (userId: string) => {
    return await db.query.sessions.findMany({
      where: (sessions, { eq }) => eq(sessions.userId, userId),
      orderBy: [desc(sessionsModel.createdAt)],
    });
  },

  exportUsers: async (params: {
    text?: string;
    status?: string;
    role?: string;
  }) => {
    const text = params.text || '';
    const status = UserService.mapUserStatus(params.status || '*');

    const where = and(
      status && eq(usersModel.status, status),

      or(
        ilike(usersModel.name, `%${text}%`),
        ilike(usersModel.email, `%${text}%`)
      )
    );

    return await db.query.users.findMany({
      where,
      orderBy: [desc(usersModel.createdAt)],
    });
  },
};
