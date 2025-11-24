/**
 * This file contains the plans that will be displayed in the billing page
 *
 */
export const FREE_INDIVIDUAL_PLAN_ID = 'price_1PGGSpRqpbVy5HxZfhS3n3wA';
export const FREE_TEAM_PLAN_ID = 'price_1PGGW1RqpbVy5HxZ0KyhxcgK';

export const FREE_PLAN_USER = {
  slug: 'FREE_USER',
  name: 'Free',
  description: 'Free forever, with basic features.',
  features: {
    included: ['300MB Storage', 'Basic Features'],
    notIncluded: [
      'Email Support',
      'Premium Features',
      '24/7 Chat Support',
      'Unlimited Access',
    ],
  },
  plans: [
    {
      name: '',
      description: '',
      price: '$0/month',
      planId: 'price_1PGGSpRqpbVy5HxZfhS3n3wA',
      trial: '',
      storage: '300MB',
      teams:2
    },
  ],
};

export const USER_PRICING = [
  FREE_PLAN_USER,
  {
    slug: 'PREMIUM_USER',
    name: 'Premium',
    description: 'For premium users, with premium features.',
    features: {
      included: [
        '1GB Storage',
        'Basic Features',
        'Email Support',
        'Premium Features',
        '24/7 Chat Support',
      ],
      notIncluded: ['Unlimited Access'],
    },
    plans: [
      {
        name: 'Monthly',
        description: 'The monthly premium plan',
        price: '$99/month',
        planId: 'price_1PGGSpRqpbVy5HxZl3eJ3s4b', // This is the id that will be used to identify the plan in the payment gateway
        trial: '1 Day',
        storage: '1GB',
        teams:5
      },
    ],
  },
  {
    slug: 'EXCLUSIVE_USER',
    name: 'Exclusive',
    description: 'For exclusive users, with exclusive features.',
    features: {
      included: [
        '10GB Storage',
        'Basic Features',
        'Email Support',
        'Premium Features',
        '24/7 Chat Support',
        'Unlimited Access',
      ],
      notIncluded: [],
    },
    plans: [
      {
        name: 'Monthly',
        description: 'The monthly exclusive plan',
        price: '$199/month',
        planId: 'price_1PGGSpRqpbVy5HxZ670MLwX1', // This is the id that will be used to identify the plan in the payment gateway
        trial: '1 Day',
        storage: '10GB',
        teams:10
      },
    ],
  },
];

export const FREE_PLAN_TEAM = {
  slug: 'FREE_TEAM',
  name: 'Free',
  description: 'Free forever, with basic features.',
  features: {
    included: ['600MB Storage', 'Basic Features', 'Email Support'],
    notIncluded: ['Premium Features', '24/7 Chat Support', 'Unlimited Access'],
  },
  plans: [
    {
      name: '',
      description: '',
      price: '$0/month',
      planId: 'price_1PGGW1RqpbVy5HxZ0KyhxcgK',
      trial: '',
      storage: '600MB',
      teams:2
    },
  ],
};

export const TEAM_PRICING = [
  FREE_PLAN_TEAM,
  {
    slug: 'BASIC_TEAM',
    name: 'Basic',
    description: 'For basic teams, with basic features.',
    features: {
      included: [
        '100GB Storage',
        'Basic Features',
        'Email Support',
        'Premium Features',
        '24/7 Chat Support',
      ],
      notIncluded: ['Unlimited Access'],
    },
    plans: [
      {
        name: 'Monthly',
        description: 'The monthly premium plan',
        price: '$300/month',
        planId: 'price_1PGGW1RqpbVy5HxZBkuDrOnb', // This is the id that will be used to identify the plan in the payment gateway
        trial: '1 Day',
        storage: '100GB',
        teams:5
      },
    ],
  },
  {
    slug: 'PREMIUM_TEAM',
    name: 'Premium',
    description: 'For premium teams, with premium features.',
    features: {
      included: [
        '500GB Storage',
        'Basic Features',
        'Email Support',
        'Premium Features',
        '24/7 Chat Support',
        'Unlimited Access',
      ],
      notIncluded: [],
    },
    plans: [
      {
        name: 'Monthly',
        description: 'The monthly premium plan',
        price: '$999/month',
        planId: 'price_1PGGW1RqpbVy5HxZm5g7tfNw', // This is the id that will be used to identify the plan in the payment gateway
        trial: '1 Day',
        storage: '500GB',
        teams:10
      },
    ],
  },
];
