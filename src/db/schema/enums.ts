import { pgEnum } from 'drizzle-orm/pg-core';
import { z } from 'zod';

export const subscriptionStatusEnum = pgEnum('subscription_status', [
  'Pending',
  'Active',
  'Inactive',
  'Cancelled',
  'PastDue',
]);
export const SubscriptionStatus = z.enum(
  subscriptionStatusEnum.enumValues
).Enum;

export const userStatusEnum = pgEnum('user_status', ['Active', 'Inactive']);
export const UserStatus = z.enum(userStatusEnum.enumValues).Enum;

export const teamMemberStatusEnum = pgEnum('team_member_status', [
  'Active',
  'Inactive',
  'Invited',
]);
export const TeamMemberStatus = z.enum(teamMemberStatusEnum.enumValues).Enum;

export const commentTypeEnum = pgEnum('comment_type', ['files']);
export const CommentType = z.enum(commentTypeEnum.enumValues).Enum;

export const tagTypeEnum = pgEnum('tag_type', ['files']);
export const TagType = z.enum(tagTypeEnum.enumValues).Enum;

export const tagOwnerTypeEnum = pgEnum('tag_owner_type', ['user', 'team']);
