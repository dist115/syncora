'use server';

import { revalidateTag } from 'next/cache';
import ContactUsEmail from '@/email-templates/contact-us-email';
import { ContactService } from '@/server/service/contact.service';
import { render } from '@react-email/render';

import { env } from '@/env.mjs';
import { MESSAGES } from '@/config/messages';
import { sendMessageEmail } from '@/lib/utils/email';
import { handleServerError } from '@/lib/utils/error';
import { applyValidation } from '@/lib/utils/validation';
import {
  ContactUsInput,
  ContactUsSchema,
} from '@/lib/validations/contact-us.schema';

import { SettingsService } from '../service';

export const handleContact = async (input: ContactUsInput) => {
  try {
    const data = applyValidation(ContactUsSchema, input);
    const from = `${data.name}<${data.email}>`;
    const contact = await ContactService.create(data);
    revalidateTag('get-all-contacts');
    const settingsEmail = await SettingsService.get('email');

    if (null === settingsEmail) {
      throw new Error(MESSAGES.RECEIVER_EMAIL_NOT_SPECIFIED_ON_SITE_SETTINGS);
    }
    const to = `${env.NEXT_PUBLIC_APP_NAME}<${settingsEmail?.value}>`;
    await sendMessageEmail({
      from: from,
      to: to,
      subject: data.subject,
      html: await render(ContactUsEmail(data.message)),
      text: data.message,
    });
    return contact;
  } catch (error) {
    return handleServerError(error);
  }
};

export const getAllContact = async (params: any) => {
  const contacts = await ContactService.getContacts(params);
  revalidateTag('get-all-contacts');
  return contacts;
};
