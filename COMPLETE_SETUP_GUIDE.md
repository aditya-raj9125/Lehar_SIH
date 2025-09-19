# Complete Backend Setup Guide - Step by Step

## Prerequisites Installation

### 1. Install PostgreSQL Database
1. **Download PostgreSQL:**
   - Go to: https://www.postgresql.org/download/windows/
   - Click "Download the installer"
   - Download PostgreSQL 15 or 16 (latest stable version)

2. **Install PostgreSQL:**
   - Run the downloaded `.exe` file
   - Choose installation directory (default is fine)
   - Select components: PostgreSQL Server, pgAdmin 4, Stack Builder
   - Set password for `postgres` user (REMEMBER THIS PASSWORD!)
   - Port: 5432 (default)
   - Locale: Default locale
   - Complete installation

3. **Verify Installation:**
   - Open pgAdmin 4 (should open automatically)
   - Connect to PostgreSQL server using password you set
   - You should see the default `postgres` database

### 2. Install Redis Server

**Option A: Direct Download (Recommended)**
1. Go to: https://github.com/microsoftarchive/redis/releases
2. Download the latest `Redis-x64-*.msi` file
3. Run the installer
4. Redis will automatically start as a Windows service
5. Default port: 6379

**Option B: Using Chocolatey (Alternative)**
1. Open PowerShell as Administrator
2. Run: `Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))`
3. Run: `choco install redis-64`

**Option C: Using Docker (If you have Docker Desktop)**
1. Open Command Prompt or PowerShell
2. Run: `docker run -d -p 6379:6379 --name redis redis:latest`

### 3. Install Node.js (if not already installed)
1. Go to: https://nodejs.org/
2. Download LTS version (18.x or 20.x)
3. Install with default settings
4. Verify: Open Command Prompt and run `node --version`

## Backend Setup Steps

### Step 1: Navigate to Backend Directory
```bash
cd C:\Users\HP\Desktop\Coastal_Watch\backend
```

### Step 2: Create Environment File
1. Copy `env.example` to `.env`:
   ```bash
   copy env.example .env
   ```

2. Edit `.env` file with your actual values:
   ```
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DATABASE_URL=postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/coastal_watch_db
   
   # Redis Configuration
   REDIS_URL=redis://localhost:6379
   
   # JWT Secrets (generate strong random strings)
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here-make-it-long-and-random
   
   # Email Configuration (for notifications)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # Client URL (your frontend URL)
   CLIENT_URL=http://localhost:5173
   ```

### Step 3: Create Database
1. Open pgAdmin 4
2. Right-click on "Databases" → "Create" → "Database"
3. Name: `coastal_watch_db`
4. Click "Save"

### Step 4: Run Database Migration
```bash
node src/database/migrate.js
```

### Step 5: Start Redis Server
If you installed Redis as a service, it should already be running. If not:
```bash
redis-server
```

### Step 6: Install Dependencies (if not done already)
```bash
npm install
```

### Step 7: Start the Backend Server
```bash
npm run dev
```

You should see:
```
Server running on port 5000
Database connected successfully
Redis connected successfully
```

## Frontend Integration Steps

### Step 1: Update Frontend API Configuration
1. Open `src/config/api.ts` (create if doesn't exist)
2. Add:
   ```typescript
   const API_BASE_URL = 'http://localhost:5000/api';
   
   export const api = {
     auth: `${API_BASE_URL}/auth`,
     reports: `${API_BASE_URL}/reports`,
     maps: `${API_BASE_URL}/maps`,
   };
   ```

### Step 2: Update AuthContext to Use Real API
1. Open `src/contexts/AuthContext.tsx`
2. Replace mock authentication with real API calls:
   ```typescript
   const login = async (email: string, password: string) => {
     try {
       const response = await fetch('http://localhost:5000/api/auth/login', {
         method: 'POST',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ email, password }),
       });
       
       if (response.ok) {
         const data = await response.json();
         localStorage.setItem('token', data.accessToken);
         localStorage.setItem('refreshToken', data.refreshToken);
         setUser(data.user);
         return { success: true };
       } else {
         const error = await response.json();
         return { success: false, error: error.message };
       }
     } catch (error) {
       return { success: false, error: 'Network error' };
     }
   };
   ```

### Step 3: Update Report Submission
1. Open `src/components/Reports/ReportSubmissionModal.tsx`
2. Replace localStorage with API call:
   ```typescript
   const handleSubmit = async (reportData: HazardReport) => {
     try {
       const token = localStorage.getItem('token');
       const response = await fetch('http://localhost:5000/api/reports', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`,
         },
         body: JSON.stringify(reportData),
       });
       
       if (response.ok) {
         // Success
         onClose();
         // Refresh reports list
       } else {
         // Handle error
       }
     } catch (error) {
       // Handle network error
     }
   };
   ```

## Testing the Setup

### Step 1: Test Backend API
1. Open browser and go to: `http://localhost:5000/api/auth/test`
2. You should see: `{"message":"Auth API is working"}`

### Step 2: Test Database Connection
1. In pgAdmin, check if tables were created:
   - `users`
   - `hazard_reports`
   - `social_media_trends`
   - `map_hotspots`
   - `refresh_tokens`

### Step 3: Test Frontend-Backend Integration
1. Start frontend: `npm run dev` (in main project directory)
2. Try to register a new user
3. Try to submit a hazard report
4. Check if data appears in database

## Troubleshooting

### Common Issues:

1. **Database Connection Error:**
   - Check PostgreSQL is running
   - Verify password in `.env` file
   - Ensure database `coastal_watch_db` exists

2. **Redis Connection Error:**
   - Check Redis is running: `redis-cli ping`
   - Should return `PONG`

3. **Port Already in Use:**
   - Change PORT in `.env` file
   - Or kill process using port 5000

4. **CORS Errors:**
   - Backend CORS is configured for `http://localhost:5173`
   - Make sure frontend runs on this port

### Useful Commands:

```bash
# Check if PostgreSQL is running
pg_ctl status

# Check if Redis is running
redis-cli ping

# View backend logs
npm run dev

# Reset database (if needed)
node src/database/migrate.js
```

## Next Steps After Setup

1. **File Upload System:**
   - Set up AWS S3 or Cloudinary for image/video storage
   - Update report submission to handle file uploads

2. **Real-time Features:**
   - WebSocket is already configured
   - Add real-time notifications for new reports

3. **Production Deployment:**
   - Set up environment variables for production
   - Configure reverse proxy (Nginx)
   - Set up SSL certificates
   - Deploy to cloud platform (AWS, DigitalOcean, etc.)

## Security Checklist

- [ ] Change default JWT secrets to strong random strings
- [ ] Set up HTTPS in production
- [ ] Configure rate limiting
- [ ] Set up input validation
- [ ] Enable CORS only for your domain
- [ ] Set up database backups
- [ ] Configure firewall rules

## Support

If you encounter any issues:
1. Check the console logs for error messages
2. Verify all services are running (PostgreSQL, Redis, Node.js)
3. Check the `.env` file configuration
4. Ensure all dependencies are installed

This guide should get your complete backend system up and running!
