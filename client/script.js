// API Configuration
const API_BASE_URL = 'http://localhost:3000';

// Current user (for demo purposes)
let currentUser = {
    email: 'john.doe@email.com',
    full_name: 'John Doe'
};

// Navigation
function showPage(pageId) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    
    // Show selected page
    document.getElementById(pageId).classList.add('active');
    
    // Load data for the page
    switch(pageId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'trips':
            loadTrips();
            break;
        case 'vehicles':
            loadVehicles();
            break;
        case 'profile':
            loadProfile();
            break;
    }
}

// Event listeners for navigation
document.addEventListener('DOMContentLoaded', function() {
    // Setup navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });
    
    // Setup profile form
    document.getElementById('profile-form').addEventListener('submit', function(e) {
        e.preventDefault();
        updateProfile();
    });
    
    // Show dashboard by default
    showPage('dashboard');
});

// API Helper functions
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// Dashboard functions
async function loadDashboard() {
    try {
        // Load user's trips
        const trips = await apiCall('/api/trips');
        const myTrips = trips.filter(trip => trip.users.email === currentUser.email);
        
        const myTripsContainer = document.getElementById('my-trips');
        if (myTrips.length === 0) {
            myTripsContainer.innerHTML = '<p class="empty-state">No trips yet</p>';
        } else {
            myTripsContainer.innerHTML = myTrips.slice(0, 3).map(trip => `
                <div class="trip-item">
                    <strong>${trip.vehicles.make_model}</strong> - ${trip.distance_miles} miles
                    <br><small>${new Date(trip.created_at || Date.now()).toLocaleDateString()}</small>
                </div>
            `).join('');
        }
        
        // Load recent activity
        const activityContainer = document.getElementById('recent-activity');
        activityContainer.innerHTML = `
            <p>Recent trip created: ${myTrips[0]?.vehicles.make_model || 'No recent activity'}</p>
        `;
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

// Trips functions
async function loadTrips() {
    try {
        const tripsContainer = document.getElementById('trips-list');
        tripsContainer.innerHTML = '<div class="loading">Loading trips...</div>';
        
        const trips = await apiCall('/api/trips');
        
        if (trips.length === 0) {
            tripsContainer.innerHTML = '<div class="empty-state">No trips found</div>';
            return;
        }
        
        tripsContainer.innerHTML = trips.map(trip => `
            <div class="trip-card">
                <h3>${trip.vehicles.make_model}</h3>
                <div class="trip-info">
                    <p><strong>Driver:</strong> ${trip.users.full_name} (${trip.users.email})</p>
                    <p><strong>Distance:</strong> ${trip.distance_miles} miles</p>
                    <p><strong>Fuel Price:</strong> $${trip.fuel_price_per_gallon}/gallon</p>
                    <p><strong>MPG:</strong> ${trip.vehicles.mpg}</p>
                </div>
                ${trip.trip_passengers && trip.trip_passengers.length > 0 ? `
                    <div class="passengers-list">
                        <h4>Passengers:</h4>
                        ${trip.trip_passengers.map(passenger => `
                            <div class="passenger-item">
                                <span>${passenger.passenger_email}</span>
                                <div>
                                    <span>$${passenger.amount_owed}</span>
                                    ${passenger.paid ? 
                                        `<span class="payment-status paid">Paid</span>` :
                                        `<button class="btn btn-sm" onclick="markAsPaid(${passenger.id})">Mark Paid</button>`
                                    }
                                </div>
                            </div>
                        `).join('')}
                    </div>
                ` : '<p>No passengers yet</p>'}
                ${trip.users.email === currentUser.email ? `
                    <button class="btn btn-secondary" onclick="showAddPassengerForm(${trip.id})">
                        Add Passenger
                    </button>
                ` : `
                    <button class="btn btn-primary" onclick="joinTrip(${trip.id})">
                        Join Trip
                    </button>
                `}
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load trips:', error);
        document.getElementById('trips-list').innerHTML = 
            '<div class="empty-state">Failed to load trips</div>';
    }
}

// Vehicles functions
async function loadVehicles() {
    try {
        const vehiclesContainer = document.getElementById('vehicles-list');
        vehiclesContainer.innerHTML = '<div class="loading">Loading vehicles...</div>';
        
        const vehicles = await apiCall('/api/vehicles');
        const myVehicles = vehicles.filter(vehicle => vehicle.users.email === currentUser.email);
        
        if (myVehicles.length === 0) {
            vehiclesContainer.innerHTML = '<div class="empty-state">No vehicles found</div>';
            return;
        }
        
        vehiclesContainer.innerHTML = myVehicles.map(vehicle => `
            <div class="vehicle-card">
                <h3>${vehicle.make_model}</h3>
                <div class="vehicle-info">
                    <p><strong>MPG:</strong> ${vehicle.mpg}</p>
                    <p><strong>Owner:</strong> ${vehicle.users.full_name}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load vehicles:', error);
        document.getElementById('vehicles-list').innerHTML = 
            '<div class="empty-state">Failed to load vehicles</div>';
    }
}

// Profile functions
function loadProfile() {
    document.getElementById('email').value = currentUser.email;
    document.getElementById('full-name').value = currentUser.full_name;
}

async function updateProfile() {
    const email = document.getElementById('email').value;
    const fullName = document.getElementById('full-name').value;
    
    // For demo purposes, just update local data
    currentUser = {
        email: email,
        full_name: fullName
    };
    
    alert('Profile updated successfully!');
}

// Modal functions
function showModal(content) {
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Form functions
function showCreateTripForm() {
    const formContent = `
        <h3>Create New Trip</h3>
        <form id="create-trip-form">
            <div class="form-group">
                <label for="trip-vehicle">Vehicle:</label>
                <select id="trip-vehicle" required>
                    <option value="">Select a vehicle</option>
                </select>
            </div>
            <div class="form-group">
                <label for="trip-distance">Distance (miles):</label>
                <input type="number" id="trip-distance" step="0.1" min="0" required>
            </div>
            <div class="form-group">
                <label for="trip-fuel-price">Fuel Price ($/gallon):</label>
                <input type="number" id="trip-fuel-price" step="0.01" min="0" required>
            </div>
            <button type="submit" class="btn btn-primary">Create Trip</button>
        </form>
    `;
    
    showModal(formContent);
    
    // Load vehicles for the select
    loadVehiclesForSelect();
    
    // Setup form submission
    document.getElementById('create-trip-form').addEventListener('submit', createTrip);
}

async function loadVehiclesForSelect() {
    try {
        const vehicles = await apiCall('/api/vehicles');
        const myVehicles = vehicles.filter(vehicle => vehicle.users.email === currentUser.email);
        
        const select = document.getElementById('trip-vehicle');
        myVehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = vehicle.make_model;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load vehicles:', error);
    }
}

async function createTrip(e) {
    e.preventDefault();
    
    const vehicleId = document.getElementById('trip-vehicle').value;
    const distance = document.getElementById('trip-distance').value;
    const fuelPrice = document.getElementById('trip-fuel-price').value;
    
    try {
        await apiCall('/api/trips', 'POST', {
            driver_email: currentUser.email,
            vehicle_id: parseInt(vehicleId),
            distance_miles: parseFloat(distance),
            fuel_price_per_gallon: parseFloat(fuelPrice)
        });
        
        closeModal();
        loadTrips(); // Refresh trips list
        alert('Trip created successfully!');
    } catch (error) {
        console.error('Failed to create trip:', error);
        alert('Failed to create trip. Please try again.');
    }
}

function showAddVehicleForm() {
    const formContent = `
        <h3>Add Vehicle</h3>
        <form id="add-vehicle-form">
            <div class="form-group">
                <label for="vehicle-make-model">Make and Model:</label>
                <input type="text" id="vehicle-make-model" required>
            </div>
            <div class="form-group">
                <label for="vehicle-mpg">MPG:</label>
                <input type="number" id="vehicle-mpg" step="0.1" min="0" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Vehicle</button>
        </form>
    `;
    
    showModal(formContent);
    
    document.getElementById('add-vehicle-form').addEventListener('submit', addVehicle);
}

async function addVehicle(e) {
    e.preventDefault();
    
    const makeModel = document.getElementById('vehicle-make-model').value;
    const mpg = document.getElementById('vehicle-mpg').value;
    
    // For demo purposes, just show success message
    // In a real app, this would call the API
    closeModal();
    loadVehicles(); // Refresh vehicles list
    alert('Vehicle added successfully!');
}

function showAddPassengerForm(tripId) {
    const formContent = `
        <h3>Add Passenger</h3>
        <form id="add-passenger-form">
            <div class="form-group">
                <label for="passenger-email">Passenger Email:</label>
                <input type="email" id="passenger-email" required>
            </div>
            <div class="form-group">
                <label for="passenger-amount">Amount Owed ($):</label>
                <input type="number" id="passenger-amount" step="0.01" min="0" required>
            </div>
            <button type="submit" class="btn btn-primary">Add Passenger</button>
        </form>
    `;
    
    showModal(formContent);
    
    document.getElementById('add-passenger-form').addEventListener('submit', (e) => {
        addPassenger(e, tripId);
    });
}

async function addPassenger(e, tripId) {
    e.preventDefault();
    
    const email = document.getElementById('passenger-email').value;
    const amount = document.getElementById('passenger-amount').value;
    
    try {
        await apiCall(`/api/trips/${tripId}/passengers`, 'POST', {
            passenger_email: email,
            amount_owed: parseFloat(amount)
        });
        
        closeModal();
        loadTrips(); // Refresh trips list
        alert('Passenger added successfully!');
    } catch (error) {
        console.error('Failed to add passenger:', error);
        alert('Failed to add passenger. Please try again.');
    }
}

function joinTrip(tripId) {
    // For demo purposes, just show a message
    alert('Trip join functionality would be implemented here');
}

async function markAsPaid(passengerId) {
    try {
        await apiCall(`/api/passengers/${passengerId}/payment`, 'PUT');
        loadTrips(); // Refresh trips list
        alert('Payment marked as paid!');
    } catch (error) {
        console.error('Failed to mark as paid:', error);
        alert('Failed to update payment status. Please try again.');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
}
