export const PAGES = {
  STATIC: {
    LANDING: '/',
    CONTACT_US: '/contact-us',
    FAQ: '/faq',
    PRIVACY_POLICY: '/privacy-policy',
    TERMS: '/terms',
    PRICING: '/pricing',
  },
  AUTH: {
    LOGIN: '/login', // Magic link login (keep existing)
    PASSWORD_LOGIN: '/auth/login', // NEW: Password login
    SIGNUP: '/auth/signup',
    VERIFY_EMAIL: '/auth/verify-email',
    MFA_CHOICE: '/auth/mfa-choice', // NEW: MFA choice page
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  DASHBOARD: {
    ROOT: '/dashboard',
    FILES: '/dashboard/files',
    FAVOURITES: '/dashboard/files/favourites',
    TRASH: '/dashboard/files/trash',
    FOLDERS: '/dashboard/folders',
  },
  ADMIN: {
    ROOT: '/admin',
    USER: '/admin/users',
    TEAMS: '/admin/teams',
    FAQ: '/admin/faq',
    SETTINGS: '/admin/site-settings',
    PRIVACY_POLICY: '/admin/privacy-policy',
    TERMS: '/admin/terms',
    CONTACT: '/admin/contact',
    FILE: '/admin/files',
  },
  SETTINGS: {
    USER: {
      PROFILE: '/settings/profile',
      BILLING: '/settings/billing',
      TEAMS: '/settings/teams',
    },
    TEAM: {
      ROOT: '/settings/team/general',
      MEMBERS: '/settings/team/members',
      ROLES: '/settings/team/roles',
      INVITED: '/settings/team/invited',
      BILLING: '/settings/team/billing',
    },
  },
  DOC: {
    LINK: 'https://test.com/' // change this later

  }
};
