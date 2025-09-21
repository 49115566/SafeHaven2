# SafeHaven Connect - AWS Amplify Deployment

This project is configured for deployment to AWS Amplify with minimal setup required.

## Prerequisites

- AWS Account
- AWS CLI configured (optional, for local development)
- Node.js 18+ and npm

## Deployment Steps

### Option 1: Deploy via Amplify Console (Recommended)

1. **Connect Repository**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
   - Click "New app" → "Host web app"
   - Connect your Git repository (GitHub, GitLab, Bitbucket, etc.)
   - Select this repository and branch

2. **Configure Build Settings**
   - Amplify will automatically detect the `amplify.yml` file
   - No additional configuration needed - the build settings are pre-configured

3. **Deploy**
   - Click "Save and deploy"
   - Amplify will automatically:
     - Set up the DynamoDB tables
     - Deploy the GraphQL API
     - Build and deploy the React frontend
     - Configure CORS and API endpoints

4. **Access Your App**
   - Once deployment completes, you'll get a URL to access your app
   - The backend API will be automatically configured

### Option 2: Deploy via Amplify CLI (Advanced)

1. **Install Amplify CLI**
   ```bash
   npm install -g @aws-amplify/cli
   ```

2. **Configure Amplify**
   ```bash
   amplify configure
   ```

3. **Deploy**
   ```bash
   npx ampx sandbox
   ```

## What Gets Deployed

- **Frontend**: React app hosted on Amplify Hosting with CDN
- **Backend**: 
  - DynamoDB tables for shelters and users
  - GraphQL API with real-time subscriptions
  - Automatic API key authentication
- **Infrastructure**: All AWS resources managed automatically

## Environment Variables

No environment variables need to be manually configured. Amplify automatically:
- Generates API endpoints
- Configures authentication
- Sets up CORS policies
- Manages database connections

## Local Development

To run locally after deployment:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Pull Amplify configuration:
   ```bash
   npx ampx generate outputs --app-id YOUR_APP_ID --branch main
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Features

- **Real-time Updates**: Changes to shelter data sync across all connected clients
- **Scalable**: DynamoDB automatically scales with usage
- **Secure**: API key authentication with configurable expiration
- **Fast**: Global CDN distribution for optimal performance
- **Cost-effective**: Pay only for what you use

## Troubleshooting

- **Build fails**: Check that all dependencies are properly listed in package.json
- **API errors**: Verify that the Amplify backend has been deployed successfully
- **CORS issues**: Amplify automatically handles CORS - no manual configuration needed

The deployment is designed to be as simple as possible - just connect your repository to Amplify and deploy!