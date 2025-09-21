import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  Shelter: a
    .model({
      name: a.string().required(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      address: a.string().required(),
      currentCapacity: a.integer().default(0),
      maximumCapacity: a.integer().required(),
      foodNeed: a.integer().default(0),
      waterNeed: a.integer().default(0),
      medicalSuppliesNeed: a.integer().default(0),
      blanketsNeed: a.integer().default(0),
      clothingNeed: a.integer().default(0),
      otherNeeds: a.string().default(''),
      status: a.enum(['no-action', 'acknowledged', 'in-progress', 'completed']).default('no-action'),
      otherInformation: a.string().default(''),
      lastUpdated: a.datetime().required(),
    })
    .authorization((allow) => [allow.publicApiKey()]),

  User: a
    .model({
      name: a.string().required(),
      type: a.enum(['shelter', 'responder']).required(),
      shelterId: a.id(),
      latitude: a.float(),
      longitude: a.float(),
      address: a.string(),
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