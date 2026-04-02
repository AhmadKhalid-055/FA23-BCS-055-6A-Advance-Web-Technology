<<<<<<< HEAD
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing types if they exist (reverse order of dependencies)
DROP TYPE IF EXISTS health_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS validation_status CASCADE;
DROP TYPE IF EXISTS media_source_type CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS ad_status CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('client', 'moderator', 'admin', 'super_admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE ad_status AS ENUM ('draft', 'submitted', 'under_review', 'payment_pending', 'payment_submitted', 'payment_verified', 'scheduled', 'published', 'expired', 'archived', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'submitted', 'verified', 'rejected');
CREATE TYPE media_source_type AS ENUM ('image', 'youtube', 'external_url');
CREATE TYPE validation_status AS ENUM ('valid', 'invalid', 'pending');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE health_status AS ENUM ('healthy', 'degraded', 'down');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seller Profiles table
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  display_name VARCHAR(255),
  business_name VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  duration_days INT NOT NULL,
  weight INT NOT NULL DEFAULT 1,
  is_featured BOOLEAN DEFAULT FALSE,
  refresh_rule VARCHAR(50) DEFAULT 'none',
  auto_refresh_days INT,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  package_id UUID,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  category_id UUID NOT NULL,
  city_id UUID NOT NULL,
  description TEXT NOT NULL,
  status ad_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMP,
  expire_at TIMESTAMP,
  admin_boost INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Ad Media table
CREATE TABLE IF NOT EXISTS ad_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL,
  source_type media_source_type NOT NULL,
  original_url TEXT NOT NULL,
  thumbnail_url TEXT,
  validation_status validation_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(50) NOT NULL,
  transaction_ref VARCHAR(100) NOT NULL UNIQUE,
  sender_name VARCHAR(255) NOT NULL,
  screenshot_url TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  verified_by UUID,
  verification_note TEXT,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type notification_type NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  target_type VARCHAR(100) NOT NULL,
  target_id UUID,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (actor_id) REFERENCES users(id)
);

-- Ad Status History table
CREATE TABLE IF NOT EXISTS ad_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL,
  previous_status ad_status,
  new_status ad_status NOT NULL,
  changed_by UUID NOT NULL,
  note TEXT,
  changed_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- Learning Questions table
CREATE TABLE IF NOT EXISTS learning_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  topic VARCHAR(100),
  difficulty VARCHAR(20) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- System Health Logs table
CREATE TABLE IF NOT EXISTS system_health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(100) NOT NULL,
  response_ms INT,
  checked_at TIMESTAMP DEFAULT NOW(),
  status health_status NOT NULL,
  error_message TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON seller_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_user_id ON ads(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status);
CREATE INDEX IF NOT EXISTS idx_ads_category_id ON ads(category_id);
CREATE INDEX IF NOT EXISTS idx_ads_city_id ON ads(city_id);
CREATE INDEX IF NOT EXISTS idx_ads_publish_at ON ads(publish_at);
CREATE INDEX IF NOT EXISTS idx_ads_expire_at ON ads(expire_at);
CREATE INDEX IF NOT EXISTS idx_ad_media_ad_id ON ad_media(ad_id);
CREATE INDEX IF NOT EXISTS idx_payments_ad_id ON payments(ad_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ad_status_history_ad_id ON ad_status_history(ad_id);
CREATE INDEX IF NOT EXISTS idx_learning_questions_is_active ON learning_questions(is_active);

-- Create RLS (Row Level Security) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_logs ENABLE ROW LEVEL SECURITY;

-- Reference tables: Allow public read-only access (no insert/update/delete)
CREATE POLICY "packages_public_read" ON packages
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "categories_public_read" ON categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "cities_public_read" ON cities
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "learning_questions_public_read" ON learning_questions
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "system_health_logs_public_read" ON system_health_logs
  FOR SELECT
  USING (true);

-- Basic RLS Policy for seeing public active ads
CREATE POLICY "public_can_view_published_ads" ON ads
  FOR SELECT
  USING (status = 'published' AND expire_at > NOW());

-- Users can see their own data
CREATE POLICY "users_see_own_data" ON users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Insert sample data
INSERT INTO packages (name, duration_days, weight, is_featured, refresh_rule, price, description)
VALUES 
  ('Basic', 7, 1, false, 'none', 99, 'Perfect for getting started'),
  ('Standard', 15, 2, false, 'manual', 199, 'Popular choice with manual refresh'),
  ('Premium', 30, 3, true, 'auto', 399, 'Best seller with auto-refresh every 3 days')
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, slug, description, display_order)
VALUES 
  ('Electronics', 'electronics', 'Phones, laptops, and gadgets', 1),
  ('Furniture', 'furniture', 'Home and office furniture', 2),
  ('Vehicles', 'vehicles', 'Cars, bikes, and motorcycles', 3),
  ('Services', 'services', 'Professional services and consultancy', 4),
  ('Real Estate', 'real-estate', 'Properties and rentals', 5)
