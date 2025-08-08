-- Migration: Create Farmer Profiles Table
-- Description: Creates farmer-specific profile information table
-- Date: August 8, 2025

-- Create ENUM for verification status
CREATE TYPE verification_status AS ENUM ('pending', 'approved', 'rejected', 'suspended');

-- Create the farmer profiles table
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    farm_name VARCHAR(255) NOT NULL,
    farm_address TEXT NOT NULL,
    farm_size_acres DECIMAL(10, 2),
    organic_certified BOOLEAN DEFAULT FALSE,
    organic_cert_number VARCHAR(100),
    organic_cert_expiry DATE,
    verification_status verification_status DEFAULT 'pending',
    verification_documents TEXT[], -- Array of document URLs
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    established_year INTEGER,
    farming_methods TEXT, -- Description of farming practices
    specialties TEXT[], -- Array of specialties (e.g., ['organic vegetables', 'herbs'])
    bio TEXT, -- Farmer bio/description
    profile_image_url VARCHAR(500),
    social_media JSONB, -- Store social media links as JSON
    delivery_radius INTEGER DEFAULT 50, -- Delivery radius in kilometers
    min_order_amount DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure one profile per user
    CONSTRAINT unique_farmer_profile UNIQUE(user_id)
);

-- Create indexes for better performance
CREATE INDEX idx_farmer_profiles_user_id ON farmer_profiles(user_id);
CREATE INDEX idx_farmer_profiles_verification ON farmer_profiles(verification_status);
CREATE INDEX idx_farmer_profiles_location ON farmer_profiles(latitude, longitude);
CREATE INDEX idx_farmer_profiles_organic ON farmer_profiles(organic_certified);
CREATE INDEX idx_farmer_profiles_delivery_radius ON farmer_profiles(delivery_radius);

-- Create spatial index for location-based queries (if PostGIS is available)
-- CREATE INDEX idx_farmer_profiles_geo ON farmer_profiles USING GIST (ST_MakePoint(longitude, latitude));

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_farmer_profiles_updated_at
    BEFORE UPDATE ON farmer_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE farmer_profiles IS 'Extended profile information for farmers';
COMMENT ON COLUMN farmer_profiles.user_id IS 'Reference to the user account';
COMMENT ON COLUMN farmer_profiles.farm_name IS 'Display name of the farm';
COMMENT ON COLUMN farmer_profiles.farm_address IS 'Physical address of the farm';
COMMENT ON COLUMN farmer_profiles.farm_size_acres IS 'Size of farm in acres';
COMMENT ON COLUMN farmer_profiles.organic_certified IS 'Whether farm has organic certification';
COMMENT ON COLUMN farmer_profiles.organic_cert_number IS 'Organic certification number';
COMMENT ON COLUMN farmer_profiles.verification_status IS 'Admin verification status';
COMMENT ON COLUMN farmer_profiles.verification_documents IS 'URLs to uploaded verification documents';
COMMENT ON COLUMN farmer_profiles.latitude IS 'Farm GPS latitude for delivery calculations';
COMMENT ON COLUMN farmer_profiles.longitude IS 'Farm GPS longitude for delivery calculations';
COMMENT ON COLUMN farmer_profiles.specialties IS 'Array of farming specialties';
COMMENT ON COLUMN farmer_profiles.social_media IS 'JSON object with social media links';
COMMENT ON COLUMN farmer_profiles.delivery_radius IS 'Maximum delivery distance in kilometers';
COMMENT ON COLUMN farmer_profiles.min_order_amount IS 'Minimum order amount for this farmer';
