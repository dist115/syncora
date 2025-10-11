import { TEAM_PRICING, USER_PRICING } from '@/config/billing/plans';
import { PAGES } from '@/config/pages';

export const navMenuItems = [
  {
    title: 'Home',
    href: PAGES.STATIC.LANDING,
  },
  {
    title: 'Pricing',
    href: PAGES.STATIC.PRICING,
  },
  {
    title: 'Contact',
    href: PAGES.STATIC.CONTACT_US,
  },
  {
    title: 'Privacy Policy',
    href: PAGES.STATIC.PRIVACY_POLICY,
  },
  {
    title: 'Terms & Conditions',
    href: PAGES.STATIC.TERMS,
  },
  {
    title: 'FAQ',
    href: PAGES.STATIC.FAQ,
  },
];

export const trustedPartners = [
  {
    title: 'Trello',
    image: '/assets/trusted-partners/logo-1.webp',
  },
  {
    title: 'Bloomberg',
    image: '/assets/trusted-partners/logo-2.webp',
  },
  {
    title: 'Microsoft',
    image: '/assets/trusted-partners/logo-3.webp',
  },
  {
    title: 'Slack',
    image: '/assets/trusted-partners/logo-4.webp',
  },
  {
    title: 'Forbes',
    image: '/assets/trusted-partners/logo-5.webp',
  },
  {
    title: 'Adobe',
    image: '/assets/trusted-partners/logo-6.webp',
  },
];

export const storeFile = [
  {
    title: 'Create an account',
    description:
      'Quickly sign up to efficiently manage and securely store your files with Syncora’s user-friendly platform.',
    icon: 'User',
    color: '#9F57CB',
    shadowColor: '#9F57CB80',
  },
  {
    title: 'Upload your file',
    description:
      'Easily upload any file type using our simple, robust drag-and-drop or upload interface for seamless management.',
    icon: 'UpArrow',
    color: '#597AEA',
    shadowColor: '#597AEA80',
  },
  {
    title: 'Share file instantly',
    description:
      'Instantly share files securely with colleagues or clients, enhancing collaboration and communication.',
    icon: 'Hyperlink',
    color: '#57CBAA',
    shadowColor: '#57CBAA80',
  },
];

export const services = [
  {
    title: 'File Sharing',
    description:
      'Share files effortlessly with secure links, enhancing team collaboration and external partnerships.',
    icon: 'FileShare',
  },
  {
    title: 'Upload Files',
    description:
      'Quickly and efficiently upload files of any size and format with our user-friendly interface.',
    icon: 'FileUpload',
  },
  {
    title: 'Collect and receive files',
    description:
      'Streamline the process of collecting files with secure, straightforward, and customizable intake forms.',
    icon: 'FileReceive',
  },
];

export const features = [
  {
    title: 'Authentication',
    description: 'Secure user login with robust protection for your app.',
    image: '/assets/features/authentication.webp',
  },
  {
    title: 'Editable Homepage',
    description: 'Customize your homepage content with customizable options.',
    image: '/assets/features/editable-homepage.webp',
  },
  {
    title: 'Dark Mode',
    description: 'Enhance visual comfort with an optional darker color scheme.',
    image: '/assets/features/dark-mode.webp',
  },
  {
    title: 'File Previews',
    description: 'Quickly view file contents without download the entire file.',
    image: '/assets/features/file-preview.webp',
  },
  {
    title: 'High Performance',
    description: 'Experience efficiency with optimized performance.',
    image: '/assets/features/high-performance.webp',
  },
  {
    title: 'Sharing',
    description:
      'Facilitate seamless file sharing internally with guaranteed security.',
    image: '/assets/features/sharing.webp',
  },
  {
    title: 'Sharable Links',
    description:
      'Create secure links to share files with other users or members.',
    image: '/assets/features/shareable-links.webp',
  },
  {
    title: 'Responsive',
    description: 'Achieve flawless display on all devices and screen sizes.',
    image: '/assets/features/responsive.webp',
  },
  {
    title: 'Custom Pages',
    description: 'Design pages tailored to specific needs and requirements.',
    image: '/assets/features/custom-pages.webp',
  },
  {
    title: 'Analytics',
    description:
      'Gain insights with detailed analytics on file usage and users activity.',
    image: '/assets/features/analytics.webp',
  },
  {
    title: 'Advance Search',
    description:
      'Find files or folders swiftly using powerful and precise search tools.',
    image: '/assets/features/advance-search.webp',
  },
  {
    title: 'Trash',
    description: 'Easily manage deleted files and restore them as needed.',
    image: '/assets/features/trash.webp',
  },
];

