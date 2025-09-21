# Backend Setup Guide

This guide explains how to set up and deploy the SafeHaven Connect backend using AWS Amplify Gen 2.

## Architecture Overview

The backend uses AWS Amplify Gen 2 with:
- **DynamoDB** for data storage (Shelters and Users tables)
- **GraphQL API** with real-time subscriptions
- **Lambda Functions** for custom API endpoints
- **API Gateway** for REST API access

## Quick Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Amplify
```bash
npx ampx configure
```

### 3. Deploy Backend
```bash
npx ampx sandbox
```

### 4. Start Frontend
```bash
npm run dev
```

## Data Models

### Shelter Model
- **name**: String (required)
- **latitude/longitude**: Float (required) - GPS coordinates
- **address**: String (required) - Human-readable address
- **currentCapacity/maximumCapacity**: Integer - Occupancy info
- **foodNeed/waterNeed/medicalSuppliesNeed/blanketsNeed/clothingNeed**: Integer (0-5 scale)
- **otherNeeds**: String - Additional needs description
- **status**: Enum (no-action, acknowledged, in-progress, completed)
- **otherInformation**: String - Additional shelter info
- **lastUpdated**: DateTime - Auto-updated timestamp

### User Model
- **name**: String (required)
- **type**: Enum (shelter, responder) - User role
- **shelterId**: ID - Associated shelter (for shelter users)
- **latitude/longitude**: Float - Location (for responders)
- **address**: String - Address (for responders)

## API Endpoints

### GraphQL API (Primary)
- Automatic CRUD operations for all models
- Real-time subscriptions for live updates
- Optimistic UI support

### REST API (Lambda Function)
- `GET /health` - Health check
- `GET /shelters` - List all shelters
- `POST /shelters` - Create shelter
- `PUT /shelters/{id}` - Update shelter
- `PATCH /shelters/{id}/status` - Update shelter status
- `GET /users` - List all users
- `POST /users` - Create user

## Real-time Features

The backend supports real-time updates through GraphQL subscriptions:
- Shelter updates are automatically pushed to all connected clients
- Status changes are immediately visible to first responders
- New shelters appear instantly on responder dashboards

## Security

- **API Key Authentication** for public access during emergencies
- **CORS** configured for web access
- **DynamoDB** with proper IAM permissions
- **Lambda** functions with least-privilege access

## Environment Variables

The Lambda function uses these environment variables:
- `SHELTERS_TABLE` - DynamoDB table name for shelters
- `USERS_TABLE` - DynamoDB table name for users

## Deployment to Production

### Option 1: Amplify Console (Recommended)
1. Connect repository to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Amplify automatically detects the configuration
3. Deploy with one click

### Option 2: CLI Deployment
```bash
npx ampx deploy --branch main
```

## Monitoring and Logs

- **CloudWatch Logs** for Lambda function debugging
- **DynamoDB Metrics** for performance monitoring
- **API Gateway Logs** for request tracking

## Troubleshooting

### Common Issues

1. **Permission Errors**: Ensure Lambda has DynamoDB permissions
2. **CORS Issues**: Check API Gateway CORS configuration
3. **Real-time Not Working**: Verify GraphQL subscriptions are enabled

### Debug Commands
```bash
# Check backend status
npx ampx status

# View logs
npx ampx logs

# Reset backend
npx ampx delete
npx ampx sandbox
```

## Cost Optimization

- **DynamoDB On-Demand** pricing for variable workloads
- **Lambda** pay-per-request pricing
- **API Gateway** free tier covers most emergency scenarios
- **Amplify Hosting** with global CDN included