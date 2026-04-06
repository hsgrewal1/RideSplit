-- Seed data for RideSplit database

-- Insert users
INSERT INTO users (email, full_name) VALUES 
('john.doe@email.com', 'John Doe'),
('jane.smith@email.com', 'Jane Smith'),
('mike.wilson@email.com', 'Mike Wilson'),
('sarah.jones@email.com', 'Sarah Jones'),
('alex.brown@email.com', 'Alex Brown');

-- Insert vehicles
INSERT INTO vehicles (owner_id, make_model, mpg) VALUES 
(1, 'Toyota Camry 2022', 32.5),
(2, 'Honda Civic 2021', 35.2),
(3, 'Ford F-150 2023', 22.8),
(1, 'Tesla Model 3 2022', 120.0),
(4, 'Nissan Altima 2020', 30.1);

-- Insert trips
INSERT INTO trips (driver_id, vehicle_id, distance_miles, fuel_price_per_gallon) VALUES 
(1, 1, 45.5, 3.45),
(2, 2, 22.3, 3.52),
(3, 3, 68.2, 3.48),
(1, 4, 15.7, 0.12), -- Electric vehicle
(4, 5, 38.9, 3.55);

-- Insert trip passengers
INSERT INTO trip_passengers (trip_id, passenger_email, amount_owed, paid) VALUES 
(1, 'jane.smith@email.com', 7.85, false),
(1, 'mike.wilson@email.com', 7.85, true),
(2, 'sarah.jones@email.com', 4.12, false),
(3, 'john.doe@email.com', 12.45, true),
(3, 'jane.smith@email.com', 12.45, false),
(4, 'alex.brown@email.com', 2.35, true),
(5, 'mike.wilson@email.com', 8.92, false);
