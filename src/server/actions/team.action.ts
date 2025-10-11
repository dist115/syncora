'use server';

import { revalidateTag } from 'next/cache';
import { notFound } from 'next/navigation';
import InvitationEmail from '@/email-templates/invitation-email';
import { TeamService } from '@/server/service/team.service';
import { render } from '@react-email/render';
import { utils } from 'xlsx';

import { env } from '@/env.mjs';
import { MESSAGES } from '@/config/messages';
import { sendEmail } from '@/lib/utils/email';
import { handleServerError } from '@/lib/utils/error';
import { getCurrentUser } from '@/lib/utils/session';
import { applyValidation } from '@/lib/utils/validation';
import {
  InviteMemberInput,
  InviteMemberSchema,
  UpdateMemberInput,
} from '@/lib/validations/member.schema';
import {
  TeamSettingsInput,
  TeamSettingsSchema,
} from '@/lib/validations/team-general-settings.schema';
import { CreateTeamSchema, TeamInput } from '@/lib/validations/team.schema';

import { TeamRoleService } from '../service/team-role.service';
import { getSetting } from './settings.action';
import { me } from './user.action';

export const addTeam = async (input: TeamInput) => {
  try {
    const data = applyValidation(CreateTeamSchema, input);
    const user = await getCurrentUser();
    const team = await TeamService.createTeam(user.id, data.name);
    revalidateTag('get-my-teams');
    revalidateTag('current-team');
    return team;
  } catch (error) {
    return handleServerError(error);
  }
};

export const updateTeam = async (teamId: string, input: TeamSettingsInput) => {
  try {
    const data = applyValidation(TeamSettingsSchema, input);
    const user = await getCurrentUser();
    const team = await TeamService.updateTeam(teamId, data, user?.id as string);
    revalidateTag('get-my-teams');
    revalidateTag('current-team');
    return team;
  } catch (error) {
    return handleServerError(error);
  }
};

export const deleteTeam = async (teamId: string) => {
  const user = await getCurrentUser();
  const team = await TeamService.deleteTeam(teamId, user?.id as string);
  revalidateTag('get-my-teams');
  return team;
};

export const getMyTeams = async () => {
  const user = await getCurrentUser();
  const teams = await TeamService.getTeamsByUserId(user?.id as string);
  return teams;
};

export const getCurrentTeam = async () => {
  const user = await getCurrentUser();

  try {
    const team = await TeamService.getCurrentTeam(user.id);
    revalidateTag(`current-team`);
    return team;
  } catch (error) {
    return null;
  }
};

export const getTeamByID = async (id: string) => {
  try {
    const team = await TeamService.getTeamById(id);
    revalidateTag(`current-team`);
    return team;
  } catch (error) {
    return null;
  }
};

/**
 * Send Invitation to Member
 *
 * @param input InviteMemberInput
 * @returns
 */
export const invite = async (input: InviteMemberInput) => {
  const data = applyValidation(InviteMemberSchema, input);
  const user = await me();

  if (!user?.currentTeamId) {
    throw new Error(MESSAGES.USER_DOES_NOT_HAVE_A_CURRENT_TEAM);
  }

  const invitation = await TeamService.inviteUserToTeam(
    user.currentTeamId,
    data,
    user.id
  );
  revalidateTag(`team-members-${user.currentTeamId}`);

  // Send Invitation Email
  const url = `${env.SITE_URL}/join?token=${invitation.token}`;
  const logo = await getSetting('logo');
  const team = await getTeamByID(invitation.teamId);

  const html = await render(
    InvitationEmail({
      url,
      logo: logo?.value ?? '',
      userName: invitation?.name ?? '',
      team: team?.name ?? '',
    })
  );

  sendEmail({
    to: data.email,
    subject: `${MESSAGES.INVITATION_MAIL_SUBJECT} ${team?.name}`,
    html,
  });

  return invitation;
};