export const pricing = {
  individual: USER_PRICING,
  team: TEAM_PRICING,
};

export const testimonials = [
  {
    name: 'Jonathat Taylor',
    username: '@jonathattylor',
    avatar: '/assets/avatars/avatar1.webp',
    post: 'Syncora has completely transformed our workflow with its user-friendly interface and efficiency. Highly recommended for anyone looking for a reliable file management solution.',
    date: new Date(),
  },
  {
    name: 'Isabella Berger',
    username: '@isabellaberger',
    avatar: '/assets/avatars/avatar2.webp',
    post: "Since we started using Syncora, our team's collaboration has significantly improved. It's a reliable, secure platform that has streamlined our document management processes.",
    date: new Date(),
  },
  {
    name: 'Justin Willson',
    username: '@justinwillson',
    avatar: '/assets/avatars/avatar3.webp',
    post: "Fantastic tool with unbeatable features! Syncora's support team is always responsive and helpful, making it an excellent choice for our business needs.",
    date: new Date(),
  },
  {
    name: 'Justin Willson',
    username: '@justinwillson',
    avatar: '/assets/avatars/avatar4.webp',
    post: 'Syncora made file management not only easy but also secure. Its features are perfectly tailored for growing businesses like ours, looking for scalable solutions.',
    date: new Date(),
  },
  {
    name: 'Jonathat Taylor',
    username: '@jonathattylor',
    avatar: '/assets/avatars/avatar5.webp',
    post: "A must-have service for any organization, Syncora's intuitive design and robust functionality make it indispensable for managing our critical data efficiently.",
    date: new Date(),
  },
  {
    name: 'Isabella Berger',
    username: '@isabellaberger',
    avatar: '/assets/avatars/avatar6.webp',
    post: 'We rely on Syncora daily for its excellent value and superb data protection system. Gradually has become an essential tool in our data management strategy.',
    date: new Date(),
  },
];

export const faqs = [
  {
    q: 'How much does it cost to be a credit card merchant?',
    ans: `For our recent trip to S.A. I booked several accommodation thru SA Places. I just wanted to tell you that everything worked out perfectly with all the bookings and also your booking was very quick and professional. I hope I have the opportunity to re-visit South Africa soon, I will then make my bookings with your company again. I will also recommend`,
  },
  {
    q: 'How can I open a merchant account?',
    ans: `For our recent trip to S.A. I booked several accommodation thru SA Places. I just wanted to tell you that everything worked out perfectly with all the bookings and also your booking was very quick and professional. I hope I have the opportunity to re-visit South Africa soon, I will then make my bookings with your company again. I will also recommend`,
  },
  {
    q: 'How long does the application take?',
    ans: `For our recent trip to S.A. I booked several accommodation thru SA Places. I just wanted to tell you that everything worked out perfectly with all the bookings and also your booking was very quick and professional. I hope I have the opportunity to re-visit South Africa soon, I will then make my bookings with your company again. I will also recommend`,
  },
  {
    q: 'Can I make payment outside of Hong Kong?',
    ans: `For our recent trip to S.A. I booked several accommodation thru SA Places. I just wanted to tell you that everything worked out perfectly with all the bookings and also your booking was very quick and professional. I hope I have the opportunity to re-visit South Africa soon, I will then make my bookings with your company again. I will also recommend`,
  },
  {
    q: 'How do I get the payment complete?',
    ans: `For our recent trip to S.A. I booked several accommodation thru SA Places. I just wanted to tell you that everything worked out perfectly with all the bookings and also your booking was very quick and professional. I hope I have the opportunity to re-visit South Africa soon, I will then make my bookings with your company again. I will also recommend`,
  },
];
