-- ==============================================================================
-- POSTPLACE CT / MI PROYECTO CITY - COMPLETE SUPABASE POSTGRESQL SCHEMA & SEED
-- Paste this script directly into Supabase SQL Editor and click RUN
-- ==============================================================================

-- Drop existing tables if re-running
DROP TABLE IF EXISTS "Report" CASCADE;
DROP TABLE IF EXISTS "Notification" CASCADE;
DROP TABLE IF EXISTS "SavedItem" CASCADE;
DROP TABLE IF EXISTS "SavedService" CASCADE;
DROP TABLE IF EXISTS "SavedJob" CASCADE;
DROP TABLE IF EXISTS "Review" CASCADE;
DROP TABLE IF EXISTS "Message" CASCADE;
DROP TABLE IF EXISTS "Conversation" CASCADE;
DROP TABLE IF EXISTS "ItemOffer" CASCADE;
DROP TABLE IF EXISTS "MarketplaceItem" CASCADE;
DROP TABLE IF EXISTS "QuoteRequest" CASCADE;
DROP TABLE IF EXISTS "JobApplication" CASCADE;
DROP TABLE IF EXISTS "Job" CASCADE;
DROP TABLE IF EXISTS "Service" CASCADE;
DROP TABLE IF EXISTS "Business" CASCADE;
DROP TABLE IF EXISTS "UserSkill" CASCADE;
DROP TABLE IF EXISTS "UserExperience" CASCADE;
DROP TABLE IF EXISTS "UserEducation" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;
DROP TABLE IF EXISTS "Location" CASCADE;
DROP TABLE IF EXISTS "City" CASCADE;
DROP TABLE IF EXISTS "JobCategory" CASCADE;
DROP TABLE IF EXISTS "ServiceCategory" CASCADE;
DROP TABLE IF EXISTS "MarketplaceCategory" CASCADE;

-- 1. City Table
CREATE TABLE "City" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "zipCodes" TEXT NOT NULL,
  "lat" DOUBLE PRECISION NOT NULL,
  "lng" DOUBLE PRECISION NOT NULL,
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Location Table
CREATE TABLE "Location" (
  "id" TEXT PRIMARY KEY,
  "cityId" TEXT NOT NULL REFERENCES "City"("id") ON DELETE CASCADE,
  "addressLine" TEXT,
  "neighborhood" TEXT,
  "zipCode" TEXT,
  "lat" DOUBLE PRECISION,
  "lng" DOUBLE PRECISION
);

