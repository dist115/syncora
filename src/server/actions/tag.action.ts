'use server';

import { revalidateTag } from 'next/cache';
import { TagsService } from '@/server/service/tag.service';

import { TagOwnerType } from '@/config/tags';
import { getCurrentUser } from '@/lib/utils/session';
import { applyValidation } from '@/lib/utils/validation';
import { TagPivotInput } from '@/lib/validations/tag-pivot.schema';
import { CreateTagSchema, TagInput } from '@/lib/validations/tag.schema';
import { handleServerError } from '@/lib/utils/error';

type CombinedTagInput = TagInput & TagPivotInput;

export const createMultipleTags = async (inputs: CombinedTagInput[]) => {
  try {
    const user = await getCurrentUser();
    const allTags = await Promise.all(
      inputs.map(async (inp) => {
        const { label } = applyValidation<TagInput>(CreateTagSchema, inp);

        const tag = await TagsService.create({
          label,
          ownerId: user?.currentTeamId ? user?.currentTeamId : user?.id,
          ownerType: user?.currentTeamId ? TagOwnerType.team : TagOwnerType.user,
        });
        return {
          tagId: tag.id,
          taggableId: inp.taggableId,
          tagType: inp.tagType,
        };
      })
    );
    await TagsService.detachAllTags(inputs[0].taggableId);

    const attached = await TagsService.attachTags(allTags);
    revalidateTag('get-all-tags');
    return attached;

  } catch (error) {
    return handleServerError(error);
  }

};

export const createTag = async (input: TagInput) => {
  try {
    const user = await getCurrentUser();
    const { label } = applyValidation<TagInput>(CreateTagSchema, input);
    const tag = await TagsService.create({
      label,
      ownerId: user?.currentTeamId ? user?.currentTeamId : user?.id,
      ownerType: user?.currentTeamId ? TagOwnerType.team : TagOwnerType.user,
    });
    revalidateTag('get-all-tags');
    return tag;

  } catch (error) {
    return handleServerError(error);
  }

};

export const getAllTags = async ({ search }: { search: string }) => {
  const user = await getCurrentUser();
  const ownerId = user?.currentTeamId ? user?.currentTeamId : user?.id;
  const tags = await TagsService.getTags({ search, ownerId });
  revalidateTag('get-all-tags');
  return tags;
};

export const editTag = async (id: string, label: string) => {
  const tag = await TagsService.edit(id, { label });
  revalidateTag('get-all-tags');
  return tag;
};

export const deleteTag = async (id: string) => {
  const tag = await TagsService.delete(id);
  revalidateTag('get-all-tags');
  return tag;
};
