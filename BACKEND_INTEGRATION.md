# Backend Integration

This document describes the backend integration for SafeHaven Connect.

## Architecture

The application now uses a client-server architecture:
- **Frontend**: React application (existing)
- **Backend**: Node.js/Express API server with SQLite database
- **Database**: SQLite for persistent data storage

## Backend Components

### Database Schema
- `users` table: Stores user information (shelter staff and first responders)
- `shelters` table: Stores shelter information, capacity, needs, and status

### API Endpoints
- `GET /api/shelters` - Get all shelters
- `POST /api/shelters` - Create new shelter
- `PUT /api/shelters/:id` - Update shelter
- `PATCH /api/shelters/:id/status` - Update shelter status only
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user

## Running the Application

### Option 1: Run both servers simultaneously
```bash
npm start
```

### Option 2: Run servers separately
Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
npm run dev
```

## Data Migration

The application automatically loads data from the backend API instead of localStorage. Existing localStorage data will not be migrated - the application starts with a clean database.

## Changes Made

### Frontend Changes
1. Created `src/services/api.ts` - API service layer
2. Modified `src/contexts/AppContext.tsx` - Replaced localStorage with API calls
3. Updated components to use async actions:
   - `ShelterAuth.tsx` - Async shelter/user creation
   - `ShelterDashboard.tsx` - Async shelter updates
   - `ResponderDashboard.tsx` - Async status updates

### Backend Structure
```
backend/
├── package.json
├── server.js          # Express server and API routes
├── database.js        # SQLite database setup
└── safehaven.db       # SQLite database file (created automatically)
```

## Data Structure Compatibility

The backend maintains the exact same data structure as the original frontend-only version, ensuring minimal changes to existing components.