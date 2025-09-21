import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Shelter: a
    .model({
      name: a.string().required(),
      address: a.string().required(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      currentCapacity: a.integer().required(),
      maxCapacity: a.integer().required(),
      needsFood: a.boolean().default(false),
      needsWater: a.boolean().default(false),
      needsMedical: a.boolean().default(false),
      needsBlankets: a.boolean().default(false),
      needsClothing: a.boolean().default(false),
      status: a.enum(['no-action', 'acknowledged', 'in-progress', 'completed']).default('no-action'),
      otherInfo: a.string(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  User: a
    .model({
      name: a.string().required(),
      type: a.enum(['shelter', 'responder']).required(),
      shelterId: a.id(),
      latitude: a.float(),
      longitude: a.float(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});