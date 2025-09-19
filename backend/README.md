# LEHAR Backend API

Ocean Hazard Reporting System Backend built with Node.js, Express, PostgreSQL, and Redis.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL 12+
- Redis 6+
- npm or yarn

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Set up PostgreSQL database:**
   ```bash
   # Create database
   createdb lehar_db
   
   # Run migrations
   npm run migrate
   ```

4. **Start Redis server:**
   ```bash
   redis-server
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:5000`

## 📋 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/verify-email/:token` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Reports
- `POST /api/reports` - Create new hazard report
- `GET /api/reports` - Get all reports (with filters)
- `GET /api/reports/:id` - Get single report
- `PUT /api/reports/:id/status` - Update report status (official only)
- `GET /api/reports/map/data` - Get reports for map (GeoJSON)
- `GET /api/reports/stats/overview` - Get report statistics

### Health Check
- `GET /health` - Server health status

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | PostgreSQL host | localhost |
| `DB_PORT` | PostgreSQL port | 5432 |
| `DB_NAME` | Database name | lehar_db |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `REDIS_HOST` | Redis host | localhost |
| `REDIS_PORT` | Redis port | 6379 |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_REFRESH_SECRET` | JWT refresh secret | - |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_USER` | SMTP user | - |
| `EMAIL_PASS` | SMTP password | - |
| `FRONTEND_URL` | Frontend URL | http://localhost:3000 |

## 🗄️ Database Schema

### Users Table
- `id` (UUID) - Primary key
- `email` (VARCHAR) - Unique email
- `password_hash` (VARCHAR) - Hashed password
- `name` (VARCHAR) - User name
- `role` (VARCHAR) - 'citizen' or 'official'
- `email_verified` (BOOLEAN) - Email verification status

### Hazard Reports Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Foreign key to users
- `reporter_name` (VARCHAR) - Reporter name
- `reporter_contact` (VARCHAR) - Contact info
- `type` (VARCHAR) - Hazard type
- `title` (VARCHAR) - Report title
- `description` (TEXT) - Report description
- `location_lat` (DECIMAL) - Latitude
- `location_lng` (DECIMAL) - Longitude
- `location_address` (TEXT) - Address
- `severity` (VARCHAR) - Severity level
- `status` (VARCHAR) - Report status
- `source` (VARCHAR) - Report source

## 🔐 Authentication

The API uses JWT tokens for authentication:
- **Access Token**: Short-lived (15 minutes)
- **Refresh Token**: Long-lived (7 days)
- **Token Blacklisting**: Revoked tokens are stored in Redis

### Headers
```
Authorization: Bearer <access_token>
```

## 📊 Real-time Features

WebSocket support for real-time updates:
- New report notifications
- Status updates
- Admin dashboard updates

### Socket Events
- `join-user-room` - Join user-specific room
- `join-admin-room` - Join admin room
- `report-updated` - Report status changed
- `new-report` - New report submitted

## 🛡️ Security Features

- **Rate Limiting**: Prevents abuse
- **Input Validation**: Joi schema validation
- **CORS**: Cross-origin resource sharing
- **Helmet**: Security headers
- **Password Hashing**: bcrypt with salt rounds
- **Token Blacklisting**: Redis-based token revocation

## 📝 Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run migrate` - Run database migrations
- `npm run seed` - Seed database with sample data
- `npm test` - Run tests

## 🧪 Testing

```bash
npm test
```

## 📦 Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set up Redis cluster
4. Configure email service
5. Set up reverse proxy (nginx)
6. Enable SSL/TLS
7. Set up monitoring and logging

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details