ON CONFLICT DO NOTHING;

INSERT INTO cities (name, slug)
VALUES 
  ('Karachi', 'karachi'),
  ('Lahore', 'lahore'),
  ('Islamabad', 'islamabad'),
  ('Rawalpindi', 'rawalpindi'),
  ('Multan', 'multan')
ON CONFLICT DO NOTHING;

INSERT INTO learning_questions (question, answer, topic, difficulty)
VALUES 
  ('What is a classified ad?', 'A classified ad is a short advertisement posted in a newspaper or online listing service.', 'General', 'easy'),
  ('How long does an ad stay live?', 'Duration depends on the package selected - Basic (7 days), Standard (15 days), or Premium (30 days).', 'Packages', 'medium'),
  ('What payment methods are accepted?', 'We accept bank transfers, online wallets, and digital payment methods.', 'Payments', 'easy')
ON CONFLICT DO NOTHING;
=======
-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing types if they exist (reverse order of dependencies)
DROP TYPE IF EXISTS health_status CASCADE;
DROP TYPE IF EXISTS notification_type CASCADE;
DROP TYPE IF EXISTS validation_status CASCADE;
DROP TYPE IF EXISTS media_source_type CASCADE;
DROP TYPE IF EXISTS payment_status CASCADE;
DROP TYPE IF EXISTS ad_status CASCADE;
DROP TYPE IF EXISTS user_status CASCADE;
DROP TYPE IF EXISTS user_role CASCADE;

-- Create ENUM types
CREATE TYPE user_role AS ENUM ('client', 'moderator', 'admin', 'super_admin');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'suspended');
CREATE TYPE ad_status AS ENUM ('draft', 'submitted', 'under_review', 'payment_pending', 'payment_submitted', 'payment_verified', 'scheduled', 'published', 'expired', 'archived', 'rejected');
CREATE TYPE payment_status AS ENUM ('pending', 'submitted', 'verified', 'rejected');
CREATE TYPE media_source_type AS ENUM ('image', 'youtube', 'external_url');
CREATE TYPE validation_status AS ENUM ('valid', 'invalid', 'pending');
CREATE TYPE notification_type AS ENUM ('info', 'success', 'warning', 'error');
CREATE TYPE health_status AS ENUM ('healthy', 'degraded', 'down');

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role user_role NOT NULL DEFAULT 'client',
  status user_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Seller Profiles table
CREATE TABLE IF NOT EXISTS seller_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL UNIQUE,
  display_name VARCHAR(255),
  business_name VARCHAR(255),
  phone VARCHAR(20),
  city VARCHAR(100),
  bio TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  duration_days INT NOT NULL,
  weight INT NOT NULL DEFAULT 1,
  is_featured BOOLEAN DEFAULT FALSE,
  refresh_rule VARCHAR(50) DEFAULT 'none',
  auto_refresh_days INT,
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Cities table
CREATE TABLE IF NOT EXISTS cities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Ads table
CREATE TABLE IF NOT EXISTS ads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  package_id UUID,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255),
  category_id UUID NOT NULL,
  city_id UUID NOT NULL,
  description TEXT NOT NULL,
  status ad_status NOT NULL DEFAULT 'draft',
  publish_at TIMESTAMP,
  expire_at TIMESTAMP,
  admin_boost INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (package_id) REFERENCES packages(id),
  FOREIGN KEY (category_id) REFERENCES categories(id),
  FOREIGN KEY (city_id) REFERENCES cities(id)
);

-- Ad Media table
CREATE TABLE IF NOT EXISTS ad_media (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL,
  source_type media_source_type NOT NULL,
  original_url TEXT NOT NULL,
  thumbnail_url TEXT,
  validation_status validation_status DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE
);

-- Payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL UNIQUE,
  amount DECIMAL(10, 2) NOT NULL,
  method VARCHAR(50) NOT NULL,
  transaction_ref VARCHAR(100) NOT NULL UNIQUE,
  sender_name VARCHAR(255) NOT NULL,
  screenshot_url TEXT,
  status payment_status NOT NULL DEFAULT 'pending',
  verified_by UUID,
  verification_note TEXT,
  verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
  FOREIGN KEY (verified_by) REFERENCES users(id)
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type notification_type NOT NULL DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  link TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Audit Logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID NOT NULL,
  action_type VARCHAR(100) NOT NULL,
  target_type VARCHAR(100) NOT NULL,
  target_id UUID,
  old_value JSONB,
  new_value JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (actor_id) REFERENCES users(id)
);

