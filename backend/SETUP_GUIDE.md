# 🚀 LEHAR Backend Setup Guide

Complete step-by-step guide to set up the LEHAR backend with database integration.

## 📋 Prerequisites

Before starting, ensure you have the following installed:

### Required Software
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Redis** (v6 or higher) - [Download](https://redis.io/download)
- **Git** - [Download](https://git-scm.com/)

### Optional (Recommended)
- **pgAdmin** - PostgreSQL GUI tool
- **RedisInsight** - Redis GUI tool
- **Postman** - API testing tool

## 🗄️ Step 1: Database Setup

### 1.1 Install PostgreSQL
```bash
# Windows (using Chocolatey)
choco install postgresql

# macOS (using Homebrew)
brew install postgresql

# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib
```

### 1.2 Start PostgreSQL Service
```bash
# Windows
net start postgresql-x64-14

# macOS
brew services start postgresql

# Linux
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 1.3 Create Database and User
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE lehar_db;

# Create user (optional)
CREATE USER lehar_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE lehar_db TO lehar_user;

# Exit psql
\q
```

## 🔴 Step 2: Redis Setup

### 2.1 Install Redis
```bash
# Windows (using Chocolatey)
choco install redis-64

# macOS (using Homebrew)
brew install redis

# Ubuntu/Debian
sudo apt install redis-server
```

### 2.2 Start Redis Service
```bash
# Windows
redis-server

# macOS
brew services start redis

# Linux
sudo systemctl start redis
sudo systemctl enable redis
```

### 2.3 Test Redis Connection
```bash
redis-cli ping
# Should return: PONG
```

## 📦 Step 3: Backend Installation

### 3.1 Navigate to Backend Directory
```bash
cd backend
```

### 3.2 Install Dependencies
```bash
npm install
```

### 3.3 Environment Configuration
```bash
# Copy environment template
cp env.example .env

# Edit .env file with your settings
```

**Edit the `.env` file with your configuration:**
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=lehar_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT Configuration (Generate secure keys)
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_random
JWT_REFRESH_SECRET=your_super_secret_refresh_key_here_make_it_long_and_random
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Email Configuration (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# File Upload Configuration
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/gif,video/mp4,video/avi

# External APIs (Optional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# CORS Configuration
FRONTEND_URL=http://localhost:3000
```

## 🗃️ Step 4: Database Migration

### 4.1 Run Database Migrations
```bash
npm run migrate
```

This will:
- Create all database tables
- Set up indexes for performance
- Create initial admin user (`admin@lehar.gov.in` / `admin123`)
- Create demo citizen user (`citizen@demo.com` / `citizen123`)

### 4.2 Verify Database Setup
```bash
# Connect to database
psql -U postgres -d lehar_db

# Check tables
\dt

# Check users
SELECT email, name, role FROM users;

# Exit
\q
```

## 🚀 Step 5: Start the Server

### 5.1 Development Mode
```bash
npm run dev
```

### 5.2 Production Mode
```bash
npm start
```

### 5.3 Verify Server is Running
```bash
# Test health endpoint
curl http://localhost:5000/health

# Expected response:
{
  "success": true,
  "message": "LEHAR Backend is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "environment": "development"
}
```

## 🧪 Step 6: Test API Endpoints

### 6.1 Test User Registration
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "TestPass123!",
    "role": "citizen"
  }'
```

### 6.2 Test User Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@lehar.gov.in",
    "password": "admin123"
  }'
```

### 6.3 Test Report Creation
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "type": "high-waves",
    "title": "High waves observed at Marina Beach",
    "description": "Waves are unusually high today, reaching up to 3 meters",
    "location": {
      "lat": 13.0827,
      "lng": 80.2707,
      "address": "Marina Beach, Chennai, Tamil Nadu"
    },
    "severity": "medium"
  }'
```

## 🔧 Step 7: Frontend Integration

### 7.1 Update Frontend API Base URL
In your frontend project, update the API base URL:

```javascript
// src/config/api.js
const API_BASE_URL = 'http://localhost:5000/api';

export default API_BASE_URL;
```

### 7.2 Update Authentication Context
```javascript
// src/contexts/AuthContext.tsx
const API_BASE_URL = 'http://localhost:5000/api';

// Update login function
const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  if (data.success) {
    localStorage.setItem('accessToken', data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.tokens.refreshToken);
    setUser(data.user);
  }
  return data;
};
```

### 7.3 Update Report Submission
```javascript
// src/components/Reports/ReportSubmissionModal.tsx
const handleSubmit = async (reportData) => {
  const token = localStorage.getItem('accessToken');
  
  const response = await fetch(`${API_BASE_URL}/reports`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(reportData)
  });
  
  const result = await response.json();
  return result;
};
```

## 🔍 Step 8: Monitoring and Debugging

### 8.1 Check Logs
```bash
# Server logs will show in terminal
# Look for:
# ✅ Connected to PostgreSQL database
# ✅ Connected to Redis
# 🚀 LEHAR Backend Server running on port 5000
```

### 8.2 Database Monitoring
```bash
# Connect to database
psql -U postgres -d lehar_db

# Check recent reports
SELECT id, title, type, severity, created_at 
FROM hazard_reports 
ORDER BY created_at DESC 
LIMIT 10;

# Check user activity
SELECT email, role, created_at 
FROM users 
ORDER BY created_at DESC;
```

### 8.3 Redis Monitoring
```bash
# Connect to Redis
redis-cli

# Check keys
KEYS *

# Check token blacklist
KEYS blacklist:*

# Monitor commands
MONITOR
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Database Connection Error
```
❌ Database connection error: connect ECONNREFUSED 127.0.0.1:5432
```
**Solution:**
- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database exists

#### 2. Redis Connection Error
```
❌ Redis connection error: connect ECONNREFUSED 127.0.0.1:6379
```
**Solution:**
- Ensure Redis is running
- Check Redis configuration
- Verify Redis port

#### 3. JWT Secret Error
```
❌ JWT_SECRET is not defined
```
**Solution:**
- Set JWT_SECRET in `.env` file
- Use a long, random string
- Restart the server

#### 4. Email Service Error
```
❌ Email sending failed
```
**Solution:**
- Check email credentials
- Enable "Less secure app access" for Gmail
- Use App Password for Gmail

### Performance Optimization

#### 1. Database Indexing
```sql
-- Check existing indexes
SELECT indexname, tablename FROM pg_indexes WHERE tablename = 'hazard_reports';

-- Add custom indexes if needed
CREATE INDEX idx_hazard_reports_location_gin ON hazard_reports USING GIN (location);
```

#### 2. Redis Memory Optimization
```bash
# Check Redis memory usage
redis-cli INFO memory

# Set memory policy
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

## 📊 Production Deployment

### 1. Environment Setup
```bash
# Set production environment
export NODE_ENV=production

# Use production database
# Update .env with production credentials
```

### 2. Process Management
```bash
# Install PM2
npm install -g pm2

# Start with PM2
pm2 start src/server.js --name lehar-backend

# Monitor
pm2 monit
```

### 3. Reverse Proxy (Nginx)
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## ✅ Verification Checklist

- [ ] PostgreSQL installed and running
- [ ] Redis installed and running
- [ ] Database created (`lehar_db`)
- [ ] Environment variables configured
- [ ] Dependencies installed (`npm install`)
- [ ] Database migrations run (`npm run migrate`)
- [ ] Server starts without errors (`npm run dev`)
- [ ] Health endpoint responds (`/health`)
- [ ] Authentication endpoints work
- [ ] Report endpoints work
- [ ] Frontend can connect to backend

## 🎉 Success!

If all steps are completed successfully, you should see:
```
✅ Connected to PostgreSQL database
✅ Connected to Redis
🚀 LEHAR Backend Server running on port 5000
📊 Environment: development
🌐 CORS enabled for: http://localhost:3000
```

Your LEHAR backend is now ready for integration with the frontend!
