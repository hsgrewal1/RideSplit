// ── Supabase Auth Client ───────────────────────────────────
const { createClient } = supabase;
const supabaseClient = createClient(
    'https://lbhlyptmbnjmrrycpzce.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxiaGx5cHRtYm5qbXJyeWNwemNlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0MTM1ODIsImV4cCI6MjA5MDk4OTU4Mn0.SSlcKLiRMM_3uuCDjcXt5Ey2xPkyty0XcGVMP0hTi3w'
);

// ── API Config ─────────────────────────────────────────────
const API_BASE_URL = 'https://ridesplit.onrender.com';

// Current user — set after login
let currentUser = null;

// ── On page load ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async function () {
    // Check if user is already logged in
    const { data: { session } } = await supabaseClient.auth.getSession();
    if (session) {
        await initApp(session.user);
    }

    // Listen for auth state changes
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
            await initApp(session.user);
        } else if (event === 'SIGNED_OUT') {
            showAuthScreen();
        }
    });

    // Profile form submit
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        profileForm.addEventListener('submit', function (e) {
            e.preventDefault();
            updateProfile();
        });
    }

    // Nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const pageId = this.getAttribute('href').substring(1);
            showPage(pageId);
        });
    });
});

// ── Init app after login ───────────────────────────────────
async function initApp(authUser) {
    // Set currentUser from auth
    currentUser = {
        email: authUser.email,
        full_name: authUser.user_metadata?.full_name || authUser.email
    };

    // Ensure user exists in our users table
    await ensureUserInDb(currentUser.email, currentUser.full_name);

    // Show app, hide auth
    document.getElementById('auth-screen').style.display = 'none';
    document.getElementById('app').style.display = 'flex';

    showPage('dashboard');
}

// ── Ensure user row exists in DB ───────────────────────────
async function ensureUserInDb(email, fullName) {
    try {
        await apiCall('/api/users/ensure', 'POST', { email, full_name: fullName });
    } catch (err) {
        // User might already exist — that's fine
        console.log('User ensure:', err.message);
    }
}

// ── Show auth screen ───────────────────────────────────────
function showAuthScreen() {
    currentUser = null;
    document.getElementById('auth-screen').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
}

// ── Auth Tab Switch ────────────────────────────────────────
function switchAuthTab(tab) {
    document.getElementById('login-form').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('signup-form').style.display = tab === 'signup' ? 'block' : 'none';
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-tab')[tab === 'login' ? 0 : 1].classList.add('active');
    document.getElementById('login-error').textContent = '';
    document.getElementById('signup-error').textContent = '';
    document.getElementById('signup-success').textContent = '';
}

// ── Login ──────────────────────────────────────────────────
async function handleLogin() {
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value;
    const errorEl = document.getElementById('login-error');
    errorEl.textContent = '';

    if (!email || !password) {
        errorEl.textContent = 'Please enter your email and password.';
        return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
        errorEl.textContent = error.message;
    }
}

// ── Signup ─────────────────────────────────────────────────
async function handleSignup() {
    const fullName = document.getElementById('signup-name').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value;
    const errorEl = document.getElementById('signup-error');
    const successEl = document.getElementById('signup-success');
    errorEl.textContent = '';
    successEl.textContent = '';

    if (!fullName || !email || !password) {
        errorEl.textContent = 'Please fill in all fields.';
        return;
    }

    if (password.length < 6) {
        errorEl.textContent = 'Password must be at least 6 characters.';
        return;
    }

    const { error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } }
    });

    if (error) {
        errorEl.textContent = error.message;
    } else {
        successEl.textContent = 'Account created! Check your email to confirm, then log in.';
    }
}

// ── Logout ─────────────────────────────────────────────────
async function handleLogout() {
    await supabaseClient.auth.signOut();
}

