'use server';

import { revalidateTag } from 'next/cache';
import { CommentsService } from '@/server/service/comment.service';

import { handleServerError } from '@/lib/utils/error';
import { applyValidation } from '@/lib/utils/validation';
import {
  CommentInput,
  CreateCommentsSchema,
} from '@/lib/validations/comment.schema';

export const createComment = async (input: CommentInput) => {
  try {
    const data = applyValidation<CommentInput>(CreateCommentsSchema, input);

    const comment = await CommentsService.create(data);
    revalidateTag('get-files');
    return comment;
  } catch (error) {
    return handleServerError(error);
  }
};

export async function getCommentsByCommentableId(
  commentableId: string,
  commentType: any
) {
  const comments = await CommentsService.getComments(
    commentableId,
    commentType,
  );

  revalidateTag(`comment-by-${commentableId}`);

  return comments;
}

export async function updateComment(commentId: string, input: any) {
  try {
    const comment = await CommentsService.update(commentId, input);
    revalidateTag(`update-comment-${commentId}`);
    return comment;
  } catch (error) {
    return handleServerError(error);
  }
}

export const deleteComment = async (commentId: string) => {
  try {
    const comment = await CommentsService.delete(commentId);
    revalidateTag(`delete-comments-${commentId}`);
    return comment;
  } catch (error) {
    return handleServerError(error);
  }
};