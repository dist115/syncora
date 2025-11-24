import { NextResponse } from 'next/server';
import { TeamService } from '@/server/service/team.service';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const token = searchParams.get('token') || '';

  try {
    const isValidToken = await TeamService.acceptInvitation(token);
    if (!isValidToken) {
      return NextResponse.redirect(
        new URL('/login?message=invalid_token', request.url)
      );
    }
    return NextResponse.redirect(
      new URL('/login?message=welcome', request.url)
    );
  } catch (error) {
    return NextResponse.redirect(
      new URL('/login?message=invalid_token', request.url)
    );
  }
}