-- 3. User Table
CREATE TABLE "User" (
  "id" TEXT PRIMARY KEY,
  "email" TEXT UNIQUE NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "phone" TEXT,
  "avatarUrl" TEXT,
  "bio" TEXT,
  "resumeUrl" TEXT,
  "role" TEXT NOT NULL DEFAULT 'JOB_SEEKER',
  "activeRole" TEXT NOT NULL DEFAULT 'JOB_SEEKER',
  "privacy" TEXT NOT NULL DEFAULT 'PUBLIC',
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "locationId" TEXT REFERENCES "Location"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Business Table
CREATE TABLE "Business" (
  "id" TEXT PRIMARY KEY,
  "ownerId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "logoUrl" TEXT,
  "coverUrl" TEXT,
  "description" TEXT NOT NULL,
  "category" TEXT NOT NULL,
  "website" TEXT,
  "phone" TEXT,
  "email" TEXT,
  "isVerified" BOOLEAN NOT NULL DEFAULT false,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  "locationId" TEXT REFERENCES "Location"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. Job Categories & Jobs
CREATE TABLE "JobCategory" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "icon" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Job" (
  "id" TEXT PRIMARY KEY,
  "businessId" TEXT REFERENCES "Business"("id") ON DELETE CASCADE,
  "postedById" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL REFERENCES "JobCategory"("id"),
  "description" TEXT NOT NULL,
  "responsibilities" TEXT,
  "requirements" TEXT,
  "benefits" TEXT,
  "galleryImages" TEXT DEFAULT '[]',
  "salaryMin" DOUBLE PRECISION,
  "salaryMax" DOUBLE PRECISION,
  "salaryType" TEXT NOT NULL DEFAULT 'hourly',
  "employmentType" TEXT NOT NULL DEFAULT 'full-time',
  "schedule" TEXT NOT NULL DEFAULT 'flexible',
  "experienceLevel" TEXT NOT NULL DEFAULT 'entry',
  "isRemote" TEXT NOT NULL DEFAULT 'onsite',
  "languages" TEXT DEFAULT 'English Required',
  "status" TEXT NOT NULL DEFAULT 'active',
  "viewsCount" INTEGER NOT NULL DEFAULT 0,
  "locationId" TEXT REFERENCES "Location"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 6. Job Applications
CREATE TABLE "JobApplication" (
  "id" TEXT PRIMARY KEY,
  "jobId" TEXT NOT NULL REFERENCES "Job"("id") ON DELETE CASCADE,
  "applicantId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "resumeUrl" TEXT,
  "coverLetter" TEXT,
  "status" TEXT NOT NULL DEFAULT 'APPLIED',
  "statusUpdatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 7. Service Categories & Services
CREATE TABLE "ServiceCategory" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "icon" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Service" (
  "id" TEXT PRIMARY KEY,
  "providerId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "name" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL REFERENCES "ServiceCategory"("id"),
  "description" TEXT NOT NULL,
  "pricingType" TEXT NOT NULL DEFAULT 'starting_at',
  "priceAmount" DOUBLE PRECISION,
  "serviceAreaRadius" INTEGER NOT NULL DEFAULT 10,
  "experienceYears" INTEGER NOT NULL DEFAULT 1,
  "availability" TEXT NOT NULL DEFAULT 'Weekdays & Weekends',
  "portfolioImages" TEXT NOT NULL DEFAULT '[]',
  "isActive" BOOLEAN NOT NULL DEFAULT true,
  "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
  "reviewCount" INTEGER NOT NULL DEFAULT 0,
  "responseTime" TEXT NOT NULL DEFAULT 'Within 1 hour',
  "locationId" TEXT REFERENCES "Location"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 8. Marketplace Categories & Items
CREATE TABLE "MarketplaceCategory" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT UNIQUE NOT NULL,
  "slug" TEXT UNIQUE NOT NULL,
  "icon" TEXT,
  "description" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "MarketplaceItem" (
  "id" TEXT PRIMARY KEY,
  "sellerId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
  "title" TEXT NOT NULL,
  "categoryId" TEXT NOT NULL REFERENCES "MarketplaceCategory"("id"),
  "description" TEXT NOT NULL,
  "price" DOUBLE PRECISION NOT NULL,
  "condition" TEXT NOT NULL DEFAULT 'GOOD',
  "images" TEXT NOT NULL DEFAULT '[]',
  "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
  "viewsCount" INTEGER NOT NULL DEFAULT 0,
  "locationId" TEXT REFERENCES "Location"("id"),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------------------------
-- INITIAL SEED DATA
-- ------------------------------------------------------------------------------

-- Seed Cities
INSERT INTO "City" ("id", "name", "state", "zipCodes", "lat", "lng", "isActive") VALUES
('city-norwalk', 'Norwalk', 'CT', '06850, 06851, 06853, 06854', 41.1177, -73.4079, true),
('city-stamford', 'Stamford', 'CT', '06901, 06902, 06903, 06905', 41.0534, -73.5387, true),
('city-greenwich', 'Greenwich', 'CT', '06830, 06831, 06870', 41.0262, -73.6282, true);

-- Seed Locations
INSERT INTO "Location" ("id", "cityId", "neighborhood", "addressLine", "zipCode", "lat", "lng") VALUES
('loc-sono', 'city-norwalk', 'South Norwalk (SoNo)', '50 Washington St', '06854', 41.0990, -73.4150),
('loc-east-norwalk', 'city-norwalk', 'East Norwalk', '220 East Ave', '06855', 41.1075, -73.4010),
('loc-stamford-dt', 'city-stamford', 'Downtown Stamford', '300 Atlantic St', '06901', 41.0534, -73.5387);

-- Seed Job Categories
INSERT INTO "JobCategory" ("id", "name", "slug", "icon", "description") VALUES
('jcat-trades', 'Skilled Trades & Labor', 'skilled-trades', 'Wrench', 'Plumbing, electrical, HVAC, construction'),
('jcat-logistics', 'Logistics & Warehouse', 'logistics-warehouse', 'Package', 'Shipping, fulfillment, driving, inventory'),
('jcat-hospitality', 'Restaurant & Hospitality', 'restaurant-hospitality', 'Utensils', 'Kitchen, bar, front of house, hotel staff');

-- Seed Users
INSERT INTO "User" ("id", "email", "passwordHash", "name", "role", "activeRole", "phone", "isVerified", "locationId") VALUES
('usr-emp-1', 'hr@norwalkdistro.com', '$2a$10$wT1rK1hW.XkH...dummy', 'Marcus Vance', 'EMPLOYER', 'EMPLOYER', '(203) 555-0199', true, 'loc-sono'),
('usr-seeker-1', 'alex@user.com', '$2a$10$wT1rK1hW.XkH...dummy', 'Alex Rivera', 'JOB_SEEKER', 'JOB_SEEKER', '(203) 555-0122', true, 'loc-east-norwalk');

-- Seed Business
INSERT INTO "Business" ("id", "ownerId", "name", "logoUrl", "description", "category", "isVerified", "locationId") VALUES
('biz-bakery', 'usr-emp-1', 'Panadería Qué Delicia', '/images/empanada_bakery.png', 'Panadería artesanal en Norwalk. Deliciosas empanadas recién horneadas y pan fresco.', 'Panadería & Restaurante', true, 'loc-sono');

-- Seed Job
INSERT INTO "Job" ("id", "businessId", "postedById", "title", "categoryId", "description", "salaryMin", "salaryMax", "salaryType", "employmentType", "status", "locationId") VALUES
('job-1', 'biz-bakery', 'usr-emp-1', 'Warehouse Operations & Forklift Specialist', 'jcat-logistics', 'Loading/unloading trucks and inventory management in Norwalk.', 21.50, 26.00, 'hourly', 'full-time', 'active', 'loc-sono');

