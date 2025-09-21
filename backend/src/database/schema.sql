-- LEHAR Ocean Hazard Reporting System Database Schema

-- Create database (run this manually)
-- CREATE DATABASE lehar_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('citizen', 'official')) DEFAULT 'citizen',
    avatar_url VARCHAR(500),
    email_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    reset_password_token VARCHAR(255),
    reset_password_expires TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Hazard reports table
CREATE TABLE IF NOT EXISTS hazard_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reporter_name VARCHAR(255),
    reporter_contact VARCHAR(255),
    type VARCHAR(50) CHECK (type IN ('tsunami', 'high-waves', 'storm-surge', 'coastal-damage', 'unusual-tides', 'swell-surge')) NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    location_address TEXT NOT NULL,
    severity VARCHAR(20) CHECK (severity IN ('low', 'medium', 'high', 'critical')) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('received', 'under-review', 'verified', 'rejected')) DEFAULT 'received',
    source VARCHAR(20) CHECK (source IN ('citizen', 'official', 'social')) DEFAULT 'citizen',
    images JSONB DEFAULT '[]',
    videos JSONB DEFAULT '[]',
    verified BOOLEAN DEFAULT FALSE,
    social_media_mentions INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social media trends table
CREATE TABLE IF NOT EXISTS social_media_trends (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform VARCHAR(20) CHECK (platform IN ('twitter', 'facebook', 'youtube', 'instagram')) NOT NULL,
    keyword VARCHAR(255) NOT NULL,
    mentions INTEGER NOT NULL,
    sentiment VARCHAR(20) CHECK (sentiment IN ('positive', 'negative', 'neutral')) DEFAULT 'neutral',
    trending BOOLEAN DEFAULT FALSE,
    location VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Map hotspots table
CREATE TABLE IF NOT EXISTS map_hotspots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_lat DECIMAL(10, 8) NOT NULL,
    location_lng DECIMAL(11, 8) NOT NULL,
    intensity DECIMAL(5, 2) NOT NULL,
    report_count INTEGER NOT NULL,
    dominant_hazard_type VARCHAR(50) NOT NULL,
    radius DECIMAL(8, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Refresh tokens table
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(500) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Report verification table
CREATE TABLE IF NOT EXISTS report_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES hazard_reports(id) ON DELETE CASCADE,
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
    verification_status VARCHAR(20) CHECK (verification_status IN ('verified', 'rejected', 'pending')) NOT NULL,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_location ON hazard_reports(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_type ON hazard_reports(type);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_severity ON hazard_reports(severity);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_status ON hazard_reports(status);
CREATE INDEX IF NOT EXISTS idx_hazard_reports_created_at ON hazard_reports(created_at);
CREATE INDEX IF NOT EXISTS idx_social_trends_platform ON social_media_trends(platform);
CREATE INDEX IF NOT EXISTS idx_social_trends_keyword ON social_media_trends(keyword);
CREATE INDEX IF NOT EXISTS idx_map_hotspots_location ON map_hotspots(location_lat, location_lng);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_token ON refresh_tokens(token);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hazard_reports_updated_at BEFORE UPDATE ON hazard_reports FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_map_hotspots_updated_at BEFORE UPDATE ON map_hotspots FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
