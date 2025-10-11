import { cookies } from 'next/headers';
import { google, lucia } from '@/auth';
import { db } from '@/db';
import { users } from '@/db/schema';
import { createUser } from '@/server/actions/user.action';
import { createId } from '@paralleldrive/cuid2';
import { OAuth2RequestError } from 'arctic';
import { eq } from 'drizzle-orm';
import { PAGES } from '@/config/pages';

export interface GoogleAuthResponse {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookies().get('google_oauth_state')?.value ?? null;
  const codeVerifier = cookies().get('google_code_verifier')?.value ?? null;
  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !codeVerifier
  ) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, codeVerifier);
    const response = await fetch(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );
    const user: GoogleAuthResponse = await response.json();


    const existingUser = await db.query.users.findFirst({
      where: eq(users.googleId, user.sub),
    });

    if (existingUser) {
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
          Location: PAGES.DASHBOARD.ROOT
        },
      });
    }

    const dbUser = await createUser({
      googleId: user.sub,
      name: user.name,
      email: user.email,
      emailVerified: user.email_verified,
      image: user.picture,
    });
    if ('id' in dbUser) {
      // User object returned from createUser has an 'id' property
      const session = await lucia.createSession(dbUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      return new Response(null, {
        status: 302,
        headers: {
          Location: PAGES.DASHBOARD.ROOT
        },
      });
    } else {
      console.error('User object does not have an "id" property');
      return new Response(null, {
        status: 500,
      });
    }
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
}
