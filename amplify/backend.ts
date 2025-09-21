import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { shelterApi } from './functions/shelter-api/resource';

export const backend = defineBackend({
  data,
  shelterApi,
});