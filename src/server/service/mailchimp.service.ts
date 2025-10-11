import 'server-only';
import { env } from "@/env.mjs";
import mailchimp from '@mailchimp/mailchimp_marketing';


export const MailchimpService = {
    subscribeToNewsletter: async (email: string) => {
        mailchimp.setConfig({
            apiKey: env.MAILCHIMP_API_KEY,
            server: env.MAILCHIMP_API_SERVER,
        });

        await mailchimp.lists.addListMember(env.MAILCHIMP_AUDIENCE_ID, {
            email_address: email,
            status: "subscribed",
        });
    }
};
