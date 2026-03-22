# RideSplit Development Rules & Workflow

## Code Style & Naming Conventions

### Variables and Functions
- **Format**: camelCase
- **Examples**: `userName`, `calculateFuelCost`, `tripDistance`
- **Usage**: All variable declarations, function names, and method names

### Components
- **Format**: PascalCase
- **Examples**: `TripDashboard`, `PaymentForm`, `UserProfile`
- **Usage**: React components, class names, and component files

### Constants
- **Format**: UPPER_SNAKE_CASE
- **Examples**: `API_BASE_URL`, `MAX_PASSENGERS`, `DEFAULT_MPG`
- **Usage**: Configuration values and immutable constants

### Files and Directories
- **Format**: kebab-case
- **Examples**: `user-auth.js`, `trip-manager.css`, `payment-service`
- **Usage**: All file names and directory names

## Git Workflow

### Commit Message Format
- **Structure**: `Category: Description`
- **Examples**:
  - `Docs: Added PRD and task definitions`
  - `Feat: Implemented user authentication`
  - `Fix: Resolved payment calculation bug`
  - `Refactor: Optimized database queries`
  - `Test: Added unit tests for split engine`
  - `Chore: Updated dependencies`

### Valid Categories
- **Feat**: New features
- **Fix**: Bug fixes
- **Docs**: Documentation changes
- **Style**: Code formatting (no functional changes)
- **Refactor**: Code restructuring
- **Test**: Adding or updating tests
- **Chore**: Maintenance tasks, dependency updates
- **Perf**: Performance improvements
- **CI**: Continuous integration changes

## Branch Strategy

### Prototype 1 Development
- **Main Branch**: All development work for Prototype 1 happens directly on `main`
- **No Feature Branches**: Simplified workflow for rapid prototyping
- **Direct Commits**: Developers can commit directly to main branch
- **Code Reviews**: Conducted through pull requests from main to main (for discussion)

### Future Considerations (Post-Prototype)
- Feature branches for complex features
- Release branches for production deployments
- Hotfix branches for emergency fixes

## Code Quality Standards

### JavaScript/React Guidelines
- Use ES6+ syntax
- Functional components preferred over class components
- Hooks for state management
- Proper error handling with try-catch blocks
- Meaningful variable and function names

### CSS Guidelines
- BEM methodology for class naming
- Mobile-first responsive design
- CSS custom properties for theming
- Minimize inline styles

### Database Guidelines
- Descriptive table and column names
- Proper indexing for performance
- Foreign key constraints for data integrity
- Migration files for schema changes

## Development Workflow

### Daily Development
1. Pull latest changes from main
2. Create features following naming conventions
3. Test thoroughly before committing
4. Use proper commit message format
5. Push changes to main branch

### Code Review Process
- All significant changes require review
- Focus on functionality, performance, and maintainability
- Documentation updates for new features
- Test coverage verification

### Testing Requirements
- Unit tests for business logic
- Integration tests for API endpoints
- Component tests for UI elements
- Manual testing for user workflows

## File Organization

### Frontend Structure
```
client/
├── src/
│   ├── components/     # Reusable UI components
│   ├── pages/          # Page-level components
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API calls and business logic
│   ├── utils/          # Helper functions
│   └── styles/         # Global styles and themes
```

### Backend Structure
```
api/
├── src/
│   ├── controllers/    # Route handlers
│   ├── models/         # Database models
│   ├── routes/         # API route definitions
│   ├── middleware/     # Express middleware
│   ├── services/       # Business logic
│   └── utils/          # Helper functions
```

## Environment Management

### Required Environment Variables
- `DATABASE_URL`: Supabase connection string
- `SUPABASE_KEY`: Supabase service role key
- `JWT_SECRET`: JSON Web Token secret
- `STRIPE_SECRET_KEY`: Payment processing
- `GOOGLE_MAPS_API_KEY`: Location services

### Environment Files
- `.env.example`: Template with required variables
- `.env.local`: Local development (gitignored)
- `.env.production`: Production environment

## Security Guidelines

### Authentication
- JWT tokens for user sessions
- Secure password hashing (bcrypt)
- Email verification for new accounts
- Session timeout management

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection in React
- HTTPS enforcement in production

### API Security
- Rate limiting on endpoints
- CORS configuration
- API key management
- Request logging and monitoring
