import type { APIGatewayProxyHandler } from 'aws-lambda';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

const SHELTERS_TABLE = process.env.SHELTERS_TABLE || 'Shelter';
const USERS_TABLE = process.env.USERS_TABLE || 'User';

const corsHeaders = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
};

export const handler: APIGatewayProxyHandler = async (event) => {
  const { httpMethod, path, body, pathParameters } = event;
  
  try {
    // Health check
    if (httpMethod === 'GET' && path === '/health') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }),
      };
    }

    // CORS preflight
    if (httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: corsHeaders,
        body: '',
      };
    }

    // Shelters endpoints
    if (path === '/shelters') {
      if (httpMethod === 'GET') {
        const result = await docClient.send(new ScanCommand({ TableName: SHELTERS_TABLE }));
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify(result.Items || []),
        };
      }
      
      if (httpMethod === 'POST') {
        const shelter = JSON.parse(body || '{}');
        shelter.id = shelter.id || crypto.randomUUID();
        shelter.lastUpdated = new Date().toISOString();
        
        await docClient.send(new PutCommand({
          TableName: SHELTERS_TABLE,
          Item: shelter,
        }));
        
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify(shelter),
        };
      }
    }

    if (path?.startsWith('/shelters/') && pathParameters?.id) {
      const shelterId = pathParameters.id;
      
      if (httpMethod === 'PUT') {
        const shelter = JSON.parse(body || '{}');
        shelter.id = shelterId;
        shelter.lastUpdated = new Date().toISOString();
        
        await docClient.send(new PutCommand({
          TableName: SHELTERS_TABLE,
          Item: shelter,
        }));
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify(shelter),
        };
      }
      
      if (httpMethod === 'PATCH' && path.endsWith('/status')) {
        const { status } = JSON.parse(body || '{}');
        
        await docClient.send(new UpdateCommand({
          TableName: SHELTERS_TABLE,
          Key: { id: shelterId },
          UpdateExpression: 'SET #status = :status, lastUpdated = :lastUpdated',
          ExpressionAttributeNames: { '#status': 'status' },
          ExpressionAttributeValues: {
            ':status': status,
            ':lastUpdated': new Date().toISOString(),
          },
        }));
        
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify({ success: true }),
        };
      }
    }

    // Users endpoints
    if (path === '/users') {
      if (httpMethod === 'GET') {
        const result = await docClient.send(new ScanCommand({ TableName: USERS_TABLE }));
        return {
          statusCode: 200,
          headers: corsHeaders,
          body: JSON.stringify(result.Items || []),
        };
      }
      
      if (httpMethod === 'POST') {
        const user = JSON.parse(body || '{}');
        user.id = user.id || crypto.randomUUID();
        
        await docClient.send(new PutCommand({
          TableName: USERS_TABLE,
          Item: user,
        }));
        
        return {
          statusCode: 201,
          headers: corsHeaders,
          body: JSON.stringify(user),
        };
      }
    }

    return {
      statusCode: 404,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Not found' }),
    };
    
  } catch (error) {
    console.error('Lambda error:', error);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};