'use server';

import { revalidateTag } from 'next/cache';
import { TeamRoleService } from '@/server/service/team-role.service';

import { MESSAGES } from '@/config/messages';
import { applyValidation } from '@/lib/utils/validation';
import {
  CreateTeamRoleSchema,
  TeamRoleInput,
} from '@/lib/validations/team-role.schema';
import { getCurrentUser } from '@/lib/utils/session';
import { handleServerError } from '@/lib/utils/error';
import { me } from './user.action';

export const getAllTeamRoles = async (teamId: string) => {
  const roles = await TeamRoleService.findRolesByTeamId(teamId);
  revalidateTag('get-all-team-roles');
  return roles;
};

export const createTeamRole = async (input: TeamRoleInput) => {
  try {
    const data = applyValidation<TeamRoleInput>(CreateTeamRoleSchema, input);
    const user = await me();
    if (!user?.currentTeamId) {
      throw new Error(MESSAGES.USER_DOES_NOT_HAVE_A_CURRENT_TEAM);
    }
    Object.assign(data, { teamId: user.currentTeamId });

    const role = await TeamRoleService.create(data);
    revalidateTag('get-all-team-roles');
    return role;
  } catch (error) {
    return handleServerError(error);
  }
};

export const deleteTeamRole = async (id: number) => {
  const role = await TeamRoleService.delete(id);
  revalidateTag('get-all-team-roles');
  return role;
};

export const updateTeamRole = async (id: number, input: TeamRoleInput) => {
  try {
    const data = applyValidation<TeamRoleInput>(CreateTeamRoleSchema, input);
    const role = await TeamRoleService.update(id, data);
    revalidateTag('get-all-team-roles');
    return role;
  } catch (error) {
    return handleServerError(error);
  }
};
