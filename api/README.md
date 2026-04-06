# RideSplit API

RESTful API server for the RideSplit ride-sharing application.

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Supabase project with database schema

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment variables:
```bash
cp ../.env.example .env
```

3. Fill in your `.env` file with your Supabase credentials:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_ANON_KEY=your_supabase_anon_key
PORT=3000
NODE_ENV=development
```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm start
```

The server will start on `http://localhost:3000` by default.

## API Endpoints

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:email` - Get user by email

### Vehicles
- `GET /api/vehicles` - Get all vehicles with owner information

### Trips
- `GET /api/trips` - Get all trips with details
- `GET /api/trips/:id` - Get specific trip with details
- `POST /api/trips` - Create a new trip

### Passengers
- `POST /api/trips/:id/passengers` - Add passenger to trip
- `PUT /api/passengers/:id/payment` - Mark passenger as paid

### Health
- `GET /health` - Health check endpoint

## Testing

Run the smoke tests to verify API functionality:
```bash
npm test
```

## Database Schema

The API expects the following database tables:

- `users` - User information
- `vehicles` - Vehicle details and ownership
- `trips` - Trip records
- `trip_passengers` - Passenger information and payments

See `../supabase/db/01_schema.sql` for the complete schema.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin access | Yes |
| `SUPABASE_ANON_KEY` | Anonymous key for client access | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Security

- The API uses Helmet.js for security headers
- CORS is enabled for cross-origin requests
- Input validation is performed using Joi schemas
- Service role key is used for database operations (server-side only)

## API Documentation

See `openapi.yaml` for complete API documentation including request/response schemas and examples.
