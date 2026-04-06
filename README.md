# RideSplit - Ride Sharing Application

A full-stack ride-sharing application built with Node.js/Express API backend, vanilla JavaScript frontend, and Supabase database.

## Project Structure

```
RideSplit/
├── api/                    # Backend API server
│   ├── package.json       # Node.js dependencies
│   ├── server.js          # Express server with API endpoints
│   ├── openapi.yaml       # API documentation
│   └── README.md          # API-specific documentation
├── client/                 # Frontend application
│   ├── package.json       # Dependencies
│   ├── index.html         # Main HTML file
│   ├── styles.css         # Styling
│   ├── script.js          # JavaScript functionality
│   └── README.md          # Frontend documentation
├── supabase/              # Database configuration
│   └── db/
│       ├── 01_schema.sql  # Database schema
│       ├── 02_seed.sql    # Seed data
│       └── 03_policies.sql # RLS policies
├── tests/                 # Test files
│   └── smoke.js          # API smoke tests
├── .env.example          # Environment variables template
└── README.md             # This file
```

## Features

### Core Functionality
- **User Management**: Create and manage user profiles
- **Vehicle Management**: Add and manage vehicles with MPG tracking
- **Trip Management**: Create trips with distance and fuel cost tracking
- **Passenger Management**: Add passengers to trips and track payments
- **Cost Splitting**: Automatic calculation of ride costs among passengers

### Technical Features
- **RESTful API**: Well-documented API with OpenAPI specification
- **Database Security**: Row Level Security (RLS) policies for data protection
- **Input Validation**: Comprehensive validation using Joi schemas
- **Responsive Design**: Mobile-friendly frontend interface
- **Error Handling**: Proper error handling throughout the application

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Supabase account and project

### Step 1: Database Setup (Supabase)

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and service role key

2. **Set up Database Schema**
   - Run the SQL scripts in order:
     ```bash
   # Execute these in your Supabase SQL editor
   cat supabase/db/01_schema.sql
   cat supabase/db/02_seed.sql
   cat supabase/db/03_policies.sql
     ```

3. **Add Instructor as Admin**
   - In Supabase dashboard, go to Authentication → Users
   - Add your instructor as an admin user

### Step 2: Backend Setup

1. **Navigate to API directory**
   ```bash
   cd api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp ../.env.example .env
   ```
   Edit `.env` with your Supabase credentials:
   ```
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the API server**
   ```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000`

### Step 3: Frontend Setup

1. **Navigate to client directory**
   ```bash
   cd client
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend server**
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:8080`

## API Documentation

### Endpoints

#### Users
- `GET /api/users` - Get all users
- `GET /api/users/:email` - Get user by email

#### Vehicles
- `GET /api/vehicles` - Get all vehicles with owner information

#### Trips
- `GET /api/trips` - Get all trips with details
- `GET /api/trips/:id` - Get specific trip with details
- `POST /api/trips` - Create a new trip

#### Passengers
- `POST /api/trips/:id/passengers` - Add passenger to trip
- `PUT /api/passengers/:id/payment` - Mark passenger as paid

#### Health
- `GET /health` - Health check endpoint

### Testing

Run the smoke tests to verify API functionality:
```bash
cd api
npm test
```

## Database Schema

### Tables

1. **users**
   - `id` (SERIAL PRIMARY KEY)
   - `email` (TEXT UNIQUE NOT NULL)
   - `full_name` (TEXT)

2. **vehicles**
   - `id` (SERIAL PRIMARY KEY)
   - `owner_id` (INTEGER REFERENCES users(id))
   - `make_model` (TEXT)
   - `mpg` (NUMERIC(4,1))

3. **trips**
   - `id` (SERIAL PRIMARY KEY)
   - `driver_id` (INTEGER REFERENCES users(id))
   - `vehicle_id` (INTEGER REFERENCES vehicles(id))
   - `distance_miles` (NUMERIC(6,2))
   - `fuel_price_per_gallon` (NUMERIC(4,2))

4. **trip_passengers**
   - `id` (SERIAL PRIMARY KEY)
   - `trip_id` (INTEGER REFERENCES trips(id))
   - `passenger_email` (TEXT)
   - `amount_owed` (NUMERIC(6,2))
   - `paid` (BOOLEAN DEFAULT FALSE)

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **Input Validation**: All API inputs are validated using Joi schemas
- **CORS Protection**: Cross-origin requests are properly configured
- **Security Headers**: Helmet.js provides additional security headers

## Development

### Running Both Servers

For development, you'll need both servers running:

1. **Terminal 1 - API Server**
   ```bash
   cd api
   npm run dev
   ```

2. **Terminal 2 - Frontend Server**
   ```bash
   cd client
   npm start
   ```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `SUPABASE_URL` | Your Supabase project URL | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key for admin access | Yes |
| `SUPABASE_ANON_KEY` | Anonymous key for client access | Yes |
| `PORT` | Server port (default: 3000) | No |
| `NODE_ENV` | Environment (development/production) | No |

## Acceptance Criteria

### Step 1 - Database ✅
- [x] Supabase project created
- [x] Service role and anon keys stored in .env
- [x] Schema, seed, and policy scripts created
- [x] Scripts can be run on clean project

### Step 2 - Frontend ✅
- [x] Pages map to site map (Dashboard, Trips, Vehicles, Profile)
- [x] Basic functionality implemented on each page
- [x] Navigation works between pages
- [x] Forms have client-side validation
- [x] Clear titles on every page
- [x] Mock data for initial development

### Step 3 - Backend API ✅
- [x] Local API server on http://localhost:3000
- [x] Connected to Supabase using service role key
- [x] Core endpoints implemented (3+ reads, 1+ write)
- [x] OpenAPI 3.0 documentation (openapi.yaml)
- [x] README with run instructions
- [x] Smoke tests for endpoint validation
- [x] Client wired to API (not direct Supabase calls)

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure the API server is running on port 3000
2. **Database Connection**: Verify your Supabase credentials in .env
3. **Port Conflicts**: Change PORT in .env if 3000 is in use
4. **Missing Data**: Run the seed script to populate test data

### Debug Mode

Enable debug logging by setting:
```
NODE_ENV=development
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
