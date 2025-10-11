import { cookies } from 'next/headers';
import { lucia } from '@/auth';
import { db } from '@/db';
import { users, UserStatus, verificationTokens } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { isWithinExpirationDate } from 'oslo';

import { PAGES } from '@/config/pages';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  if (!token) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const verifyToken = await db.query.verificationTokens.findFirst({
      where: eq(verificationTokens.id, token),
    });

    if (!verifyToken || !isWithinExpirationDate(verifyToken.expiresAt)) {
      return new Response(null, {
        status: 400,
      });
    }

    const existingUser = await db.query.users.findFirst({
      where: eq(users.id, verifyToken.userId),
    });

    if (!existingUser || existingUser.email !== verifyToken.email) {
      return new Response(null, {
        status: 400,
      });
    }

    await lucia.invalidateUserSessions(existingUser.id);

    if (
      !existingUser.emailVerified ||
      existingUser.status !== UserStatus.Active
    ) {
      await db
        .update(users)
        .set({ emailVerified: true, status: UserStatus.Active })
        .where(eq(users.id, existingUser.id))
        .execute();
    }

    await db
      .delete(verificationTokens)
      .where(eq(verificationTokens.id, token))
      .execute();

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    return new Response(null, {
      status: 302,
      headers: {
        Location: existingUser.email
          ? PAGES.DASHBOARD.ROOT
          : PAGES.SETTINGS.USER.PROFILE,
      },
    });
  } catch (e) {
    console.error(e);
    return new Response(null, {
      status: 500,
    });
  }
}