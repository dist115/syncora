import { NextResponse } from 'next/server';
import { BillingService, StripeService, UserService } from '@/server/service';

import { env } from '@/env.mjs';
import { MESSAGES } from '@/config/messages';
import { getCurrentUser } from '@/lib/utils/session';

export async function POST(request: Request) {
  const { redirectUrl } = await request.json();
  const user = await getCurrentUser();
  if (!user) throw new Error(MESSAGES.USER_NOT_FOUND);
  const customerId = await BillingService.getCustomerId(user.id);

  try {
    const session = await StripeService.createCustomerPortalSession(
      customerId,
      redirectUrl
    );
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return new NextResponse(MESSAGES.INTERNAL_ERROR, { status: 500 });
  }
}
