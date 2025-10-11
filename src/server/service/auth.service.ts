import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { lucia } from '@/auth';
import { db } from '@/db';
import { users, UserStatus, verificationTokens } from '@/db/schema';
import AuthenticationEmail from '@/email-templates/authentication-email';
import { render } from '@react-email/render';
import { eq } from 'drizzle-orm';
import { generateId } from 'lucia';
import { createDate, TimeSpan } from 'oslo';

import { env } from '@/env.mjs';
import { MESSAGES } from '@/config/messages';
import { validateRequest } from '@/lib/utils/auth';
import { sendEmail } from '@/lib/utils/email';

import { UserService } from './user.service';

export const AuthService = {
  signOut: async () => {
    const { session } = await validateRequest();
    if (!session) {
      return;
    }
    await lucia.invalidateSession(session?.id);
    redirect('/login');
  },
  magicLogin: async (email: string) => {
    let user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    const tempName = email.split('@')[0];
    if (!user) {
      user = await UserService.create({
        name: tempName,
        email,
        status: UserStatus.Inactive,
      });
    }
    const token = await AuthService.createEmailVerificationToken(
      user.id,
      email
    );

    const link = `${env.SITE_URL}/login/verify?token=${token}`;

    const html = await render(AuthenticationEmail(link));

    await sendEmail({
      to: email,
      subject: MESSAGES.MAGIC_LINK_EMAIL_SUBJECT,
      html,
    });

    return { ok: true };
  },
  //NOTE : This will only be used for demo purpose
  demoLogin: async (email: string) => {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    try {
      if (!user) {
        return new Response(null, {
          status: 400,
        });
      }

      const session = await lucia.createSession(user.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return { ok: true };
    } catch (e) {
      console.error(e);
      return new Response(null, {
        status: 500,
      });
    }
  },

  createEmailVerificationToken: async (userId: string, email: string) => {
    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.userId, userId))
      .execute();

    const tokenId = generateId(40);
    await db
      .insert(verificationTokens)
      .values({
        id: tokenId,
        email: email,
        userId: userId,
        expiresAt: createDate(new TimeSpan(2, 'h')),
      })
      .execute();
    return tokenId;
  },
};
