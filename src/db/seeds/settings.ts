import { eq, ilike as like, sql } from "drizzle-orm";
import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { settings, userRoles, users, UserStatus } from "../schema";
import { id } from "date-fns/locale";
import { SettingsService, UserService } from "@/server/service";



export const settingsSeeder = async (
    db: NodePgDatabase<Record<string, never>>,
) => {
    const faqData = [
        { title: "01. What is Syncora?", description: "Syncora is a cloud-based file management system designed to help users store, share, and manage their files easily and securely from anywhere." },
        { title: "02. How does Syncora differ from other cloud storage solutions?", description: "Syncora sets itself apart by offering enhanced collaboration tools, superior file management capabilities, and customizable options tailored to user needs" },
        { title: "03. Is Syncora secure for storing sensitive data?", description: "Yes, Syncora prioritizes security with end-to-end encryption, rigorous compliance with international data protection regulations, and advanced access controls." },
        { title: "04. Can I access my files from any device?", description: "Absolutely, Syncora is fully responsive and accessible from any device with internet connectivity, including smartphones, tablets, and desktop computers." },
        { title: "05. How much storage space do I get with Syncora?", description: "Syncora offers various storage plans to suit different needs, starting from basic free plans to more extensive storage options for enterprise users." },
        { title: "06. Does Syncora offer collaboration features?", description: "Yes, Syncora includes features like real-time collaboration, file sharing with permissions, and team folders to enhance productivity and teamwork." },
        { title: "07. What level of customer support is provided?", description: "Syncora provides 24/7 customer support through multiple channels, including live chat, email, and phone support, ensuring users receive timely assistance." },
        { title: "08. Is my data backed up ?", description: "Yes, Syncora automatically backs up all stored data to multiple secure locations to prevent data loss and ensure data recovery options are always available." }
    ]
    const privacyPolicy = `<h3 class="my-6 font-semibold">How We Collect and Use Information</h3><p class="leading-loose my-6"><span style="color: rgb(13, 13, 13)">Syncora collects both personal and non-personal information to enhance service functionality and user experience. This includes details provided during account registration, such as your name, email address, and professional background, as well as behavioral data captured through interactions with our services, utilizing cookies and similar technologies to gather comprehensive usage statistics. This collected data is critical for providing personalized services, facilitating operational enhancements, conducting communications about updates and promotional offers, and ensuring compliance with legal standards. We commit to responsibly using this information to continuously improve user experiences, innovate within our service offerings, and maintain robust security measures.</span></p><p class="leading-loose my-6"></p><h3 class="my-6 font-semibold">Sharing Your Information</h3><p class="leading-loose my-6"><span style="color: rgb(13, 13, 13)">Syncora upholds your privacy and does not sell personal information to third parties. We only share data with trusted third-party service providers who assist in maintaining and operating our platform, such as hosting and IT services, under stringent confidentiality agreements. Additionally, we may disclose your information to comply with legal obligations, protect our rights in the event of disputes, or ensure the safety of our users against fraud and abuse. Occasionally, with your explicit consent, we share data when you utilize features requiring collaboration or generate links for file sharing. Our policy emphasizes transparency and responsibility in handling your data to safeguard your privacy while providing essential service functionality.</span></p><p class="leading-loose my-6"></p><h3 class="my-6 font-semibold">Your Rights and Choices Regarding Your Data</h3><p class="leading-loose my-6"><span style="color: rgb(13, 13, 13)">Syncora enables you to actively manage your personal information. You can access, review, amend, or delete your data via your account settings, which also provide tools to adjust your privacy settings or opt out of specific data usage practices. Additionally, you have the right to object to certain processing activities and request limitations on how we use your information. Should you have any questions or wish to exercise your rights, our dedicated customer support team is available to offer assistance. We are committed to responding swiftly and respectfully to such requests, ensuring that you maintain control over your personal information and fully understand your rights and choices.</span></p>`
    const terms = `<h3 class="my-6 font-semibold">Conditions of use</h3><p class="leading-loose my-6"><span style="color: rgb(13, 13, 13)">By accessing and using Syncora, you agree to comply with these terms and conditions and any subsequent amendments. Our platform is designed for both personal and professional use, providing a range of functionalities tailored to enhance user efficiency and data management. Users are expected to act ethically and in accordance with all applicable laws. Unauthorized use, including the unauthorized distribution of copyrighted materials, may result in suspension or termination of your account. We reserve the right to modify, suspend, or discontinue any aspect of our services at any time without prior notice. It is important for users to review these terms regularly to ensure understanding and compliance with the current rules governing the use of our services.</span></p><p class="leading-loose my-6"></p><h3 class="my-6 font-semibold">Account Registration and Security</h3><p class="leading-loose my-6"><span style="color: rgb(13, 13, 13)">To access and utilize the full range of features offered by Syncora, users must register for an account by providing accurate and current information. You are responsible for maintaining the secrecy of your account credentials and must promptly inform us of any unauthorized use of your account or security breaches. Although Syncora employs advanced security measures to protect your personal data, the nature of the internet means that absolute security cannot be fully guaranteed. We urge you to take strong precautions to protect your own information, especially when accessing our services through public or shared networks. Ensuring the confidentiality of your login information is crucial to protecting your personal data and preventing unauthorized access.</span></p><p class="leading-loose my-6"></p><h3 class="my-6 font-semibold">Copyright and Ownership</h3><p class="leading-loose my-6"><span style="color: rgb(13, 13, 13)">All materials and content accessible on Syncora, including but not limited to text, graphics, logos, images, videos, and sound, are the proprietary intellectual property of Syncora or its licensors and are protected under international copyright and trademark laws. Unauthorized use, reproduction, or distribution of this content without prior explicit permission from Syncora could result in civil and criminal penalties. By using our services, you grant Syncora a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display any content you upload or create on the platform, for the purpose of operating, promoting, and improving our services. This license does not imply a transfer of any intellectual property rights from you to Syncora and is intended solely to facilitate the provision of our services.</span></p>`
    const insertSettingsData = [
        {
            key: 'faq',
            value: JSON.stringify(faqData)
        },
        {
            key: 'privacy_policy',
            value: privacyPolicy
        },
        {
            key: 'terms',
            value: terms
        }
    ]

    try {    
        const allSettings = await db.select({ key: settings.key }).from(settings);
        if (typeof allSettings === 'undefined' || !allSettings || allSettings.length === 0) {
            const [insertSettings] = await db.insert(settings).values(insertSettingsData).returning();
            console.log(`✅ FAQ,Privacy Policy,Terms are Inserteed\n`);
        }
    }
    catch (error) {
        console.error('Error inserting user and assigning role:', error);
    }
};