// ── Navigation ─────────────────────────────────────────────
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + pageId) link.classList.add('active');
    });

    switch (pageId) {
        case 'dashboard': loadDashboard(); break;
        case 'trips':     loadTrips();     break;
        case 'vehicles':  loadVehicles();  break;
        case 'profile':   loadProfile();   break;
    }
}

// ── Collapsible sections ───────────────────────────────────
function toggleSection(bodyId, headerEl) {
    const body = document.getElementById(bodyId);
    const arrow = headerEl.querySelector('.section-toggle-arrow');
    const isCollapsed = body.classList.contains('collapsed');
    body.classList.toggle('collapsed', !isCollapsed);
    if (arrow) arrow.classList.toggle('open', isCollapsed);
}

// ── Trip card toggle ───────────────────────────────────────
function toggleTrip(tripId) {
    const details = document.getElementById(`trip-details-${tripId}`);
    const arrow = document.getElementById(`arrow-${tripId}`);
    const isHidden = details.style.display === 'none';
    details.style.display = isHidden ? 'block' : 'none';
    arrow.textContent = isHidden ? '▲' : '▼';
}

// ── API Helper ─────────────────────────────────────────────
async function apiCall(endpoint, method = 'GET', data = null) {
    try {
        const options = {
            method,
            headers: { 'Content-Type': 'application/json' }
        };
        if (data) options.body = JSON.stringify(data);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API call failed:', error);
        throw error;
    }
}

// ── Dashboard ──────────────────────────────────────────────
async function loadDashboard() {
    try {
        const trips = await apiCall('/api/trips');
        const myTrips = trips.filter(trip => trip.users.email === currentUser.email);

        const myTripsContainer = document.getElementById('my-trips');
        myTripsContainer.innerHTML = myTrips.length === 0
            ? '<p class="empty-state">No trips yet</p>'
            : myTrips.slice(0, 3).map(trip => `
                <div class="trip-item">
                    <strong>${trip.vehicles.make_model}</strong> — ${trip.distance_miles} miles
                    <br><small>${new Date(trip.created_at || Date.now()).toLocaleDateString()}</small>
                </div>
            `).join('');

        document.getElementById('recent-activity').innerHTML = myTrips.length === 0
            ? '<p style="color:var(--muted);font-size:14px;">No recent activity</p>'
            : myTrips.slice(0, 5).map(trip => `
                <div class="trip-item">
                    <span style="color:var(--purple);">🚗</span>
                    Trip in <strong>${trip.vehicles.make_model}</strong> — ${trip.distance_miles} mi
                    <br><small>${new Date(trip.created_at || Date.now()).toLocaleDateString()}</small>
                </div>
            `).join('');
    } catch (error) {
        console.error('Failed to load dashboard:', error);
    }
}