-- Ad Status History table
CREATE TABLE IF NOT EXISTS ad_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  ad_id UUID NOT NULL,
  previous_status ad_status,
  new_status ad_status NOT NULL,
  changed_by UUID NOT NULL,
  note TEXT,
  changed_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (ad_id) REFERENCES ads(id) ON DELETE CASCADE,
  FOREIGN KEY (changed_by) REFERENCES users(id)
);

-- Learning Questions table
CREATE TABLE IF NOT EXISTS learning_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  topic VARCHAR(100),
  difficulty VARCHAR(20) DEFAULT 'medium',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- System Health Logs table
CREATE TABLE IF NOT EXISTS system_health_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source VARCHAR(100) NOT NULL,
  response_ms INT,
  checked_at TIMESTAMP DEFAULT NOW(),
  status health_status NOT NULL,
  error_message TEXT
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_seller_profiles_user_id ON seller_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_user_id ON ads(user_id);
CREATE INDEX IF NOT EXISTS idx_ads_status ON ads(status);
CREATE INDEX IF NOT EXISTS idx_ads_category_id ON ads(category_id);
CREATE INDEX IF NOT EXISTS idx_ads_city_id ON ads(city_id);
CREATE INDEX IF NOT EXISTS idx_ads_publish_at ON ads(publish_at);
CREATE INDEX IF NOT EXISTS idx_ads_expire_at ON ads(expire_at);
CREATE INDEX IF NOT EXISTS idx_ad_media_ad_id ON ad_media(ad_id);
CREATE INDEX IF NOT EXISTS idx_payments_ad_id ON payments(ad_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_ad_status_history_ad_id ON ad_status_history(ad_id);
CREATE INDEX IF NOT EXISTS idx_learning_questions_is_active ON learning_questions(is_active);

-- Create RLS (Row Level Security) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE ad_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_health_logs ENABLE ROW LEVEL SECURITY;

-- Reference tables: Allow public read-only access (no insert/update/delete)
CREATE POLICY "packages_public_read" ON packages
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "categories_public_read" ON categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "cities_public_read" ON cities
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "learning_questions_public_read" ON learning_questions
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "system_health_logs_public_read" ON system_health_logs
  FOR SELECT
  USING (true);

-- Basic RLS Policy for seeing public active ads
CREATE POLICY "public_can_view_published_ads" ON ads
  FOR SELECT
  USING (status = 'published' AND expire_at > NOW());

-- Users can see their own data
CREATE POLICY "users_see_own_data" ON users
  FOR SELECT
  USING (auth.uid()::text = id::text);

-- Insert sample data
INSERT INTO packages (name, duration_days, weight, is_featured, refresh_rule, price, description)
VALUES 
  ('Basic', 7, 1, false, 'none', 99, 'Perfect for getting started'),
  ('Standard', 15, 2, false, 'manual', 199, 'Popular choice with manual refresh'),
  ('Premium', 30, 3, true, 'auto', 399, 'Best seller with auto-refresh every 3 days')
ON CONFLICT DO NOTHING;

INSERT INTO categories (name, slug, description, display_order)
VALUES 
  ('Electronics', 'electronics', 'Phones, laptops, and gadgets', 1),
  ('Furniture', 'furniture', 'Home and office furniture', 2),
  ('Vehicles', 'vehicles', 'Cars, bikes, and motorcycles', 3),
  ('Services', 'services', 'Professional services and consultancy', 4),
  ('Real Estate', 'real-estate', 'Properties and rentals', 5)
ON CONFLICT DO NOTHING;

INSERT INTO cities (name, slug)
VALUES 
  ('Karachi', 'karachi'),
  ('Lahore', 'lahore'),
  ('Islamabad', 'islamabad'),
  ('Rawalpindi', 'rawalpindi'),
  ('Multan', 'multan')
ON CONFLICT DO NOTHING;

INSERT INTO learning_questions (question, answer, topic, difficulty)
VALUES 
  ('What is a classified ad?', 'A classified ad is a short advertisement posted in a newspaper or online listing service.', 'General', 'easy'),
  ('How long does an ad stay live?', 'Duration depends on the package selected - Basic (7 days), Standard (15 days), or Premium (30 days).', 'Packages', 'medium'),
  ('What payment methods are accepted?', 'We accept bank transfers, online wallets, and digital payment methods.', 'Payments', 'easy')
ON CONFLICT DO NOTHING;
>>>>>>> 4d5b50563cf7249ca15c7bd9ce15260b5c518e20
