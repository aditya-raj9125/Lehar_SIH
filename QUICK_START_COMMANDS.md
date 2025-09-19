# Quick Start Commands Reference

## Essential Commands for Backend Setup

### 1. Database Setup
```bash
# Create database in pgAdmin
# Database name: coastal_watch_db

# Run migration
cd backend
node src/database/migrate.js
```

### 2. Environment Configuration
```bash
# Copy environment template
copy env.example .env

# Edit .env file with your values:
# - PostgreSQL password
# - JWT secrets (generate random strings)
# - Email credentials (optional)
```

### 3. Start Services
```bash
# Start Redis (if not running as service)
redis-server

# Start Backend
cd backend
npm run dev

# Start Frontend (in another terminal)
cd ../
npm run dev
```

### 4. Test Everything Works
```bash
# Test backend API
curl http://localhost:5000/api/auth/test

# Test database connection
# Check pgAdmin for tables: users, hazard_reports, etc.

# Test frontend
# Open http://localhost:5173
# Try registering a user
# Try submitting a report
```

## Environment Variables Template

```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/coastal_watch_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-make-it-long-and-random
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:5173
```

## Troubleshooting Commands

```bash
# Check if services are running
redis-cli ping          # Should return PONG
pg_ctl status           # Check PostgreSQL status

# Check ports
netstat -an | findstr :5000    # Backend port
netstat -an | findstr :5432    # PostgreSQL port
netstat -an | findstr :6379    # Redis port

# Reset database (if needed)
node src/database/migrate.js
```

## File Structure After Setup
```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── redis.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── reports.js
│   ├── services/
│   │   └── emailService.js
│   ├── database/
│   │   ├── schema.sql
│   │   └── migrate.js
│   └── server.js
├── package.json
├── .env
└── README.md
```