export const getTeamMembers = async (teamId: string, params: any) => {
  const members = await TeamService.getTeamMembers(teamId, params);
  return members;
};

export const deleteMember = async (teamId: string, memberId: number) => {
  const user = await getCurrentUser();

  const member = await TeamService.removeTeamMember(
    teamId,
    memberId,
    user?.id as string
  );
  revalidateTag(`team-members-${teamId}`);
  return member;
};

/**
 * Update Team Member Action
 * @param teamId Team Id
 * @param memberId Member Id
 * @param data UpdateMemberInput
 * @returns Boolean
 */
export const updateMember = async (
  teamId: string,
  memberId: number,
  data: UpdateMemberInput
) => {
  const user = await getCurrentUser();

  await TeamService.updateTeamMember(teamId, memberId, data, user.id);
  revalidateTag(`team-members-${teamId}`);
  return true;
};

export const deleteInvitation = async (
  invitationId: string,
  teamId: string
) => {
  const user = await getCurrentUser();

  const requestedBy = user?.id as string;

  await TeamService.deleteInvitation(invitationId, requestedBy);
  revalidateTag(`invited-members-${teamId}`);
  return true;
};

export const resendInvitation = async (
  invitationId: number,
  teamId: string
) => {
  const user = await getCurrentUser();
  const requestedBy = user?.id as string;

  const invitation = await TeamService.resendInvitation(
    invitationId,
    requestedBy
  );
  revalidateTag(`invited-members-${teamId}`);

  // Send Invitation Email
  const url = `${env.SITE_URL}/join?token=${invitation.token}`;
  const logo = await getSetting('logo');
  const team = await getTeamByID(invitation.teamId as string);

  const html = await render(
    InvitationEmail({
      url,
      logo: logo?.value ?? '',
      userName: invitation?.name ?? '',
      team: team?.name ?? '',
    })
  );

  sendEmail({
    to: invitation.email,
    subject: `${MESSAGES.INVITATION_MAIL_SUBJECT} ${team?.name}`,
    html,
  });

  return true;
};

export const exportTeamMembers = async (params: any) => {
  const user = await me();
  if (!user?.currentTeamId) {
    notFound();
  }

  const teamMembers = await TeamService.exportTeamMembers(
    user.currentTeamId,
    params
  );
  /* cherry pick objects */
  const rows = await Promise.all(
    teamMembers.map(async (row) => {
      const role = await TeamRoleService.find(row.roleId as number);
      return {
        name: row.name,
        email: row.email,
        role: role?.name || 'Undefined',
        status: row.status,
      };
    })
  );

  /* generate worksheet and workbook */
  const worksheet = utils.json_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Data');

  /* fix headers */
  utils.sheet_add_aoa(worksheet, [['Name', 'Email', 'Role', 'Status']], {
    origin: 'A1',
  });

  return workbook;
};

export const getAllTeams = async (params: any) => {
  const teams = await TeamService.getAllTeams(params);
  return teams;
};

export const exportAllTeams = async (params: any) => {
  const team = await TeamService.exportAllTeams(params);

  /* cherry pick objects */
  const rows = team.map((row) => ({
    name: row.name,
    domain: row.domain,
    createdAt: row.createdAt,
  }));

  /* generate worksheet and workbook */
  const worksheet = utils.json_to_sheet(rows);
  const workbook = utils.book_new();
  utils.book_append_sheet(workbook, worksheet, 'Data');

  /* fix headers */
  utils.sheet_add_aoa(worksheet, [['Name', 'Domain', 'Created At']], {
    origin: 'A1',
  });

  return workbook;
};
export async function deleteAllTeams(teamIds: string[]) {
  const team = await TeamService.bulkDelete(teamIds);
  revalidateTag('get-my-teams');
  return team;
}

export async function removeAllMembers(membersIds: string[]) {
  const members = await TeamService.removeMembers(membersIds);
  revalidateTag('get-my-teams');
  return members;
}
