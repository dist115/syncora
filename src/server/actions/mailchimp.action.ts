'use server';

import { handleServerError } from "@/lib/utils/error";
import { MailchimpService } from "../service/mailchimp.service";

export async function subscribeToNewsletter(email: string) {
    try {
        const subscribed = await MailchimpService.subscribeToNewsletter(email);
        return subscribed;

    } catch (error) {
        return handleServerError(error);
    }

}

