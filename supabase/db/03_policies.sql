-- Row Level Security (RLS) Policies for RideSplit

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE trip_passengers ENABLE ROW LEVEL SECURITY;

-- Users table policies
-- Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.email() = email);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.email() = email);

-- Service role can do everything
CREATE POLICY "Service role full access to users" ON users
    FOR ALL USING (auth.role() = 'service_role');

-- Vehicles table policies
-- Users can view vehicles they own
CREATE POLICY "Users can view own vehicles" ON vehicles
    FOR SELECT USING (owner_id IN (
        SELECT id FROM users WHERE email = auth.email()
    ));

-- Users can insert their own vehicles
CREATE POLICY "Users can insert own vehicles" ON vehicles
    FOR INSERT WITH CHECK (owner_id IN (
        SELECT id FROM users WHERE email = auth.email()
    ));

-- Users can update their own vehicles
CREATE POLICY "Users can update own vehicles" ON vehicles
    FOR UPDATE USING (owner_id IN (
        SELECT id FROM users WHERE email = auth.email()
    ));

-- Service role full access
CREATE POLICY "Service role full access to vehicles" ON vehicles
    FOR ALL USING (auth.role() = 'service_role');

-- Trips table policies
-- Users can view trips they drive or are passengers in
CREATE POLICY "Users can view own trips" ON trips
    FOR SELECT USING (
        driver_id IN (SELECT id FROM users WHERE email = auth.email())
        OR id IN (SELECT trip_id FROM trip_passengers WHERE passenger_email = auth.email())
    );

-- Users can create trips as drivers
CREATE POLICY "Users can create trips as driver" ON trips
    FOR INSERT WITH CHECK (
        driver_id IN (SELECT id FROM users WHERE email = auth.email())
    );

-- Service role full access
CREATE POLICY "Service role full access to trips" ON trips
    FOR ALL USING (auth.role() = 'service_role');

-- Trip passengers table policies
-- Users can view passenger records for their trips
CREATE POLICY "Users can view trip passenger records" ON trip_passengers
    FOR SELECT USING (
        passenger_email = auth.email()
        OR trip_id IN (SELECT id FROM trips WHERE driver_id IN (
            SELECT id FROM users WHERE email = auth.email()
        ))
    );

-- Users can insert passenger records for trips they're passengers in
CREATE POLICY "Users can insert passenger records" ON trip_passengers
    FOR INSERT WITH CHECK (passenger_email = auth.email());

-- Users can update their own payment status
CREATE POLICY "Users can update own payment status" ON trip_passengers
    FOR UPDATE USING (passenger_email = auth.email());

-- Service role full access
CREATE POLICY "Service role full access to trip_passengers" ON trip_passengers
    FOR ALL USING (auth.role() = 'service_role');
