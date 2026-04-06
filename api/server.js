require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { createClient } = require('@supabase/supabase-js');
const Joi = require('joi');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Validation schemas
const createTripSchema = Joi.object({
  driver_email: Joi.string().email().required(),
  vehicle_id: Joi.number().integer().positive().required(),
  distance_miles: Joi.number().positive().required(),
  fuel_price_per_gallon: Joi.number().positive().required()
});

const addPassengerSchema = Joi.object({
  passenger_email: Joi.string().email().required(),
  amount_owed: Joi.number().positive().required()
});

// Routes

// GET /api/users - Get all users
app.get('/api/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/users/:email - Get user by email
app.get('/api/users/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/vehicles - Get all vehicles
app.get('/api/vehicles', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select(`
        *,
        users (email, full_name)
      `);
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/trips - Get all trips with details
app.get('/api/trips', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        vehicles (make_model, mpg),
        users (email, full_name),
        trip_passengers (id, passenger_email, amount_owed, paid)
      `);
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/trips/:id - Get specific trip with details
app.get('/api/trips/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        vehicles (make_model, mpg),
        users (email, full_name),
        trip_passengers (id, passenger_email, amount_owed, paid)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/trips - Create a new trip
app.post('/api/trips', async (req, res) => {
  try {
    const { error: validationError } = createTripSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { driver_email, vehicle_id, distance_miles, fuel_price_per_gallon } = req.body;

    // Get driver ID from email
    const { data: driver, error: driverError } = await supabase
      .from('users')
      .select('id')
      .eq('email', driver_email)
      .single();

    if (driverError || !driver) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    const { data, error } = await supabase
      .from('trips')
      .insert({
        driver_id: driver.id,
        vehicle_id,
        distance_miles,
        fuel_price_per_gallon
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/trips/:id/passengers - Add passenger to trip
app.post('/api/trips/:id/passengers', async (req, res) => {
  try {
    const { id } = req.params;
    const { error: validationError } = addPassengerSchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError.details[0].message });
    }

    const { passenger_email, amount_owed } = req.body;

    const { data, error } = await supabase
      .from('trip_passengers')
      .insert({
        trip_id: parseInt(id),
        passenger_email,
        amount_owed
      })
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/passengers/:id/payment - Mark passenger as paid
app.put('/api/passengers/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Updating payment for passenger ID:', id);

    const { data, error } = await supabase
      .from('trip_passengers')
      .update({ paid: true })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    console.log('Payment updated successfully:', data);
    res.json(data);
  } catch (error) {
    console.error('Payment update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`RideSplit API server running on port ${PORT}`);
});