// ── Trips ──────────────────────────────────────────────────
async function loadTrips() {
    const tripsContainer = document.getElementById('trips-list');
    tripsContainer.innerHTML = '<div class="loading">Loading trips...</div>';

    try {
        const trips = await apiCall('/api/trips');

        if (trips.length === 0) {
            tripsContainer.innerHTML = '<div class="empty-state">No trips found</div>';
            return;
        }

        tripsContainer.innerHTML = trips.map(trip => `
            <div class="trip-card">
                <div class="trip-header" onclick="toggleTrip(${trip.id})">
                    <h3>${trip.vehicles.make_model}</h3>
                    <span id="arrow-${trip.id}" style="color:var(--muted);font-size:14px;">▼</span>
                </div>
                <div id="trip-details-${trip.id}" style="display:none;margin-top:14px;">
                    <div class="trip-info">
                        <p><strong>Driver:</strong> ${trip.users.full_name} (${trip.users.email})</p>
                        <p><strong>Distance:</strong> ${trip.distance_miles} miles</p>
                        <p><strong>Fuel Price:</strong> $${trip.fuel_price_per_gallon}/gallon</p>
                        <p><strong>MPG:</strong> ${trip.vehicles.mpg}</p>
                    </div>
                    ${trip.trip_passengers && trip.trip_passengers.length > 0 ? `
                        <div class="passengers-list">
                            <h4>Passengers</h4>
                            ${trip.trip_passengers.map(p => `
                                <div class="passenger-item">
                                    <span>${p.passenger_email}</span>
                                    <div style="display:flex;align-items:center;gap:8px;">
                                        <span>$${p.amount_owed}</span>
                                        ${p.paid
                                            ? `<span class="payment-status paid">Paid</span>`
                                            : `<button class="btn btn-sm btn-secondary" onclick="markAsPaid(${p.id})">Mark Paid</button>`
                                        }
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : '<p style="color:var(--muted);font-size:13px;margin-top:10px;">No passengers yet</p>'}
                    <div style="margin-top:14px;">
                        ${trip.users.email === currentUser.email ? `
                            <button class="btn btn-secondary" onclick="showAddPassengerForm(${trip.id})">Add Passenger</button>
                        ` : `
                            <button class="btn btn-primary" onclick="joinTrip(${trip.id})">Join Trip</button>
                        `}
                    </div>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load trips:', error);
        tripsContainer.innerHTML = '<div class="empty-state">Failed to load trips</div>';
    }
}

// ── Vehicles ───────────────────────────────────────────────
async function loadVehicles() {
    const vehiclesContainer = document.getElementById('vehicles-list');
    vehiclesContainer.innerHTML = '<div class="loading">Loading vehicles...</div>';

    try {
        const vehicles = await apiCall('/api/vehicles');
        const myVehicles = vehicles.filter(v => v.users.email === currentUser.email);

        if (myVehicles.length === 0) {
            vehiclesContainer.innerHTML = '<div class="empty-state">No vehicles yet. Add one above!</div>';
            return;
        }

        vehiclesContainer.innerHTML = myVehicles.map(vehicle => `
            <div class="vehicle-card">
                <h3>${vehicle.make_model}</h3>
                <div class="vehicle-info" style="margin-top:8px;">
                    <p><strong>MPG:</strong> ${vehicle.mpg}</p>
                    <p><strong>Owner:</strong> ${vehicle.users.full_name}</p>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Failed to load vehicles:', error);
        vehiclesContainer.innerHTML = '<div class="empty-state">Failed to load vehicles</div>';
    }
}

// ── Profile ────────────────────────────────────────────────
function loadProfile() {
    document.getElementById('email').value = currentUser.email;
    document.getElementById('full-name').value = currentUser.full_name;
}

async function updateProfile() {
    const fullName = document.getElementById('full-name').value;
    currentUser.full_name = fullName;

    await supabaseClient.auth.updateUser({
        data: { full_name: fullName }
    });

    alert('Profile updated!');
}

// ── Modal ──────────────────────────────────────────────────
function showModal(content) {
    document.getElementById('modal-body').innerHTML = content;
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// ── Create Trip ────────────────────────────────────────────
function showCreateTripForm() {
    showModal(`
        <h3>Create New Trip</h3>
        <form id="create-trip-form">
            <div class="form-group">
                <label for="trip-vehicle">Vehicle</label>
                <select id="trip-vehicle" required>
                    <option value="">Select a vehicle</option>
                </select>
            </div>
            <div class="form-group">
                <label for="trip-distance">Distance (miles)</label>
                <input type="number" id="trip-distance" step="0.1" min="0" placeholder="e.g. 25.5" required>
            </div>
            <div class="form-group">
                <label for="trip-fuel-price">Fuel Price ($/gallon)</label>
                <input type="number" id="trip-fuel-price" step="0.01" min="0" placeholder="e.g. 4.29" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px;">Create Trip</button>
        </form>
    `);
    loadVehiclesForSelect();
    document.getElementById('create-trip-form').addEventListener('submit', createTrip);
}

async function loadVehiclesForSelect() {
    try {
        const vehicles = await apiCall('/api/vehicles');
        const myVehicles = vehicles.filter(v => v.users.email === currentUser.email);
        const select = document.getElementById('trip-vehicle');
        myVehicles.forEach(vehicle => {
            const option = document.createElement('option');
            option.value = vehicle.id;
            option.textContent = vehicle.make_model;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Failed to load vehicles for select:', error);
    }
}

async function createTrip(e) {
    e.preventDefault();
    try {
        await apiCall('/api/trips', 'POST', {
            driver_email: currentUser.email,
            vehicle_id: parseInt(document.getElementById('trip-vehicle').value),
            distance_miles: parseFloat(document.getElementById('trip-distance').value),
            fuel_price_per_gallon: parseFloat(document.getElementById('trip-fuel-price').value)
        });
        closeModal();
        loadTrips();
        alert('Trip created successfully!');
    } catch (error) {
        console.error('Failed to create trip:', error);
        alert('Failed to create trip. Please try again.');
    }
}

// ── Add Vehicle ────────────────────────────────────────────
function showAddVehicleForm() {
    showModal(`
        <h3>Add Vehicle</h3>
        <form id="add-vehicle-form">
            <div class="form-group">
                <label for="vehicle-make-model">Make and Model</label>
                <input type="text" id="vehicle-make-model" placeholder="e.g. Toyota Camry" required>
            </div>
            <div class="form-group">
                <label for="vehicle-mpg">MPG</label>
                <input type="number" id="vehicle-mpg" step="0.1" min="1" placeholder="e.g. 32.5" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px;">Add Vehicle</button>
        </form>
    `);
    document.getElementById('add-vehicle-form').addEventListener('submit', addVehicle);
}

async function addVehicle(e) {
    e.preventDefault();
    try {
        await apiCall('/api/vehicles', 'POST', {
            owner_email: currentUser.email,
            make_model: document.getElementById('vehicle-make-model').value.trim(),
            mpg: parseFloat(document.getElementById('vehicle-mpg').value)
        });
        closeModal();
        loadVehicles();
        alert('Vehicle added successfully!');
    } catch (error) {
        console.error('Failed to add vehicle:', error);
        alert('Failed to add vehicle. Please try again.');
    }
}

// ── Add Passenger ──────────────────────────────────────────
function showAddPassengerForm(tripId) {
    showModal(`
        <h3>Add Passenger</h3>
        <form id="add-passenger-form">
            <div class="form-group">
                <label for="passenger-email">Passenger Email</label>
                <input type="email" id="passenger-email" placeholder="passenger@email.com" required>
            </div>
            <div class="form-group">
                <label for="passenger-amount">Amount Owed ($)</label>
                <input type="number" id="passenger-amount" step="0.01" min="0" placeholder="e.g. 12.50" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%;margin-top:8px;">Add Passenger</button>
        </form>
    `);
    document.getElementById('add-passenger-form').addEventListener('submit', (e) => addPassenger(e, tripId));
}

async function addPassenger(e, tripId) {
    e.preventDefault();
    try {
        await apiCall(`/api/trips/${tripId}/passengers`, 'POST', {
            passenger_email: document.getElementById('passenger-email').value,
            amount_owed: parseFloat(document.getElementById('passenger-amount').value)
        });
        closeModal();
        loadTrips();
        alert('Passenger added successfully!');
    } catch (error) {
        console.error('Failed to add passenger:', error);
        alert('Failed to add passenger. Please try again.');
    }
}

// ── Misc ───────────────────────────────────────────────────
function joinTrip(tripId) {
    alert('Trip join functionality would be implemented here');
}

async function markAsPaid(passengerId) {
    try {
        await apiCall(`/api/passengers/${passengerId}/payment`, 'PUT');
        loadTrips();
        alert('Payment marked as paid!');
    } catch (error) {
        console.error('Failed to mark as paid:', error);
        alert('Failed to update payment status. Please try again.');
    }
}

window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) closeModal();
};
