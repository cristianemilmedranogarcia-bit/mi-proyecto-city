import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Norwalk, CT database seed (with Buy & Sell Marketplace)...');

  // Clean existing tables
  await prisma.report.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.savedItem.deleteMany();
  await prisma.savedService.deleteMany();
  await prisma.savedJob.deleteMany();
  await prisma.review.deleteMany();
  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.itemOffer.deleteMany();
  await prisma.marketplaceItem.deleteMany();
  await prisma.quoteRequest.deleteMany();
  await prisma.jobApplication.deleteMany();
  await prisma.job.deleteMany();
  await prisma.service.deleteMany();
  await prisma.business.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.userExperience.deleteMany();
  await prisma.userEducation.deleteMany();
  await prisma.user.deleteMany();
  await prisma.location.deleteMany();
  await prisma.city.deleteMany();
  await prisma.jobCategory.deleteMany();
  await prisma.serviceCategory.deleteMany();
  await prisma.marketplaceCategory.deleteMany();

  // 1. Seed Cities
  const norwalk = await prisma.city.create({
    data: { name: 'Norwalk', state: 'CT', zipCodes: '06850, 06851, 06853, 06854', lat: 41.1177, lng: -73.4079, isActive: true },
  });
  const stamford = await prisma.city.create({
    data: { name: 'Stamford', state: 'CT', zipCodes: '06901, 06902, 06903, 06905', lat: 41.0534, lng: -73.5387, isActive: true },
  });
  const greenwich = await prisma.city.create({
    data: { name: 'Greenwich', state: 'CT', zipCodes: '06830, 06831, 06870', lat: 41.0262, lng: -73.6282, isActive: true },
  });
  const danbury = await prisma.city.create({
    data: { name: 'Danbury', state: 'CT', zipCodes: '06810, 06811', lat: 41.3948, lng: -73.4540, isActive: true },
  });
  const hartford = await prisma.city.create({
    data: { name: 'Hartford', state: 'CT', zipCodes: '06103, 06106', lat: 41.7658, lng: -72.6734, isActive: true },
  });
  const newhaven = await prisma.city.create({
    data: { name: 'New Haven', state: 'CT', zipCodes: '06510, 06511', lat: 41.3083, lng: -72.9279, isActive: true },
  });
  const nyc = await prisma.city.create({
    data: { name: 'New York City', state: 'NY', zipCodes: '10001, 10011, 11201', lat: 40.7128, lng: -74.0060, isActive: true },
  });
  const whiteplains = await prisma.city.create({
    data: { name: 'White Plains', state: 'NY', zipCodes: '10601, 10606', lat: 41.0340, lng: -73.7629, isActive: true },
  });

  // 2. Seed Locations
  const locSoNo = await prisma.location.create({
    data: { cityId: norwalk.id, neighborhood: 'South Norwalk (SoNo)', addressLine: '50 Washington St', zipCode: '06854', lat: 41.0990, lng: -73.4150 },
  });
  const locEastNorwalk = await prisma.location.create({
    data: { cityId: norwalk.id, neighborhood: 'East Norwalk', addressLine: '220 East Ave', zipCode: '06855', lat: 41.1075, lng: -73.4010 },
  });
  const locRowayton = await prisma.location.create({
    data: { cityId: norwalk.id, neighborhood: 'Rowayton', addressLine: '14 Rowayton Ave', zipCode: '06853', lat: 41.0772, lng: -73.4385 },
  });
  const locCranbury = await prisma.location.create({
    data: { cityId: norwalk.id, neighborhood: 'Cranbury', addressLine: '400 Main Ave', zipCode: '06851', lat: 41.1400, lng: -73.4210 },
  });

  const locStamfordDt = await prisma.location.create({
    data: { cityId: stamford.id, neighborhood: 'Downtown Stamford', addressLine: '300 Atlantic St', zipCode: '06901', lat: 41.0534, lng: -73.5387 },
  });
  const locStamfordHp = await prisma.location.create({
    data: { cityId: stamford.id, neighborhood: 'Harbor Point', addressLine: '100 Washington Blvd', zipCode: '06902', lat: 41.0420, lng: -73.5410 },
  });

  const locGreenwichAve = await prisma.location.create({
    data: { cityId: greenwich.id, neighborhood: 'Greenwich Avenue', addressLine: '150 Greenwich Ave', zipCode: '06830', lat: 41.0262, lng: -73.6282 },
  });
  const locOldGreenwich = await prisma.location.create({
    data: { cityId: greenwich.id, neighborhood: 'Old Greenwich', addressLine: '18 Arcadia Rd', zipCode: '06870', lat: 41.0350, lng: -73.5650 },
  });

  const locDanburyFair = await prisma.location.create({
    data: { cityId: danbury.id, neighborhood: 'Mill Plain District', addressLine: '7 Backus Ave', zipCode: '06810', lat: 41.3948, lng: -73.4540 },
  });
  const locHartfordDt = await prisma.location.create({
    data: { cityId: hartford.id, neighborhood: 'Downtown Hartford', addressLine: '100 Pearl St', zipCode: '06103', lat: 41.7658, lng: -72.6734 },
  });
  const locNewHavenYale = await prisma.location.create({
    data: { cityId: newhaven.id, neighborhood: 'Yale University District', addressLine: '250 Church St', zipCode: '06510', lat: 41.3083, lng: -72.9279 },
  });
  const locManhattan = await prisma.location.create({
    data: { cityId: nyc.id, neighborhood: 'Midtown Manhattan', addressLine: '350 Fifth Ave', zipCode: '10118', lat: 40.7484, lng: -73.9857 },
  });
  const locBrooklyn = await prisma.location.create({
    data: { cityId: nyc.id, neighborhood: 'Williamsburg Brooklyn', addressLine: '240 Bedford Ave', zipCode: '11211', lat: 40.7160, lng: -73.9580 },
  });

  // 3. Seed Job Categories
  const catTrades = await prisma.jobCategory.create({
    data: { name: 'Skilled Trades & Labor', slug: 'skilled-trades', icon: 'Wrench', description: 'Plumbing, electrical, HVAC, construction, carpentry' },
  });
  const catLogistics = await prisma.jobCategory.create({
    data: { name: 'Logistics & Warehouse', slug: 'logistics-warehouse', icon: 'Package', description: 'Shipping, fulfillment, driving, inventory' },
  });
  const catHospitality = await prisma.jobCategory.create({
    data: { name: 'Restaurant & Hospitality', slug: 'restaurant-hospitality', icon: 'Utensils', description: 'Kitchen, bar, front of house, hotel staff' },
  });
  const catOffice = await prisma.jobCategory.create({
    data: { name: 'Office & Administration', slug: 'office-admin', icon: 'Briefcase', description: 'Reception, admin assistant, customer support' },
  });
  const catHealthcare = await prisma.jobCategory.create({
    data: { name: 'Healthcare & Medical', slug: 'healthcare-medical', icon: 'HeartPulse', description: 'Dental, nursing, medical assistant, vet care' },
  });
  const catTech = await prisma.jobCategory.create({
    data: { name: 'Technology & IT', slug: 'tech-software', icon: 'Code', description: 'Software engineering, IT support, web development' },
  });

  // 4. Seed Service Categories
  const srvHandyman = await prisma.serviceCategory.create({
    data: { name: 'Handyman & Home Repair', slug: 'handyman', icon: 'Hammer', description: 'General repairs, TV mounting, drywall patching, and carpentry' },
  });
  const srvCleaning = await prisma.serviceCategory.create({
    data: { name: 'House & Office Cleaning', slug: 'cleaning', icon: 'Sparkles', description: 'Deep house cleaning, office maintenance, and move-in/out services' },
  });
  const srvPlumbing = await prisma.serviceCategory.create({
    data: { name: 'Plumbing & Gas', slug: 'plumbing', icon: 'Droplets', description: 'Water leaks, drain cleaning, water heaters, and pipe repairs' },
  });
  const srvAutomotive = await prisma.serviceCategory.create({
    data: { name: 'Auto Repair & Mechanics', slug: 'automotive', icon: 'Car', description: 'Mobile mechanics, brakes, oil changes, and engine diagnostics' },
  });
  const srvBeauty = await prisma.serviceCategory.create({
    data: { name: 'Beauty & Barber Salon', slug: 'beauty', icon: 'Scissors', description: 'At-home haircuts, hair styling, nails, skincare, and spa treatments' },
  });
  const srvVeterinary = await prisma.serviceCategory.create({
    data: { name: 'Veterinary & Pet Care', slug: 'veterinary', icon: 'HeartHandshake', description: 'In-home vet checkups, pet grooming, nail trimming, and pet spa' },
  });
  const srvRestaurants = await prisma.serviceCategory.create({
    data: { name: 'Restaurants & Catering', slug: 'restaurants', icon: 'Utensils', description: 'Private chefs, event catering, gourmet meals, and live BBQ' },
  });
  const srvElectrical = await prisma.serviceCategory.create({
    data: { name: 'Electrical & Power', slug: 'electrical', icon: 'Zap', description: 'Electrical installations, breaker panels, EV chargers, and LED lighting' },
  });
  const srvLandscaping = await prisma.serviceCategory.create({
    data: { name: 'Landscaping & Yard Care', slug: 'landscaping', icon: 'Trees', description: 'Weekly lawn mowing, garden design, tree trimming, and patio care' },
  });

  // 5. Seed Marketplace Item Categories
  const mktElectronics = await prisma.marketplaceCategory.create({
    data: { name: 'Electronics & Tech', slug: 'electronics', icon: 'Laptop', description: 'Laptops, phones, TVs, cameras, gaming consoles' },
  });
  const mktFurniture = await prisma.marketplaceCategory.create({
    data: { name: 'Furniture & Home', slug: 'furniture', icon: 'Armchair', description: 'Sofas, tables, desks, beds, outdoor patio decor' },
  });
  const mktVehicles = await prisma.marketplaceCategory.create({
    data: { name: 'Vehicles & Automotive', slug: 'vehicles', icon: 'Car', description: 'Cars, trucks, SUVs, motorcycles, auto parts' },
  });
  const mktTools = await prisma.marketplaceCategory.create({
    data: { name: 'Tools & Equipment', slug: 'tools', icon: 'Wrench', description: 'Power tools, hand tools, lawn mowers, ladders' },
  });
  const mktFree = await prisma.marketplaceCategory.create({
    data: { name: 'Free Items', slug: 'free-stuff', icon: 'Gift', description: 'Free local curb pickups, boxes, surplus items' },
  });

  // Password for test users
  const passwordHash = await bcrypt.hash('password123', 10);

  // 6. Seed Users
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@norwalklocal.com',
      passwordHash,
      name: 'System Admin',
      role: 'ADMIN',
      activeRole: 'ADMIN',
      phone: '(203) 555-0100',
      isVerified: true,
      locationId: locSoNo.id,
    },
  });

  const empUser1 = await prisma.user.create({
    data: {
      email: 'hr@norwalkdistro.com',
      passwordHash,
      name: 'Marcus Vance',
      role: 'EMPLOYER',
      activeRole: 'EMPLOYER',
      phone: '(203) 555-0199',
      isVerified: true,
      bio: 'Operations & HR Director at Norwalk Logistics & Supply Co.',
      locationId: locCranbury.id,
    },
  });

  const empUser2 = await prisma.user.create({
    data: {
      email: 'hiring@soundviewmaritime.com',
      passwordHash,
      name: 'Chef Brenda Miller',
      role: 'EMPLOYER',
      activeRole: 'EMPLOYER',
      phone: '(203) 555-0177',
      isVerified: true,
      locationId: locRowayton.id,
    },
  });

  const providerUser1 = await prisma.user.create({
    data: {
      email: 'carlos@homerepair.com',
      passwordHash,
      name: 'Carlos Mendez',
      role: 'SERVICE_PROVIDER',
      activeRole: 'SERVICE_PROVIDER',
      phone: '(203) 555-0144',
      isVerified: true,
      bio: 'Licensed home contractor & general handyman serving Norwalk and lower Fairfield County.',
      avatarUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=400&q=80',
      locationId: locSoNo.id,
    },
  });

  const seekerUser1 = await prisma.user.create({
    data: {
      email: 'alex@user.com',
      passwordHash,
      name: 'Alex Rivera',
      role: 'JOB_SEEKER',
      activeRole: 'JOB_SEEKER',
      phone: '(203) 555-0122',
      bio: 'Experienced warehouse operator looking for full-time work and local tech deals in Norwalk.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      locationId: locEastNorwalk.id,
    },
  });

  const seekerUser2 = await prisma.user.create({
    data: {
      email: 'sarah@user.com',
      passwordHash,
      name: 'Sarah Jenkins',
      role: 'JOB_SEEKER',
      activeRole: 'SELLER',
      phone: '(203) 555-0133',
      bio: 'SoNo resident selling furniture, electronics, and home decor items.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      locationId: locSoNo.id,
    },
  });

  // 7. Seed Businesses
  const biz1 = await prisma.business.create({
    data: {
      ownerId: empUser1.id,
      name: 'Panadería Qué Delicia',
      logoUrl: '/images/empanada_bakery.png',
      coverUrl: '/images/empanada_bakery.png',
      description: 'Panadería artesanal en Norwalk. Deliciosas empanadas recién horneadas, pan fresco diario, café especial y repostería latina tradicional.',
      category: 'Panadería & Restaurante',
      isVerified: true,
      locationId: locSoNo.id,
    },
  });

  const biz2 = await prisma.business.create({
    data: {
      ownerId: empUser2.id,
      name: 'Soundview Maritime Bistro & Bar',
      logoUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=200&q=80',
      description: 'Waterfront dining destination offering fresh seafood, artisan cocktails, and private events.',
      category: 'Restaurant & Hospitality',
      isVerified: true,
      locationId: locRowayton.id,
    },
  });

  const biz3 = await prisma.business.create({
    data: {
      ownerId: empUser1.id,
      name: 'Stamford Executive Suites & Co-Working',
      logoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=200&q=80',
      description: 'Premium flexible office space and executive business service center in Fairfield County.',
      category: 'Office & Administration',
      isVerified: true,
      locationId: locStamfordDt.id,
    },
  });

  const biz4 = await prisma.business.create({
    data: {
      ownerId: empUser1.id,
      name: 'BrightVolt Electrical & Solar Solutions',
      logoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=80',
      description: 'Commercial and residential electrical contractors operating throughout lower Fairfield County.',
      category: 'Skilled Trades',
      isVerified: true,
      locationId: locEastNorwalk.id,
    },
  });

  const biz5 = await prisma.business.create({
    data: {
      ownerId: empUser2.id,
      name: 'Fairfield Family Dental & Wellness',
      logoUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=200&q=80',
      description: 'Modern comprehensive dental practice delivering gentle preventive care, cosmetics, and implants.',
      category: 'Healthcare',
      isVerified: true,
      locationId: locCranbury.id,
    },
  });

  const biz6 = await prisma.business.create({
    data: {
      ownerId: empUser1.id,
      name: 'Coastal Climate Control & HVAC',
      logoUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7ece?auto=format&fit=crop&w=200&q=80',
      description: 'Heating, ventilation, air conditioning, and indoor air quality specialists for homes and businesses.',
      category: 'Skilled Trades',
      isVerified: true,
      locationId: locEastNorwalk.id,
    },
  });

  const biz7 = await prisma.business.create({
    data: {
      ownerId: empUser2.id,
      name: 'SoNo Craft Coffee & Bakery',
      logoUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=200&q=80',
      description: 'Artisanal coffee roasters and fresh pastry bakery in the heart of South Norwalk.',
      category: 'Restaurant & Hospitality',
      isVerified: true,
      locationId: locSoNo.id,
    },
  });

  const biz8 = await prisma.business.create({
    data: {
      ownerId: empUser1.id,
      name: 'Soundbyte Software & Cloud Systems',
      logoUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=200&q=80',
      description: 'Innovative software agency developing web, cloud, and mobile enterprise software solutions.',
      category: 'Technology',
      isVerified: true,
      locationId: locStamfordHp.id,
    },
  });

  const biz9 = await prisma.business.create({
    data: {
      ownerId: empUser1.id,
      name: 'Metro Freight Express Lines',
      logoUrl: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=200&q=80',
      description: 'Full-service regional trucking, logistics, and freight delivery company serving New England.',
      category: 'Logistics',
      isVerified: true,
      locationId: locCranbury.id,
    },
  });

  const biz10 = await prisma.business.create({
    data: {
      ownerId: empUser2.id,
      name: 'Greenwich Shoreline Hotel & Resort',
      logoUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=200&q=80',
      description: 'Boutique luxury seaside resort offering fine dining, spa, and coastal guest accommodations.',
      category: 'Hospitality',
      isVerified: true,
      locationId: locGreenwichAve.id,
    },
  });

  // 8. Seed Jobs across Multiple Cities
  const jobsList = [
    // --- STAMFORD JOBS ---
    {
      businessId: biz3.id,
      postedById: empUser1.id,
      title: 'Senior Financial Analyst & Portfolio Specialist',
      categoryId: catOffice.id,
      description: 'Stamford Executive Financial Group is seeking an experienced Financial Analyst to conduct equity research, financial modeling, and asset management portfolios for Fairfield County clients.',
      salaryMin: 95000.00,
      salaryMax: 125000.00,
      salaryType: 'yearly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locStamfordDt.id,
    },
    {
      businessId: biz8.id,
      postedById: empUser1.id,
      title: 'Harbor Point Cloud & DevOps Engineer',
      categoryId: catTech.id,
      description: 'Join our Stamford Harbor Point tech center! Seeking a DevOps Engineer with AWS, Docker, and CI/CD pipeline automation experience. Flexible hybrid workspace.',
      salaryMin: 120000.00,
      salaryMax: 150000.00,
      salaryType: 'yearly',
      employmentType: 'full-time',
      schedule: 'flexible',
      isRemote: 'hybrid',
      status: 'active',
      locationId: locStamfordHp.id,
    },
    {
      businessId: biz3.id,
      postedById: empUser1.id,
      title: 'Front Desk Receptionist & Client Relations Specialist',
      categoryId: catOffice.id,
      description: 'Stamford Executive Suites seeks a polished Receptionist in Downtown Stamford. Handle executive calls, schedule conference rooms, and welcome VIP guests.',
      salaryMin: 20.00,
      salaryMax: 24.50,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locStamfordDt.id,
    },
    {
      businessId: biz3.id,
      postedById: empUser1.id,
      title: 'Commercial Real Estate Leasing Associate',
      categoryId: catOffice.id,
      description: 'Represent premium commercial properties in Stamford and Greenwich. Manage tenant inquiries, property showings, and commercial lease agreements.',
      salaryMin: 65000.00,
      salaryMax: 90000.00,
      salaryType: 'yearly',
      employmentType: 'full-time',
      schedule: 'flexible',
      isRemote: 'onsite',
      status: 'active',
      locationId: locStamfordDt.id,
    },
    {
      businessId: biz8.id,
      postedById: empUser1.id,
      title: 'Harbor Point Restaurant General Manager',
      categoryId: catHospitality.id,
      description: 'Lead high-volume waterfront dining operations at Harbor Point Stamford. Oversee floor staff, inventory, guest hospitality, and private events.',
      salaryMin: 72000.00,
      salaryMax: 88000.00,
      salaryType: 'yearly',
      employmentType: 'full-time',
      schedule: 'evening',
      isRemote: 'onsite',
      status: 'active',
      locationId: locStamfordHp.id,
    },

    // --- GREENWICH JOBS ---
    {
      businessId: biz10.id,
      postedById: empUser2.id,
      title: 'Greenwich Avenue Luxury Retail Boutique Manager',
      categoryId: catOffice.id,
      description: 'Greenwich Shoreline Retail Group is hiring a Manager for our high-end Greenwich Avenue store. Oversee luxury sales associates, merchandising, and VIP client loyalty programs.',
      salaryMin: 68000.00,
      salaryMax: 82000.00,
      salaryType: 'yearly',
      employmentType: 'full-time',
      schedule: 'flexible',
      isRemote: 'onsite',
      status: 'active',
      locationId: locGreenwichAve.id,
    },
    {
      businessId: biz10.id,
      postedById: empUser2.id,
      title: 'Guest Services & Front Desk Manager',
      categoryId: catHospitality.id,
      description: 'Boutique Greenwich coastal hotel seeking an exceptional Guest Services Manager. Coordinate concierge team, VIP arrivals, and luxury guest stays.',
      salaryMin: 64000.00,
      salaryMax: 78000.00,
      salaryType: 'yearly',
      employmentType: 'full-time',
      schedule: 'flexible',
      isRemote: 'onsite',
      status: 'active',
      locationId: locGreenwichAve.id,
    },
    {
      businessId: biz10.id,
      postedById: empUser2.id,
      title: 'Private Estate Grounds Manager & Landscaping Lead',
      categoryId: catTrades.id,
      description: 'Manage premium residential estate grounds in Old Greenwich. Oversee lawn care, horticulture, garden design, irrigation systems, and grounds staff.',
      salaryMin: 35.00,
      salaryMax: 45.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locOldGreenwich.id,
    },

    // --- DANBURY JOBS ---
    {
      businessId: biz9.id,
      postedById: empUser1.id,
      title: 'Danbury Auto Service & Fleet Center Lead',
      categoryId: catLogistics.id,
      description: 'Oversee vehicle diagnostics, preventative fleet maintenance, and service scheduling at our Danbury hub. Experience with heavy duty diesel and fleet software required.',
      salaryMin: 30.00,
      salaryMax: 38.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locDanburyFair.id,
    },
    {
      businessId: biz4.id,
      postedById: empUser1.id,
      title: 'Commercial Solar & Electrical Installer',
      categoryId: catTrades.id,
      description: 'BrightVolt Energy is expanding in Danbury! Install rooftop solar arrays, inverter systems, and commercial battery storage units.',
      salaryMin: 28.00,
      salaryMax: 36.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locDanburyFair.id,
    },

    // --- HARTFORD JOBS ---
    {
      businessId: biz5.id,
      postedById: empUser2.id,
      title: 'Capital City Healthcare Operations Coordinator',
      categoryId: catHealthcare.id,
      description: 'Manage patient scheduling, medical record compliance, insurance authorizations, and clinical administration in Downtown Hartford.',
      salaryMin: 26.00,
      salaryMax: 33.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locHartfordDt.id,
    },
    {
      businessId: biz3.id,
      postedById: empUser1.id,
      title: 'Commercial Insurance Claims Associate',
      categoryId: catOffice.id,
      description: 'Process commercial liability and property claims for Hartford insurance group. Strong analytical and communication skills required.',
      salaryMin: 65000.00,
      salaryMax: 80000.00,
      salaryType: 'yearly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'hybrid',
      status: 'active',
      locationId: locHartfordDt.id,
    },

    // --- NEW HAVEN JOBS ---
    {
      businessId: biz5.id,
      postedById: empUser2.id,
      title: 'Yale District Clinical Research & Lab Coordinator',
      categoryId: catHealthcare.id,
      description: 'Join a leading medical research team in New Haven! Coordinate clinical trials, manage patient data collection, and maintain lab protocols.',
      salaryMin: 62000.00,
      salaryMax: 76000.00,
      salaryType: 'yearly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locNewHavenYale.id,
    },
    {
      businessId: biz7.id,
      postedById: empUser2.id,
      title: 'New Haven Head Baker & Pastry Chef',
      categoryId: catHospitality.id,
      description: 'Craft artisanal sourdough breads, croissants, and gourmet pastries for busy New Haven cafe and wholesale accounts.',
      salaryMin: 24.00,
      salaryMax: 30.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locNewHavenYale.id,
    },

    // --- NEW YORK CITY JOBS ---
    {
      businessId: biz8.id,
      postedById: empUser1.id,
      title: 'Midtown Manhattan Senior Product Manager',
      categoryId: catTech.id,
      description: 'Lead product strategy, roadmap execution, and UX design for enterprise SaaS applications in Midtown NYC.',
      salaryMin: 140000.00,
      salaryMax: 175000.00,
      salaryType: 'yearly',
      employmentType: 'full-time',
      schedule: 'flexible',
      isRemote: 'hybrid',
      status: 'active',
      locationId: locManhattan.id,
    },
    {
      businessId: biz7.id,
      postedById: empUser2.id,
      title: 'Williamsburg Brooklyn Specialty Coffee Roaster',
      categoryId: catHospitality.id,
      description: 'Oversee small-batch coffee bean roasting, flavor profiling, and cupping sessions in Williamsburg Brooklyn.',
      salaryMin: 22.00,
      salaryMax: 28.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locBrooklyn.id,
    },

    // --- NORWALK JOBS ---
    {
      businessId: biz1.id,
      postedById: empUser1.id,
      title: 'Warehouse Operations & Forklift Specialist',
      categoryId: catLogistics.id,
      description: 'We are seeking a reliable Warehouse Specialist to join our morning shift team in Cranbury, Norwalk. Loading/unloading trucks and inventory management.',
      salaryMin: 21.50,
      salaryMax: 26.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locCranbury.id,
    },
    {
      businessId: biz2.id,
      postedById: empUser2.id,
      title: 'Senior Line Cook & Kitchen Sous Chef',
      categoryId: catHospitality.id,
      description: 'Soundview Maritime Bistro is hiring an experienced Sous Chef to lead line preparation and seafood plating in Rowayton, Norwalk.',
      salaryMin: 24.00,
      salaryMax: 30.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'evening',
      isRemote: 'onsite',
      status: 'active',
      locationId: locRowayton.id,
    },
    {
      businessId: biz4.id,
      postedById: empUser1.id,
      title: 'Journeyman Commercial & Residential Electrician',
      categoryId: catTrades.id,
      description: 'BrightVolt Electrical is looking for an E-2 licensed Journeyman Electrician in East Norwalk. Conduit, main panels, EV chargers.',
      salaryMin: 38.00,
      salaryMax: 48.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locEastNorwalk.id,
    },
    {
      businessId: biz5.id,
      postedById: empUser2.id,
      title: 'Licensed Registered Dental Hygienist (RDH)',
      categoryId: catHealthcare.id,
      description: 'Join our friendly dental practice in Cranbury Norwalk! Digital x-rays, periodontal maintenance, and intraoral scanning.',
      salaryMin: 45.00,
      salaryMax: 54.00,
      salaryType: 'hourly',
      employmentType: 'part-time',
      schedule: 'flexible',
      isRemote: 'onsite',
      status: 'active',
      locationId: locCranbury.id,
    },
    {
      businessId: biz6.id,
      postedById: empUser1.id,
      title: 'HVAC Service Technician & Maintenance Specialist',
      categoryId: catTrades.id,
      description: 'Coastal Climate Control is hiring an HVAC Technician with S-2/D-2 license in East Norwalk.',
      salaryMin: 32.00,
      salaryMax: 42.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locEastNorwalk.id,
    },
    {
      businessId: biz7.id,
      postedById: empUser2.id,
      title: 'Lead Barista & Morning Cafe Supervisor',
      categoryId: catHospitality.id,
      description: 'Prepare espresso drinks and manage morning workflow in Historic SoNo Norwalk.',
      salaryMin: 18.50,
      salaryMax: 23.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locSoNo.id,
    },
    {
      businessId: biz9.id,
      postedById: empUser1.id,
      title: 'Local CDL Class B Delivery Truck Driver',
      categoryId: catLogistics.id,
      description: 'Metro Freight Express needs a CDL Class B Driver for local routes in Southern CT. Clean driving record required.',
      salaryMin: 28.00,
      salaryMax: 34.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locCranbury.id,
    },
    {
      businessId: biz1.id,
      postedById: empUser1.id,
      title: 'Inventory Control Manager & Shipping Coordinator',
      categoryId: catLogistics.id,
      description: 'Oversee daily inbound receiving, stock counts, and outbound shipping schedules at our Norwalk hub.',
      salaryMin: 27.00,
      salaryMax: 33.00,
      salaryType: 'hourly',
      employmentType: 'full-time',
      schedule: 'morning',
      isRemote: 'onsite',
      status: 'active',
      locationId: locCranbury.id,
    },
  ];

  for (const jobData of jobsList) {
    await prisma.job.create({ data: jobData });
  }

  // 9. Seed Services (Multi-City)
  const servicesList = [
    // Norwalk Services
    {
      providerId: providerUser1.id,
      name: 'Carlos General Handyman & Home Repairs',
      categoryId: srvHandyman.id,
      description: 'Expert residential repairs including TV wall mounting, door lock replacement, drywall patching, and deck staining.',
      pricingType: 'starting_at',
      priceAmount: 75.0,
      serviceAreaRadius: 15,
      rating: 4.9,
      reviewCount: 28,
      locationId: locSoNo.id,
    },
    {
      providerId: providerUser1.id,
      name: 'Norwalk Precision Auto Repair & Mobile Mechanics',
      categoryId: srvAutomotive.id,
      description: 'Computerized mobile vehicle diagnostics, brake replacement, alternators, batteries, and express engine tune-ups.',
      pricingType: 'starting_at',
      priceAmount: 60.0,
      serviceAreaRadius: 20,
      rating: 4.95,
      reviewCount: 42,
      locationId: locEastNorwalk.id,
    },
    {
      providerId: empUser2.id,
      name: 'BellaStyle Mobile Beauty, Hair & Salon',
      categoryId: srvBeauty.id,
      description: 'Professional mobile haircuts, event hair styling, manicures, pedicures, and premium hair treatments.',
      pricingType: 'starting_at',
      priceAmount: 45.0,
      serviceAreaRadius: 12,
      rating: 4.88,
      reviewCount: 35,
      locationId: locRowayton.id,
    },
    {
      providerId: providerUser1.id,
      name: 'Dr. Pet Grooming & At-Home Veterinary Care',
      categoryId: srvVeterinary.id,
      description: 'In-home medical vet checkups, pet vaccinations, ear cleaning, nail trimming, and complete pet spa.',
      pricingType: 'starting_at',
      priceAmount: 55.0,
      serviceAreaRadius: 15,
      rating: 5.0,
      reviewCount: 19,
      locationId: locCranbury.id,
    },
    {
      providerId: empUser2.id,
      name: 'Flavors & Traditions Private Chef & Event Catering',
      categoryId: srvRestaurants.id,
      description: 'Private event catering, family banquets, gourmet taco bars, live BBQ grilling, and customized menus.',
      pricingType: 'starting_at',
      priceAmount: 120.0,
      serviceAreaRadius: 25,
      rating: 4.92,
      reviewCount: 51,
      locationId: locSoNo.id,
    },

    // Stamford Services
    {
      providerId: providerUser1.id,
      name: 'Stamford Pro Handyman & Drywall Specialist',
      categoryId: srvHandyman.id,
      description: 'Downtown Stamford home repair, furniture assembly, TV wall mounting, shelf installation, and paint touchups.',
      pricingType: 'starting_at',
      priceAmount: 80.0,
      serviceAreaRadius: 15,
      rating: 4.94,
      reviewCount: 36,
      locationId: locStamfordDt.id,
    },
    {
      providerId: providerUser1.id,
      name: 'Harbor Point Mobile Auto Care & Detailing',
      categoryId: srvAutomotive.id,
      description: 'On-site mobile car washing, ceramic coating, interior steam cleaning, and oil changes in Stamford CT.',
      pricingType: 'starting_at',
      priceAmount: 70.0,
      serviceAreaRadius: 15,
      rating: 4.89,
      reviewCount: 29,
      locationId: locStamfordHp.id,
    },
    {
      providerId: providerUser1.id,
      name: 'Stamford Executive Office & House Deep Cleaning',
      categoryId: srvCleaning.id,
      description: 'Commercial office janitorial maintenance, residential deep cleaning, and sanitization services.',
      pricingType: 'starting_at',
      priceAmount: 95.0,
      serviceAreaRadius: 20,
      rating: 4.96,
      reviewCount: 48,
      locationId: locStamfordDt.id,
    },

    // Greenwich Services
    {
      providerId: providerUser1.id,
      name: 'Greenwich Avenue Premier Landscaping & Tree Care',
      categoryId: srvLandscaping.id,
      description: 'High-end estate lawn care, garden design, seasonal planting, hedge trimming, and outdoor lighting.',
      pricingType: 'starting_at',
      priceAmount: 110.0,
      serviceAreaRadius: 15,
      rating: 4.98,
      reviewCount: 44,
      locationId: locGreenwichAve.id,
    },
    {
      providerId: providerUser1.id,
      name: 'Greenwich Master Plumber & Gas Specialist',
      categoryId: srvPlumbing.id,
      description: 'Emergency plumbing repairs, tankless water heater installation, pipe unclogging, and leak detection.',
      pricingType: 'starting_at',
      priceAmount: 95.0,
      serviceAreaRadius: 20,
      rating: 4.91,
      reviewCount: 31,
      locationId: locOldGreenwich.id,
    },
    {
      providerId: empUser2.id,
      name: 'Greenwich Luxury Private Dining & Chef Service',
      categoryId: srvRestaurants.id,
      description: 'Executive private chef experiences, gourmet tasting menus, and intimate dinner party catering.',
      pricingType: 'starting_at',
      priceAmount: 150.0,
      serviceAreaRadius: 25,
      rating: 5.0,
      reviewCount: 27,
      locationId: locGreenwichAve.id,
    },

    // Danbury & NYC Services
    {
      providerId: providerUser1.id,
      name: 'Danbury Electrical & EV Charger Installation',
      categoryId: srvElectrical.id,
      description: 'Tesla & universal EV charger installs, 200A main electrical panel upgrades, and smart home lighting.',
      pricingType: 'starting_at',
      priceAmount: 85.0,
      serviceAreaRadius: 20,
      rating: 4.87,
      reviewCount: 18,
      locationId: locDanburyFair.id,
    },
    {
      providerId: providerUser1.id,
      name: 'Manhattan & Brooklyn Express Appliance Repair',
      categoryId: srvHandyman.id,
      description: 'Same-day refrigerator, washer/dryer, oven, and dishwasher repair in NYC and Brooklyn.',
      pricingType: 'starting_at',
      priceAmount: 85.0,
      serviceAreaRadius: 15,
      rating: 4.93,
      reviewCount: 52,
      locationId: locManhattan.id,
    },
  ];

  for (const srvData of servicesList) {
    await prisma.service.create({ data: srvData });
  }

  // 10. Seed Marketplace Items (Multi-City & Mixed)
  const itemsList = [
    // Norwalk Marketplace
    {
      sellerId: seekerUser2.id,
      title: 'Apple MacBook Pro 16" (M1 Pro / 16GB RAM / 512GB SSD)',
      categoryId: mktElectronics.id,
      description: 'Space Gray MacBook Pro in pristine condition. Comes with original Apple MagSafe charger and leather sleeve. Battery health is at 92%. Perfect for local students or creative work.',
      price: 850.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=600&q=80',
        'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locSoNo.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Mid-Century Modern Italian Top-Grain Leather Sofa',
      categoryId: mktFurniture.id,
      description: 'Cognac brown genuine leather sofa. 84 inches long. Bought from West Elm 2 years ago. Super comfortable, smoke-free home in South Norwalk. Local pickup only.',
      price: 450.0,
      condition: 'GOOD',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locSoNo.id,
    },
    {
      sellerId: providerUser1.id,
      title: 'DeWalt 20V MAX Cordless Power Tool 5-Tool Combo Kit',
      categoryId: mktTools.id,
      description: 'Includes Hammer Drill, Impact Driver, Circular Saw, Reciprocating Saw, Work Light, two 4.0Ah Lithium Ion batteries, and heavy duty contractor bag.',
      price: 260.0,
      condition: 'GOOD',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locEastNorwalk.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Samsung 65" QLED 4K Smart TV (2023 Model)',
      categoryId: mktElectronics.id,
      description: 'Stunning 4K QLED display with Quantum HDR. Includes smart remote and wall mount bracket. South Norwalk pickup.',
      price: 520.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locSoNo.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Nespresso VertuoPlus Coffee Machine + Milk Frother',
      categoryId: mktElectronics.id,
      description: 'Brews rich espresso and coffee. Includes Aeroccino3 milk frother and 2 boxes of coffee pods. Rowayton pickup.',
      price: 85.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locRowayton.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Yeti Tundra 45 Hard Cooler (Desert Tan)',
      categoryId: mktTools.id,
      description: 'Legendary Yeti ice retention. Heavy duty rotomolded construction. Great condition for beach or fishing trips.',
      price: 210.0,
      condition: 'GOOD',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locCranbury.id,
    },

    // Stamford Marketplace
    {
      sellerId: seekerUser2.id,
      title: 'Sony PlayStation 5 Disc Edition + 2 Controllers',
      categoryId: mktElectronics.id,
      description: 'PS5 console in excellent condition. Comes with DualSense controllers, HDMI 2.1 cable, and original box. Stamford Harbor Point pickup.',
      price: 390.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locStamfordHp.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Solid Oak Executive Desk with Storage Drawers',
      categoryId: mktFurniture.id,
      description: 'Sturdy natural oak desk for home office. 60x30 inches. Downtown Stamford apartment pickup.',
      price: 220.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locStamfordDt.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Apple iPad Air 5th Gen (64GB, M1 Chip, Blue) + Apple Pencil 2',
      categoryId: mktElectronics.id,
      description: 'M1 powered iPad Air with Retina display. Includes Apple Pencil 2nd gen and magnetic smart folio cover. Stamford pickup.',
      price: 420.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locStamfordDt.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Herman Miller Aeron Ergonomic Office Chair (Size B)',
      categoryId: mktFurniture.id,
      description: 'Full spec Aeron chair with posturefit, fully adjustable armrests, and lumbar support. Stamford Harbor Point pickup.',
      price: 550.0,
      condition: 'GOOD',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locStamfordHp.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Bose QuietComfort Ultra Wireless Headphones (Black)',
      categoryId: mktElectronics.id,
      description: 'World-class noise cancelling headphones. Includes hard carrying case and audio cable. Downtown Stamford pickup.',
      price: 260.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locStamfordDt.id,
    },

    // Greenwich Marketplace
    {
      sellerId: seekerUser2.id,
      title: 'Specialized S-Works Carbon Fiber Road Bike',
      categoryId: mktVehicles.id,
      description: 'High-end lightweight road bike. Shimano Dura-Ace groupset. Size 54cm. Old Greenwich pickup.',
      price: 1850.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locOldGreenwich.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Peloton Bike+ with 24" HD Rotating Touchscreen',
      categoryId: mktTools.id,
      description: 'Peloton Bike+ with auto-follow resistance, rotating screen, and dumbell set. Greenwich Avenue pickup.',
      price: 890.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locGreenwichAve.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Restoration Hardware Concrete Outdoor Dining Table & 6 Chairs',
      categoryId: mktFurniture.id,
      description: 'Weatherproof sealed concrete dining table (84") with 6 teak dining armchairs. Old Greenwich pickup.',
      price: 1250.0,
      condition: 'GOOD',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locOldGreenwich.id,
    },

    // Danbury & NYC Marketplace
    {
      sellerId: providerUser1.id,
      title: 'Husqvarna 24 HP Riding Lawn Mower (48" Deck)',
      categoryId: mktTools.id,
      description: 'Commercial grade riding mower in Danbury. Hydrostatic transmission, fresh oil change and new blades.',
      price: 1200.0,
      condition: 'GOOD',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locDanburyFair.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Canon EOS R6 Mark II Mirrorless Camera Body',
      categoryId: mktElectronics.id,
      description: 'Professional 24.2MP full-frame camera. Shutter count under 5,000. NYC Manhattan pickup.',
      price: 1650.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locManhattan.id,
    },
    {
      sellerId: seekerUser2.id,
      title: 'Apple iPhone 15 Pro 128GB Natural Titanium (Unlocked)',
      categoryId: mktElectronics.id,
      description: 'Factory unlocked iPhone 15 Pro in flawless condition. Includes box and USB-C cable. Manhattan NYC pickup.',
      price: 780.0,
      condition: 'LIKE_NEW',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locManhattan.id,
    },
    {
      sellerId: providerUser1.id,
      title: 'Makita 18V LXT Cordless Circular Saw & Hammer Drill Kit',
      categoryId: mktTools.id,
      description: 'Professional contractor grade tool set. Includes 2 batteries, charger, and hard case. Danbury pickup.',
      price: 195.0,
      condition: 'GOOD',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&w=600&q=80',
      ]),
      status: 'AVAILABLE',
      locationId: locDanburyFair.id,
    },
  ];

  for (const itemData of itemsList) {
    const createdItem = await prisma.marketplaceItem.create({ data: itemData });
    if (createdItem.title.includes('MacBook')) {
      await prisma.itemOffer.create({
        data: {
          itemId: createdItem.id,
          buyerId: seekerUser1.id,
          sellerId: seekerUser2.id,
          offerAmount: 780.0,
          message: 'Hi Sarah, can pick up today in SoNo with cash or Venmo if you accept $780!',
          status: 'PENDING',
        },
      });
    }
  }

  console.log('✅ Norwalk, CT Database successfully seeded!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
