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

## 📱 Features

### For Citizens
- Report coastal hazards with location and photos
- View interactive maps with hazard reports
- Real-time updates on hazard status
- Guest reporting without registration

### For Officials
- Access official dashboard
- Verify and manage reports
- Monitor hazard trends
- Update report status

### Interactive Maps
- Real-time hazard visualization
- Filter by hazard type, severity, and source
- Full-screen map view
- Location-based reporting

## 🔧 Development

### Available Scripts

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

## 🔐 Authentication

### User Roles
- **citizen**: Can report hazards and view maps
- **official**: Can manage and verify reports

### Demo Credentials
- **Citizen**: `citizen@example.com` / `password123`
- **Official**: `official@incois.gov.in` / `official123`

## 🐛 Troubleshooting

### Common Issues

1. **Backend not starting**
   - Check if PostgreSQL is running
   - Verify Redis is running
   - Check environment variables in `.env`

2. **Database connection errors**
   - Ensure PostgreSQL is installed and running
   - Verify database credentials in `.env`
   - Run migrations: `npm run migrate`

3. **Frontend not loading**
   - Check if backend is running on port 5000
   - Verify CORS configuration
   - Check browser console for errors

4. **Reports not showing on map**
   - Check browser console for errors
   - Verify localStorage has report data
   - Check backend API responses

### Debug Mode
Enable detailed logging by checking browser console (F12) for:
- Report submission logs
- API call responses
- Map loading status
- Error messages

## 📚 API Documentation

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