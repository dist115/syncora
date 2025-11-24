import { db } from '@/db';

import 'server-only';

import { comments as commentsModel } from '@/db/schema';
import { and, eq } from 'drizzle-orm';

import { MESSAGES } from '@/config/messages';
import { getCurrentUser } from '@/lib/utils/session';
import { CommentInput } from '@/lib/validations/comment.schema';

export const CommentsService = {
  getComments: (commentableId: string, commentType: any) => {
    return db.query.comments.findMany({
      where: and(
        eq(commentsModel.commentType, commentType),
        eq(commentsModel.commentableId, commentableId)
      ),
    });
  },

  create: async (input: CommentInput) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }
    const { commentableId, commentType, content } = input;
    const [comment] = await db
      .insert(commentsModel)
      .values({
        commentableId,
        commentType,
        content,
        commenterId: user.id,
      })
      .returning();
    return comment;
  },
  delete: async (id: string) => {
    const comment = await db.query.comments.findFirst({
      where: (commentsModel) => eq(commentsModel.id, id),
    });

    if (!comment) throw new Error(MESSAGES.COMMENT_NOT_FOUND);

    const [deleted] = await db
      .delete(commentsModel)
      .where(eq(commentsModel.id, id))
      .returning();

    return deleted;
  },
  update: async (commentId: string, input: CommentInput) => {
    const user = await getCurrentUser();
    if (!user) {
      throw new Error(MESSAGES.USER_NOT_FOUND);
    }

    const { commentableId, commentType, content } = input;

    const [comment] = await db
      .update(commentsModel)
      .set({
        commentableId,
        commentType,
        content,
        commenterId: user.id,
      })
      .where(eq(commentsModel.id, commentId))
      .returning();

    return comment;
  },
};
