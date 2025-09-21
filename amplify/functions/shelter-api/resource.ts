import { defineFunction } from '@aws-amplify/backend';

export const shelterApi = defineFunction({
  name: 'shelter-api',
  entry: './handler.ts',
});