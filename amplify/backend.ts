import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { shelterApi } from './functions/shelter-api/resource';

export const backend = defineBackend({
  data,
  shelterApi,
});

// Grant the Lambda function access to DynamoDB tables
backend.shelterApi.resources.lambda.addToRolePolicy({
  effect: 'Allow',
  actions: [
    'dynamodb:GetItem',
    'dynamodb:PutItem',
    'dynamodb:UpdateItem',
    'dynamodb:DeleteItem',
    'dynamodb:Scan',
    'dynamodb:Query',
  ],
  resources: [
    backend.data.resources.tables['Shelter'].tableArn,
    backend.data.resources.tables['User'].tableArn,
  ],
});