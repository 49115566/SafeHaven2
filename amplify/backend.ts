import { defineBackend } from '@aws-amplify/backend';
import { data } from './data/resource';
import { shelterApi } from './functions/shelter-api/resource';

export const backend = defineBackend({
  data,
  shelterApi,
});

// Add environment variables for table names
backend.shelterApi.addEnvironment('SHELTERS_TABLE', backend.data.resources.tables['Shelter'].tableName);
backend.shelterApi.addEnvironment('USERS_TABLE', backend.data.resources.tables['User'].tableName);

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