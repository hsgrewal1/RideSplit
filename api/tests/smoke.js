#!/usr/bin/env node

const http = require('http');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

// Helper function to make HTTP requests
function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = {
            statusCode: res.statusCode,
            headers: res.headers,
            body: body ? JSON.parse(body) : null
          };
          resolve(response);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

// Test functions
async function testHealth() {
  console.log('Testing GET /health...');
  try {
    const response = await makeRequest('/health');
    if (response.statusCode === 200) {
      console.log('✅ Health check passed');
      return true;
    } else {
      console.log('❌ Health check failed:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Health check error:', error.message);
    return false;
  }
}

async function testGetUsers() {
  console.log('Testing GET /api/users...');
  try {
    const response = await makeRequest('/api/users');
    if (response.statusCode === 200 && Array.isArray(response.body)) {
      console.log('✅ Get users passed');
      return true;
    } else {
      console.log('❌ Get users failed:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Get users error:', error.message);
    return false;
  }
}

async function testGetVehicles() {
  console.log('Testing GET /api/vehicles...');
  try {
    const response = await makeRequest('/api/vehicles');
    if (response.statusCode === 200 && Array.isArray(response.body)) {
      console.log('✅ Get vehicles passed');
      return true;
    } else {
      console.log('❌ Get vehicles failed:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Get vehicles error:', error.message);
    return false;
  }
}

async function testGetTrips() {
  console.log('Testing GET /api/trips...');
  try {
    const response = await makeRequest('/api/trips');
    if (response.statusCode === 200 && Array.isArray(response.body)) {
      console.log('✅ Get trips passed');
      return true;
    } else {
      console.log('❌ Get trips failed:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Get trips error:', error.message);
    return false;
  }
}

async function testCreateTrip() {
  console.log('Testing POST /api/trips...');
  try {
    const tripData = {
      driver_email: 'john.doe@email.com',
      vehicle_id: 1,
      distance_miles: 25.5,
      fuel_price_per_gallon: 3.45
    };
    
    const response = await makeRequest('/api/trips', 'POST', tripData);
    if (response.statusCode === 201 && response.body && response.body.id) {
      console.log('✅ Create trip passed');
      return response.body.id;
    } else {
      console.log('❌ Create trip failed:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Create trip error:', error.message);
    return false;
  }
}

async function testAddPassenger(tripId) {
  console.log('Testing POST /api/trips/:id/passengers...');
  if (!tripId) {
    console.log('❌ Cannot test add passenger - no trip ID');
    return false;
  }
  
  try {
    const passengerData = {
      passenger_email: 'jane.smith@email.com',
      amount_owed: 8.50
    };
    
    const response = await makeRequest(`/api/trips/${tripId}/passengers`, 'POST', passengerData);
    if (response.statusCode === 201 && response.body && response.body.id) {
      console.log('✅ Add passenger passed');
      return true;
    } else {
      console.log('❌ Add passenger failed:', response.statusCode);
      return false;
    }
  } catch (error) {
    console.log('❌ Add passenger error:', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Running RideSplit API smoke tests...\n');
  
  const results = [];
  
  // Run tests
  results.push(await testHealth());
  results.push(await testGetUsers());
  results.push(await testGetVehicles());
  results.push(await testGetTrips());
  
  const tripId = await testCreateTrip();
  results.push(tripId !== false);
  
  results.push(await testAddPassenger(tripId));
  
  // Summary
  const passed = results.filter(r => r === true).length;
  const total = results.length;
  
  console.log('\n📊 Test Results:');
  console.log(`Passed: ${passed}/${total}`);
  
  if (passed === total) {
    console.log('🎉 All tests passed!');
    process.exit(0);
  } else {
    console.log('❌ Some tests failed');
    process.exit(1);
  }
}

// Wait a bit for server to start, then run tests
setTimeout(() => {
  runTests().catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}, 2000);
