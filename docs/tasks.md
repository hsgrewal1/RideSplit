# RideSplit Development Tasks

## User Management (Stories #1-3)

### Task 1: User Account Creation
**Description**: Implement user registration system with email verification
**User Story**: As a new user, I want to create an account using my email so that I can start using RideSplit.

**Acceptance Criteria**:
- User can register with email and password
- Email validation format is enforced
- Password strength requirements are met (minimum 8 characters, 1 uppercase, 1 number)
- Email verification link is sent upon registration
- Account is activated only after email verification
- Duplicate email addresses are rejected
- Success/error messages are clearly displayed

### Task 2: User Login System
**Description**: Implement secure authentication with credential validation
**User Story**: As a user, I want to log in using my credentials so that I can access my trips and payments.

**Acceptance Criteria**:
- User can login with verified email and password
- Invalid credentials show appropriate error message
- Session management is implemented (JWT tokens)
- "Remember me" option keeps user logged in
- Password reset functionality is available
- Account lockout after multiple failed attempts (5 attempts)
- Login redirects to user dashboard

### Task 3: Profile Management
**Description**: Create user profile editing functionality
**User Story**: As a user, I want to edit my profile information so that my account details remain accurate.

**Acceptance Criteria**:
- User can update name, email, and phone number
- Profile picture upload is supported
- Vehicle information can be added (make, model, year, MPG)
- Email changes require verification
- All changes are saved to database
- Profile validation ensures required fields
- Changes are reflected immediately in UI

## Trip Actions (Stories #5, 7, 8)

### Task 4: Trip Initiation
**Description**: Implement trip start functionality with GPS tracking
**User Story**: As a driver, I want to start a trip so that the app can begin tracking distance and fuel usage.

**Acceptance Criteria**:
- Driver can start a new trip from dashboard
- GPS location tracking begins automatically
- Trip start time and location are recorded
- Current trip status is displayed in real-time
- Trip can only be started by verified drivers
- Active trip indicator is shown in UI
- Trip data is saved to database immediately

### Task 5: Passenger Management
**Description**: Add passengers to active trips
**User Story**: As a driver, I want to add passengers to a trip so that fuel costs can be divided among everyone riding.

**Acceptance Criteria**:
- Driver can search and add passengers by email/username
- Passenger list is displayed for current trip
- Passengers receive notification when added to trip
- Driver can remove passengers before trip ends
- Maximum passenger limit is enforced (based on vehicle capacity)
- Passenger count is updated in real-time
- Duplicate passengers cannot be added

### Task 6: Trip Completion
**Description**: Implement manual trip ending with final data capture
**User Story**: As a driver, I want to be able to end a trip manually so the app knows when I have dropped off all passengers and should stop tracking my mileage.

**Acceptance Criteria**:
- Driver can end active trip with confirmation
- Final distance and duration are calculated
- GPS tracking stops immediately
- Trip summary is displayed to driver
- Trip data is finalized and saved
- Passengers are notified of trip completion
- Trip status changes from "active" to "completed"

## The Split Engine (Stories #9, 10)

### Task 7: Fuel Cost Calculation
**Description**: Implement automatic fuel cost calculation algorithm
**User Story**: As a driver, I want the system to automatically calculate each passenger's share of fuel costs so that the split is fair without manual calculations.

**Acceptance Criteria**:
- Total fuel cost is calculated automatically
- Cost is divided equally among all passengers
- Driver share is excluded from passenger calculations
- Calculation results are displayed with breakdown
- Rounding is handled appropriately (2 decimal places)
- Calculation formula is transparent to users
- Historical gas prices are used for accuracy

### Task 8: MPG-Based Cost Engine
**Description**: Integrate vehicle MPG and distance for precise fuel calculations
**User Story**: As a driver, I want the system to use estimated fuel prices and my vehicles combined MPG to calculate fuel costs.

**Acceptance Criteria**:
- **Formula Implementation**: `Total Fuel Cost = (Distance Miles / Vehicle MPG) × Gas Price per Gallon`
- Vehicle MPG is pulled from user profile
- Current gas prices are fetched from external API
- Distance is calculated from GPS tracking data
- Cost per passenger is: `Total Fuel Cost ÷ Number of Passengers`
- MPG can be overridden for specific trips
- Gas price source is clearly displayed to users

## Payments/Notifications (Stories #11, 12, 16)

### Task 9: Payment Request System
**Description**: Create payment request functionality for drivers
**User Story**: As a driver, I want to send payment requests to passengers after a trip so that I can be reimbursed for fuel expenses.

**Acceptance Criteria**:
- Driver can send payment requests to all passengers
- Individual payment requests can be sent to specific passengers
- Payment requests include trip details and amount owed
- Request status tracking (pending, paid, overdue)
- Payment reminders can be scheduled automatically
- Request history is maintained
- Failed payment notifications are sent to driver

### Task 10: In-App Payment Processing
**Description**: Implement secure payment processing for passengers
**User Story**: As a passenger, I want to pay the driver through the app or through a payment link so that sending payment is simple and fast.

**Acceptance Criteria**:
- Passengers can pay via saved payment methods
- Payment links can be shared via email/SMS
- Credit/debit card processing is secure (PCI compliant)
- Payment confirmation is received immediately
- Receipt generation is automatic
- Payment status updates in real-time
- Refund functionality is available for disputes

### Task 11: Payment Reminder System
**Description**: Automated reminder system for unpaid balances
**User Story**: As a driver, I want to send reminders to passengers who have not paid so that unpaid balances are resolved.

**Acceptance Criteria**:
- Automatic reminders are sent at 24h, 48h, and 72h intervals
- Custom reminder messages can be created
- Reminder frequency can be adjusted by driver
- Unpaid trip dashboard shows all outstanding balances
- Bulk reminder sending is available
- Reminder history is tracked
- Escalation notifications for severely overdue payments

## Additional Core Tasks

### Task 12: Payment Method Management
**Description**: Add and manage payment methods
**User Story**: As a user, I want to add a payment method so that I can pay for trips easily.

**Acceptance Criteria**:
- Credit/debit cards can be added securely
- Payment methods are stored using tokenization
- Default payment method can be set
- Expired cards are automatically flagged
- Payment methods can be removed
- Card verification is required upon addition
- Multiple payment methods per user are supported

### Task 13: Trip History Dashboard
**Description**: Display comprehensive trip and payment history
**User Story**: As a user, I want to view my trip and payment history so that I can track past shared travel expenses.

**Acceptance Criteria**:
- Trip history is displayed in chronological order
- Filter options available (date range, driver/passenger role)
- Payment status is clearly shown for each trip
- Export functionality for records (CSV/PDF)
- Total expenses summary is calculated
- Individual trip details can be viewed
- Search functionality for specific trips

### Task 14: Trip Completion Notifications
**Description**: Notify passengers when trips end
**User Story**: As a passenger, I want to be notified when my trip ends after being dropped off so I know I'm not being charged for gas that I am not responsible for.

**Acceptance Criteria**:
- Push notifications are sent when trip ends
- Notification includes trip summary and amount owed
- Email notifications are sent as backup
- Notification preferences can be customized
- Real-time status updates during trip
- Drop-off confirmation is recorded
- Notification history is maintained
