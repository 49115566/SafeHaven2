import { defineFunction } from '@aws-amplify/backend';

export const shelterApi = defineFunction({
  name: 'shelter-api',
  entry: './handler.ts',
  environment: {
    SHELTERS_TABLE: 'Shelter',
    USERS_TABLE: 'User',
  },
});