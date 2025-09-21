# LEHAR - Coastal Hazard Monitoring System
A comprehensive coastal hazard monitoring system that allows citizens to report coastal hazards and officials to monitor and manage them through interactive maps and dashboards.

## 🌊 Overview
LEHAR is a full-stack application that combines:
- **Frontend**: React-based web application with interactive maps
- **Backend**: Node.js/Express API with PostgreSQL database
- **Real-time Features**: Live report updates and map visualization
- **Authentication**: JWT-based user authentication system

## 🚀 Quick Start

### Prerequisites
Before running the project, ensure you have installed:
- **Node.js** (v16 or higher)
- **PostgreSQL** (v12 or higher)
- **Redis** (v6 or higher)
- **Git**

### Installation
1. **Clone the repository**
   ```bash
   git clone https://github.com/aditya-raj9125/Lehar_SIH_2025.git
   cd Lehar_SIH_2025
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

## 🗄️ Database Setup

### 1. Create PostgreSQL Database
   ```sql
   CREATE DATABASE coastal_watch_db;
   ```

### 2. Configure Environment Variables
   Create `.env` file in the `backend` directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=coastal_watch_db
   DB_USER=postgres
   DB_PASSWORD=your_password

   # Redis Configuration
   REDIS_HOST=localhost
   REDIS_PORT=6379

   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key
   JWT_REFRESH_SECRET=your_refresh_secret_key
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d

   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:8080

   # Email Configuration (Optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

### 3. Run Database Migrations
   ```bash
   cd backend
   npm run migrate
   cd ..
   ```

## 🏃‍♂️ Running the Application

### 1. Start Redis Server
   ```bash
   redis-server
   ```
   Or on Windows with Redis installed:
   ```bash
   redis-server.exe
   ```

### 2. Start Backend Server
   ```bash
   cd backend
   npm start
   ```
   The backend will run on `http://localhost:5000`

### 3. Start Frontend Development Server
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:8080`

## 🌐 Accessing the Application

- **Main Application**: http://localhost:8080
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health


#### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

#### Backend
```bash
npm start            # Start production server
npm run dev          # Start development server with nodemon
npm run migrate      # Run database migrations
npm run seed         # Seed database with sample data
npm run test-api     # Test all API endpoints
```

### Project Structure
```
Lehar_SIH_2025/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── contexts/          # React contexts
│   ├── types/             # TypeScript type definitions
│   └── utils/             # Utility functions
├── backend/               # Backend source code
│   ├── src/
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/   # Express middleware
│   │   ├── routes/       # API routes
│   │   ├── config/       # Configuration files
│   │   └── database/     # Database schemas and migrations
│   └── package.json      # Backend dependencies
├── public/               # Static assets
└── package.json          # Frontend dependencies
```

## 🗃️ Database Schema

### Tables
- **users**: User accounts and authentication
- **hazard_reports**: Coastal hazard reports
- **report_verifications**: Report verification status
- **social_media_trends**: Social media monitoring data
- **map_hotspots**: Map hotspot data
- **refresh_tokens**: JWT refresh tokens


### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/test` - Health check

### Report Endpoints
- `GET /api/reports` - Get all reports
- `POST /api/reports` - Create new report
- `GET /api/reports/:id` - Get single report
- `PUT /api/reports/:id/status` - Update report status

## 🚀 Deployment

### Production Build
```bash
# Frontend
npm run build

# Backend
cd backend
npm start
```

### Environment Variables for Production
Update `.env` with production values:
- Database credentials
- JWT secrets
- Email configuration
- CORS origins

## 📄 License

This project is developed for the Smart India Hackathon 2025.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For issues and questions:
- Check the troubleshooting section
- Review the console logs
- Check the API health endpoint
- Verify all services are running

---

**LEHAR - Protecting Coastal Communities Through Technology** 🌊