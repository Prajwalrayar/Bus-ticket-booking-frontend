export const APP_CONSTANTS = {
  APP_NAME: 'Bus Ticket Booking System',

  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_ID: 'user_id',
    USER_ROLE: 'user_role'
  },

  ROLES: {
    CUSTOMER: 'CUSTOMER',
    ADMIN: 'ADMIN',
    BUS_OPERATOR: 'BUS_OPERATOR',
    SUPPORT_AGENT: 'SUPPORT_AGENT'
  },

  GENDER_OPTIONS: [
    'MALE',
    'FEMALE',
    'OTHER'
  ],

  ID_TYPE_OPTIONS: [
    'AADHAAR',
    'PASSPORT',
    'DRIVING_LICENSE',
    'VOTER_ID'
  ],

  PAYMENT_METHOD_OPTIONS: [
    'UPI',
    'WALLET'
  ]
} as const;