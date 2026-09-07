'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  UserPlus,
  Mail,
  Key,
  User,
  Phone,
  ShieldAlert,
  Building2,
  CheckCircle2,
  Circle,
  ArrowRight,
  ChevronLeft,
  Store,
  MapPin,
  Globe,
  FileText,
  Tag,
  ShieldCheck,
  Users,
  Clock,
  Award,
  Image as ImageIcon,
  Upload,
  ChevronDown,
  Check,
} from 'lucide-react';
import Navbar from '@/components/Navbar';

const OPEN_TIME_OPTIONS = [
  '5:00 AM',
  '5:30 AM',
  '6:00 AM',
  '6:30 AM',
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
];

const CLOSE_TIME_OPTIONS = [
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '5:30 PM',
  '6:00 PM',
  '6:30 PM',
  '7:00 PM',
  '7:30 PM',
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
  '10:00 PM',
  '11:00 PM',
  '12:00 AM',
];

interface CustomTimePickerProps {
  label: string;
  labelColor: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  iconColor: string;
  activeBgColor: string;
}

function CustomTimePicker({ label, labelColor, value, onChange, options, iconColor, activeBgColor }: CustomTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative' }}>
      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: labelColor, marginBottom: '0.35rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        {label}
      </label>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: '#FFFFFF',
          border: isOpen ? `2px solid ${iconColor}` : '1px solid #CBD5E1',
          borderRadius: '10px',
          padding: '0.65rem 0.85rem',
          cursor: 'pointer',
          boxShadow: isOpen ? '0 4px 14px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.04)',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Clock size={17} color={iconColor} />
          <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>{value}</span>
        </div>
        <ChevronDown size={16} color="#64748B" style={{ transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            zIndex: 100,
            marginTop: '6px',
            backgroundColor: '#FFFFFF',
            borderRadius: '14px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 12px 28px -4px rgba(0, 0, 0, 0.15)',
            maxHeight: '230px',
            overflowY: 'auto',
            padding: '6px',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {options.map((opt) => {
              const isSelected = opt === value;
              return (
                <div
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    backgroundColor: isSelected ? activeBgColor : 'transparent',
                    color: isSelected ? iconColor : '#1E293B',
                    fontWeight: isSelected ? 800 : 600,
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = '#F8FAFC';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{opt}</span>
                  {isSelected && <Check size={16} color={iconColor} strokeWidth={3} />}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const BUSINESS_PHOTO_PRESETS = [
  { label: 'Bakery & Food', url: '/images/empanada_bakery.png' },
  { label: 'Restaurant & Dining', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80' },
  { label: 'Construction & Trades', url: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80' },
  { label: 'Retail & Storefront', url: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80' },
  { label: 'Logistics & Trucking', url: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80' },
  { label: 'Beauty & Salon', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80' },
  { label: 'Auto Repair Shop', url: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=800&q=80' },
  { label: 'Cleaning & Services', url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80' },
];

const US_STATES_DICT: Record<string, { name: string; cities: { name: string; zip: string; neighborhoods: string[] }[] }> = {
  CT: {
    name: 'Connecticut (CT)',
    cities: [
      { name: 'Norwalk', zip: '06854', neighborhoods: ['South Norwalk (SoNo)', 'Downtown Norwalk', 'East Norwalk', 'Cranbury', 'West Norwalk', 'Rowayton', 'Central Norwalk'] },
      { name: 'Stamford', zip: '06901', neighborhoods: ['Downtown Stamford', 'Harbor Point', 'Glenbrook', 'Springdale', 'Shippan Point', 'North Stamford'] },
      { name: 'Greenwich', zip: '06830', neighborhoods: ['Downtown Greenwich', 'Old Greenwich', 'Cos Cob', 'Riverside'] },
      { name: 'Bridgeport', zip: '06604', neighborhoods: ['Black Rock', 'Downtown Bridgeport', 'North End', 'East Side'] },
      { name: 'Danbury', zip: '06810', neighborhoods: ['Downtown Danbury', 'West Lake', 'Danbury Fair', 'Germantown'] },
      { name: 'Fairfield', zip: '06824', neighborhoods: ['Fairfield Center', 'Southport', 'Greenfield Hill', 'Stratfield'] },
      { name: 'Westport', zip: '06880', neighborhoods: ['Westport Center', 'Saugatuck', 'Greens Farms', 'Compo Beach'] },
      { name: 'Milford', zip: '06460', neighborhoods: ['Downtown Milford', 'Devon', 'Woodmont'] },
      { name: 'New Haven', zip: '06510', neighborhoods: ['Downtown New Haven', 'Yale Campus', 'East Rock', 'Wooster Square'] },
      { name: 'Hartford', zip: '06103', neighborhoods: ['Downtown Hartford', 'Asylum Hill', 'West End'] },
    ],
  },
  NY: {
    name: 'New York (NY)',
    cities: [
      { name: 'New York City', zip: '10001', neighborhoods: ['Manhattan', 'Brooklyn', 'Queens', 'The Bronx', 'Staten Island'] },
      { name: 'White Plains', zip: '10601', neighborhoods: ['Downtown White Plains', 'North White Plains', 'Highlands'] },
      { name: 'Yonkers', zip: '10701', neighborhoods: ['Waterfront', 'Getty Square', 'Crestwood'] },
      { name: 'Albany', zip: '12207', neighborhoods: ['Downtown Albany', 'Center Square', 'Pine Hills'] },
    ],
  },
  NJ: {
    name: 'New Jersey (NJ)',
    cities: [
      { name: 'Jersey City', zip: '07302', neighborhoods: ['Downtown Jersey City', 'Journal Square', 'Paulus Hook'] },
      { name: 'Newark', zip: '07102', neighborhoods: ['Downtown Newark', 'Ironbound', 'University Heights'] },
      { name: 'Hoboken', zip: '07030', neighborhoods: ['Washington St', 'Waterfront', 'Uptown'] },
    ],
  },
  MA: {
    name: 'Massachusetts (MA)',
    cities: [
      { name: 'Boston', zip: '02108', neighborhoods: ['Back Bay', 'Beacon Hill', 'Seaport', 'South End'] },
      { name: 'Cambridge', zip: '02138', neighborhoods: ['Harvard Square', 'Kendall Square', 'Central Square'] },
    ],
  },
};

const CITY_STREETS_DATABASE: Record<string, string[]> = {
  Norwalk: ['Washington St', 'Water St', 'Wall St', 'Connecticut Ave', 'Main Ave', 'West Ave', 'High St', 'Dr Martin Luther King Jr Dr', 'Highland Ave', 'Post Rd'],
  Stamford: ['Atlantic St', 'Summer St', 'Bedford St', 'Washington Blvd', 'Broad St', 'High Ridge Rd', 'Long Ridge Rd', 'Tresser Blvd', 'Hope St'],
  Greenwich: ['Greenwich Ave', 'Post Rd', 'Field Point Rd', 'Mason St', 'Dearfield Dr', 'East Putnam Ave'],
  Bridgeport: ['Main St', 'Fairfield Ave', 'State St', 'Park Ave', 'Boston Ave', 'Barnum Ave'],
  Danbury: ['Main St', 'Federal Rd', 'Mill Plain Rd', 'Danbury Fair Mall', 'Lake Ave Extended'],
  Fairfield: ['Post Rd', 'Black Rock Tpke', 'Fairfield Beach Rd', 'Unquowa Rd'],
  Westport: ['Post Rd E', 'Post Rd W', 'Riverside Ave', 'Saugatuck Ave', 'Main St'],
  'New York City': ['Broadway', 'Fifth Ave', 'Madison Ave', 'Lexington Ave', 'Wall St', '7th Ave', '42nd St', 'Canal St'],
};

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [role, setRole] = useState<'JOB_SEEKER' | 'EMPLOYER'>('JOB_SEEKER');

  // Step 2 Fields: Owner/User Info
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const name = `${firstName.trim()} ${lastName.trim()}`.trim();
  const [ownerTitle, setOwnerTitle] = useState('Business Owner / Founder');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  // Step 3 Fields: Business Info & MANDATORY Photo
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');

  // Location Fields
  const [businessState, setBusinessState] = useState('CT');
  const [businessCity, setBusinessCity] = useState('Norwalk');
  const [businessNeighborhood, setBusinessNeighborhood] = useState('South Norwalk (SoNo)');
  const [businessAddress, setBusinessAddress] = useState('');
  const [showAddressSuggestions, setShowAddressSuggestions] = useState(false);

  const [businessPhone, setBusinessPhone] = useState('');
  const [businessWebsite, setBusinessWebsite] = useState('');
  const [businessLogoUrl, setBusinessLogoUrl] = useState('/images/empanada_bakery.png');

  const [companySize, setCompanySize] = useState('1 - 10 employees');
  const [operatingDays, setOperatingDays] = useState('');
  const [openTime, setOpenTime] = useState('7:00 AM');
  const [closeTime, setCloseTime] = useState('7:00 PM');
  const [operatingHours, setOperatingHours] = useState('');
  const [hiringGoal, setHiringGoal] = useState('Hiring Full-time & Part-time Staff');

  // Step 5 Fields: Terms & Submit
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const addressWrapperRef = useRef<HTMLDivElement>(null);

  const [isRestored, setIsRestored] = useState(false);

  // Automatically scroll to top of window whenever step changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  // Restore draft state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = sessionStorage.getItem('postplace_register_draft');
        if (saved) {
          const data = JSON.parse(saved);
          if (data.step) setStep(data.step);
          if (data.role) setRole(data.role);
          if (data.firstName) setFirstName(data.firstName);
          if (data.lastName) setLastName(data.lastName);
          if (data.name && (!data.firstName || !data.lastName)) {
            const parts = data.name.trim().split(' ');
            setFirstName(parts[0] || '');
            setLastName(parts.slice(1).join(' ') || '');
          }
          if (data.ownerTitle) setOwnerTitle(data.ownerTitle);
          if (data.email) setEmail(data.email);
          if (data.password) setPassword(data.password);
          if (data.phone) setPhone(data.phone);
          if (data.businessName) setBusinessName(data.businessName);
          if (data.businessCategory) setBusinessCategory(data.businessCategory);
          if (data.businessDescription) setBusinessDescription(data.businessDescription);
          if (data.businessState) setBusinessState(data.businessState);
          if (data.businessCity) setBusinessCity(data.businessCity);
          if (data.businessNeighborhood) setBusinessNeighborhood(data.businessNeighborhood);
          if (data.businessAddress) setBusinessAddress(data.businessAddress);
          if (data.businessPhone) setBusinessPhone(data.businessPhone);
          if (data.businessWebsite) setBusinessWebsite(data.businessWebsite);
          if (data.businessLogoUrl) setBusinessLogoUrl(data.businessLogoUrl);
          if (data.companySize) setCompanySize(data.companySize);
          if (data.operatingDays) setOperatingDays(data.operatingDays);
          if (data.openTime) setOpenTime(data.openTime);
          if (data.closeTime) setCloseTime(data.closeTime);
          if (data.operatingHours) setOperatingHours(data.operatingHours);
          if (data.hiringGoal) setHiringGoal(data.hiringGoal);
        }
      } catch (e) {
        console.error('Draft restore failed', e);
      } finally {
        setIsRestored(true);
      }
    }
  }, []);

  // Save form draft to sessionStorage automatically (only after initial restore is complete)
  useEffect(() => {
    if (!isRestored) return;
    if (typeof window !== 'undefined') {
      const draft = {
        step,
        role,
        firstName,
        lastName,
        name,
        ownerTitle,
        email,
        password,
        phone,
        businessName,
        businessCategory,
        businessDescription,
        businessState,
        businessCity,
        businessNeighborhood,
        businessAddress,
        businessPhone,
        businessWebsite,
        businessLogoUrl,
        companySize,
        operatingDays,
        openTime,
        closeTime,
        operatingHours,
        hiringGoal,
      };
      sessionStorage.setItem('postplace_register_draft', JSON.stringify(draft));
    }
  }, [
    isRestored, step, role, firstName, lastName, name, ownerTitle, email, password, phone,
    businessName, businessCategory, businessDescription,
    businessState, businessCity, businessNeighborhood, businessAddress,
    businessPhone, businessWebsite, businessLogoUrl,
    companySize, operatingDays, openTime, closeTime, operatingHours, hiringGoal
  ]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addressWrapperRef.current && !addressWrapperRef.current.contains(event.target as Node)) {
        setShowAddressSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // When State changes, update default City and Neighborhood
  const handleStateChange = (newState: string) => {
    setBusinessState(newState);
    const availableCities = US_STATES_DICT[newState]?.cities || [];
    if (availableCities.length > 0) {
      const firstCity = availableCities[0];
      setBusinessCity(firstCity.name);
      setBusinessNeighborhood(firstCity.neighborhoods[0] || 'Central');
    }
  };

  // When City changes, update default Neighborhood
  const handleCityChange = (newCity: string) => {
    setBusinessCity(newCity);
    const cityData = US_STATES_DICT[businessState]?.cities.find((c) => c.name === newCity);
    if (cityData && cityData.neighborhoods.length > 0) {
      setBusinessNeighborhood(cityData.neighborhoods[0]);
    }
  };

  // Generate realistic street address suggestions based on search query
  const matchingSuggestions = React.useMemo(() => {
    if (!businessAddress || businessAddress.trim().length < 1) return [];

    const q = businessAddress.trim();
    const qLower = q.toLowerCase();

    const streets = CITY_STREETS_DATABASE[businessCity] || ['Washington St', 'Main Ave', 'Water St', 'Wall St', 'Post Rd', 'Connecticut Ave'];
    
    // Check if user started with a number e.g. "66" or "102"
    const numMatch = q.match(/^(\d+)\s*(.*)$/);
    const numberPrefix = numMatch ? numMatch[1] : '';
    const textQuery = numMatch ? numMatch[2].toLowerCase() : qLower;

    const cityData = US_STATES_DICT[businessState]?.cities.find((c) => c.name === businessCity);
    const zip = cityData?.zip || '06854';
    const neighborhoods = cityData?.neighborhoods || ['Central'];

    const results: { street: string; neighborhood: string; city: string; state: string; zip: string }[] = [];

    // Filter streets matching textQuery
    const matchedStreets = streets.filter((st) => !textQuery || st.toLowerCase().includes(textQuery));

    if (matchedStreets.length > 0) {
      matchedStreets.forEach((st, idx) => {
        const fullStreetNumber = numberPrefix ? numberPrefix : `${(idx + 1) * 25}`;
        const neigh = neighborhoods[idx % neighborhoods.length];
        results.push({
          street: `${fullStreetNumber} ${st}`,
          neighborhood: neigh,
          city: businessCity,
          state: businessState,
          zip: zip,
        });
      });
    } else {
      // If user typed a custom street name not in list e.g. "66 Ocean Dr"
      let formattedStreet = q;
      if (numberPrefix && !textQuery) {
        formattedStreet = `${numberPrefix} Washington St`;
      } else if (!q.match(/(St|Ave|Rd|Blvd|Dr|Ln|Way|Ct|Pl|Pkwy)$/i)) {
        formattedStreet = `${q} St`;
      }
      results.push({
        street: formattedStreet,
        neighborhood: neighborhoods[0] || 'Central',
        city: businessCity,
        state: businessState,
        zip: zip,
      });
    }

    return results.slice(0, 5);
  }, [businessAddress, businessCity, businessState]);

  const selectAddressSuggestion = (item: { street: string; neighborhood: string; city: string; state: string; zip: string }) => {
    setBusinessAddress(item.street);
    if (item.state) setBusinessState(item.state);
    if (item.city) setBusinessCity(item.city);
    if (item.neighborhood) setBusinessNeighborhood(item.neighborhood);
    setShowAddressSuggestions(false);
  };

  const handleLogoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setBusinessLogoUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Step 2 Validation
  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!firstName.trim() || !lastName.trim() || !email || !phone.trim() || !password) {
      setError('Please fill in your first name, last name, email, phone number, and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (role === 'EMPLOYER') {
      setStep(3);
    } else {
      executeRegistration();
    }
  };

  // Step 3 Validation (Mandatory Photo Check)
  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!businessName) {
      setError('Please enter your official business name.');
      return;
    }

    if (!businessCategory) {
      setError('Please select a business category.');
      return;
    }

    if (!businessLogoUrl || businessLogoUrl.trim() === '') {
      setError('A business photo or logo is mandatory. Please upload an image or select a preset photo below.');
      return;
    }

    setStep(4);
  };

  // Step 4 Validation
  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setStep(5);
  };

  // Step 5 Validation & Submission
  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!agreedToTerms) {
      setError('Please accept the Business Account Terms & Authorization agreement to proceed.');
      return;
    }

    executeRegistration();
  };

  const executeRegistration = async () => {
    setError('');
    setLoading(true);

    try {
      const payload: any = {
        name,
        email,
        password,
        phone,
        role,
      };

      if (role === 'EMPLOYER') {
        payload.businessDetails = {
          name: businessName,
          category: businessCategory,
          description: businessDescription || `${businessName} operating in ${businessCity}, ${businessState}.`,
          address: businessAddress,
          neighborhood: businessNeighborhood,
          city: businessCity,
          state: businessState,
          phone: businessPhone || phone,
          website: businessWebsite,
          logoUrl: businessLogoUrl,
          companySize,
          operatingHours,
          hiringGoal,
          ownerTitle,
        };
      }

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      // Clear draft on successful registration
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('postplace_register_draft');
      }

      router.push(role === 'EMPLOYER' ? '/employer/dashboard' : '/');
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const currentCitiesList = US_STATES_DICT[businessState]?.cities || [];
  const currentCityObj = currentCitiesList.find((c) => c.name === businessCity) || currentCitiesList[0];
  const currentNeighborhoods = currentCityObj?.neighborhoods || [];

  return (
    <>
      <Navbar />
      <main className="container" style={{ padding: '3rem 1.25rem', maxWidth: step === 1 ? '680px' : '660px', transition: 'all 0.3s ease' }}>
        <div className="search-box-wrapper" style={{ padding: '2.25rem 2rem' }}>

          {/* Dynamic Progress Indicator Header - Only shown from Step 2 onwards */}
          {step > 1 ? (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                  <span style={{
                    fontSize: '0.725rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    color: '#E05638',
                    backgroundColor: '#FFF4F1',
                    border: '1px solid #FFDDD5',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '6px',
                    letterSpacing: '0.5px',
                  }}>
                    Step {step} of {role === 'EMPLOYER' ? 5 : 2}
                  </span>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                    {step === 2 && (role === 'EMPLOYER' ? 'Owner Credentials' : 'Personal Details')}
                    {step === 3 && 'Business Profile & Photo'}
                    {step === 4 && 'Operations & Verification'}
                    {step === 5 && 'Review & Confirm'}
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#64748B' }}>
                  {Math.round((step / (role === 'EMPLOYER' ? 5 : 2)) * 100)}% Completed
                </span>
              </div>

              {/* Progress Bar Container */}
              <div style={{ width: '100%', height: '7px', backgroundColor: '#F1F5F9', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${(step / (role === 'EMPLOYER' ? 5 : 2)) * 100}%`,
                    backgroundColor: '#E05638',
                    borderRadius: '10px',
                    transition: 'width 0.35s ease',
                  }}
                />
              </div>

              {/* Compact Step Titles Row */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.65rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669' }}>
                  ✓ 1. Account Type
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: step >= 2 ? 700 : 500, color: step >= 2 ? '#E05638' : '#94A3B8' }}>
                  2. {role === 'EMPLOYER' ? 'Owner Details' : 'Personal Details'}
                </span>
                {role === 'EMPLOYER' && (
                  <>
                    <span style={{ fontSize: '0.75rem', fontWeight: step >= 3 ? 700 : 500, color: step >= 3 ? '#E05638' : '#94A3B8' }}>
                      3. Business Profile
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: step >= 4 ? 700 : 500, color: step >= 4 ? '#E05638' : '#94A3B8' }}>
                      4. Operations
                    </span>
                    <span style={{ fontSize: '0.75rem', fontWeight: step >= 5 ? 700 : 500, color: step >= 5 ? '#E05638' : '#94A3B8' }}>
                      5. Confirm
                    </span>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <span style={{
                fontSize: '0.75rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                color: '#E05638',
                backgroundColor: '#FFF4F1',
                border: '1px solid #FFDDD5',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                letterSpacing: '0.5px',
              }}>
                Step 1: Choose Account Type
              </span>
            </div>
          )}

          {/* STEP 1: Account Type Selection */}
          {step === 1 && (
            <div>
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: '50%',
                    backgroundColor: '#FFF4F1',
                    color: '#E05638',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.85rem auto',
                  }}
                >
                  <UserPlus size={26} />
                </div>
                <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                  Create an Account
                </h2>
                <p style={{ fontSize: '0.95rem', color: '#64748B' }}>
                  Select your account type below to get started on PostPlace CT
                </p>
              </div>

              {/* Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                {/* Employee Card */}
                <div
                  onClick={() => setRole('JOB_SEEKER')}
                  style={{
                    border: role === 'JOB_SEEKER' ? '2px solid #E05638' : '1px solid #E2E8F0',
                    backgroundColor: role === 'JOB_SEEKER' ? '#FFF8F6' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: role === 'JOB_SEEKER' ? '0 10px 25px -5px rgba(224, 86, 56, 0.15)' : 'none',
                  }}
                >
                  <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                    {role === 'JOB_SEEKER' ? (
                      <CheckCircle2 size={22} color="#E05638" fill="#FFF4F1" />
                    ) : (
                      <Circle size={22} color="#CBD5E1" />
                    )}
                  </div>

                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      backgroundColor: role === 'JOB_SEEKER' ? '#FFE8E2' : '#F1F5F9',
                      color: role === 'JOB_SEEKER' ? '#E05638' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <User size={24} />
                  </div>

                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: role === 'JOB_SEEKER' ? '#E05638' : '#64748B',
                      backgroundColor: role === 'JOB_SEEKER' ? '#FFEBE6' : '#F1F5F9',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      marginBottom: '0.6rem',
                    }}
                  >
                    Personal Account
                  </span>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                    Personal Account
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.45', marginBottom: '1rem' }}>
                    Find & apply for local jobs, track application status, and bookmark favorite employers.
                  </p>

                  <ul style={{ fontSize: '0.825rem', color: '#475569', listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>✓</span> 1-Click job applications
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>✓</span> Real-time application tracking
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>✓</span> Message local employers directly
                    </li>
                  </ul>
                </div>

                {/* Business Account Card */}
                <div
                  onClick={() => setRole('EMPLOYER')}
                  style={{
                    border: role === 'EMPLOYER' ? '2px solid #E05638' : '1px solid #E2E8F0',
                    backgroundColor: role === 'EMPLOYER' ? '#FFF8F6' : '#FFFFFF',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    boxShadow: role === 'EMPLOYER' ? '0 10px 25px -5px rgba(224, 86, 56, 0.15)' : 'none',
                  }}
                >
                  <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem' }}>
                    {role === 'EMPLOYER' ? (
                      <CheckCircle2 size={22} color="#E05638" fill="#FFF4F1" />
                    ) : (
                      <Circle size={22} color="#CBD5E1" />
                    )}
                  </div>

                  <div
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: '12px',
                      backgroundColor: role === 'EMPLOYER' ? '#FFE8E2' : '#F1F5F9',
                      color: role === 'EMPLOYER' ? '#E05638' : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '1rem',
                    }}
                  >
                    <Building2 size={24} />
                  </div>

                  <span
                    style={{
                      display: 'inline-block',
                      fontSize: '0.725rem',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      color: role === 'EMPLOYER' ? '#E05638' : '#64748B',
                      backgroundColor: role === 'EMPLOYER' ? '#FFEBE6' : '#F1F5F9',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '6px',
                      marginBottom: '0.6rem',
                    }}
                  >
                    Verified Employer & Business
                  </span>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
                    Business Account
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', lineHeight: '1.45', marginBottom: '1rem' }}>
                    Multi-step verification with mandatory storefront photo upload, address autocomplete & location profile.
                  </p>

                  <ul style={{ fontSize: '0.825rem', color: '#475569', listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>✓</span> Mandatory business photo & logo setup
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>✓</span> State, City & Address Autocomplete
                    </li>
                    <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <span style={{ color: '#059669', fontWeight: 700 }}>✓</span> Employer verification & Tax ID setup
                    </li>
                  </ul>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="btn btn-primary btn-lg"
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  fontSize: '1.05rem',
                  borderRadius: '12px',
                }}
              >
                <span>Continue with {role === 'EMPLOYER' ? 'Business Account' : 'Personal Account'}</span>
                <ArrowRight size={18} />
              </button>
            </div>
          )}

          {/* STEP 2: Personal / Owner Credentials */}
          {step === 2 && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    marginBottom: '1rem',
                    padding: 0,
                  }}
                >
                  <ChevronLeft size={16} /> Back to account selection
                </button>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#FFF8F6',
                    border: '1px solid #FFDDD5',
                    padding: '0.85rem 1.1rem',
                    borderRadius: '14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: '10px',
                        backgroundColor: '#FFE8E2',
                        color: '#E05638',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {role === 'EMPLOYER' ? <Building2 size={20} /> : <User size={20} />}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.725rem', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.5px' }}>
                        Selected Account
                      </div>
                      <div style={{ fontSize: '0.975rem', fontWeight: 700, color: '#0F172A' }}>
                        {role === 'EMPLOYER' ? 'Business Account (5-Step Setup)' : 'Employee / Job Seeker'}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      background: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '8px',
                      padding: '0.35rem 0.8rem',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      color: '#E05638',
                      cursor: 'pointer',
                    }}
                  >
                    Change
                  </button>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem' }}>
                  {role === 'EMPLOYER' ? 'Step 2: Business Administrator Credentials' : 'Create your Employee Account'}
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  {role === 'EMPLOYER' ? 'Enter the details of the authorized company representative' : 'Join PostPlace CT in Norwalk & Fairfield County'}
                </p>
              </div>

              {error && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FCA5A5',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <ShieldAlert size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStep2Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                {/* First Name & Last Name (Side by Side Grid) */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                      First Name *
                    </label>
                    <div className="input-icon-group">
                      <User size={18} />
                      <input
                        type="text"
                        className="form-input"
                        placeholder=""
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                      Last Name *
                    </label>
                    <div className="input-icon-group">
                      <User size={18} />
                      <input
                        type="text"
                        className="form-input"
                        placeholder=""
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                {role === 'EMPLOYER' && (
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                      Position / Role in Company *
                    </label>
                    <div className="input-icon-group">
                      <Award size={18} />
                      <select
                        className="form-input"
                        style={{ paddingLeft: '2.5rem' }}
                        value={ownerTitle}
                        onChange={(e) => setOwnerTitle(e.target.value)}
                      >
                        <option value="Business Owner / Founder">Business Owner / Founder</option>
                        <option value="General Manager">General Manager</option>
                        <option value="HR & Talent Director">HR & Talent Director</option>
                        <option value="Operations Director">Operations Director</option>
                        <option value="Authorized Administrator">Authorized Administrator</option>
                      </select>
                    </div>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                    Work Email Address *
                  </label>
                  <div className="input-icon-group">
                    <Mail size={18} />
                    <input
                      type="email"
                      className="form-input"
                      placeholder=""
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                    Contact Phone Number *
                  </label>
                  <div className="input-icon-group">
                    <Phone size={18} />
                    <input
                      type="tel"
                      className="form-input"
                      placeholder=""
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                    Password *
                  </label>
                  <div className="input-icon-group">
                    <Key size={18} />
                    <input
                      type="password"
                      className="form-input"
                      placeholder=""
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    borderRadius: '12px',
                    marginTop: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                  disabled={loading}
                >
                  {role === 'EMPLOYER' ? (
                    <>
                      <span>Next: Business Profile Setup</span>
                      <ArrowRight size={18} />
                    </>
                  ) : (
                    <span>{loading ? 'Creating Account...' : 'Create Employee Account ✓'}</span>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* STEP 3: Business Information & MANDATORY Photo */}
          {step === 3 && role === 'EMPLOYER' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    marginBottom: '0.75rem',
                    padding: 0,
                  }}
                >
                  <ChevronLeft size={16} /> Back to owner details
                </button>

                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.825rem',
                    color: '#047857',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Admin: {name} ({ownerTitle})</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#FFF4F1',
                    color: '#E05638',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto',
                  }}
                >
                  <Store size={24} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem' }}>
                  Step 3: Business Profile & Location
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  Enter official business details, location & mandatory storefront photo
                </p>
              </div>

              {error && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FCA5A5',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <ShieldAlert size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStep3Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>

                {/* Official Business Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                    Official Business Name *
                  </label>
                  <div className="input-icon-group">
                    <Store size={18} />
                    <input
                      type="text"
                      className="form-input"
                      placeholder=""
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Industry / Business Category */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                    Choose Your Business Category *
                  </label>
                  <div className="input-icon-group">
                    <Tag size={18} />
                    <select
                      className="form-input"
                      style={{ paddingLeft: '2.5rem', color: businessCategory ? '#0F172A' : '#94A3B8' }}
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      required
                    >
                      <option value="" disabled hidden>
                        Select Category...
                      </option>
                      <option value="Bakery & Food">Bakery & Food</option>
                      <option value="Restaurant & Hospitality">Restaurant & Hospitality</option>
                      <option value="Retail & Shopping">Retail & Shopping</option>
                      <option value="Construction & Contracting">Construction & Contracting</option>
                      <option value="Automotive & Repair">Automotive & Repair</option>
                      <option value="Beauty, Salon & Spa">Beauty, Salon & Spa</option>
                      <option value="Healthcare & Medical">Healthcare & Medical</option>
                      <option value="Logistics & CDL">Logistics & CDL Freight</option>
                      <option value="Cleaning & Facility Maintenance">Cleaning & Maintenance</option>
                      <option value="Landscaping & Outdoor Services">Landscaping & Outdoors</option>
                      <option value="Professional Services">Professional Services</option>
                      <option value="Other Local Business">Other Local Business</option>
                    </select>
                  </div>
                </div>

                {/* Business Bio / Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                    Short Business Bio / Description
                  </label>
                  <div className="input-icon-group">
                    <FileText size={18} style={{ alignSelf: 'flex-start', marginTop: '0.75rem' }} />
                    <textarea
                      className="form-input"
                      rows={3}
                      style={{ paddingLeft: '2.5rem', paddingTop: '0.65rem' }}
                      placeholder=""
                      value={businessDescription}
                      onChange={(e) => setBusinessDescription(e.target.value)}
                    />
                  </div>
                </div>

                {/* State & City Selectors */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem', whiteSpace: 'nowrap' }}>
                      State *
                    </label>
                    <select
                      className="form-input"
                      style={{ paddingLeft: '0.85rem' }}
                      value={businessState}
                      onChange={(e) => handleStateChange(e.target.value)}
                    >
                      {Object.keys(US_STATES_DICT).map((st) => (
                        <option key={st} value={st}>
                          {US_STATES_DICT[st].name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem', whiteSpace: 'nowrap' }}>
                      City *
                    </label>
                    <select
                      className="form-input"
                      style={{ paddingLeft: '0.85rem' }}
                      value={businessCity}
                      onChange={(e) => handleCityChange(e.target.value)}
                    >
                      {currentCitiesList.map((c) => (
                        <option key={c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Street Address Input with Real-time Street Autocomplete Suggestions */}
                <div ref={addressWrapperRef} style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                    Street Address (Physical Store or Office)
                  </label>
                  <div className="input-icon-group">
                    <MapPin size={18} color="#E05638" />
                    <input
                      type="text"
                      className="form-input"
                      placeholder=""
                      value={businessAddress}
                      onChange={(e) => {
                        setBusinessAddress(e.target.value);
                        setShowAddressSuggestions(true);
                      }}
                      onFocus={() => setShowAddressSuggestions(true)}
                    />
                  </div>

                  {/* Autocomplete Popup Suggestions (Inline below input, above map) */}
                  {showAddressSuggestions && matchingSuggestions.length > 0 && (
                    <div
                      style={{
                        backgroundColor: '#FFFFFF',
                        border: '1px solid #CBD5E1',
                        borderRadius: '14px',
                        marginTop: '0.5rem',
                        boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12)',
                        overflow: 'hidden',
                      }}
                    >
                      <div style={{ padding: '0.45rem 0.85rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #F1F5F9', fontSize: '0.725rem', fontWeight: 800, color: '#E05638', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Street Address Autocomplete Suggestions ({businessCity}, {businessState})
                      </div>
                      {matchingSuggestions.map((item, idx) => (
                        <div
                          key={idx}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            selectAddressSuggestion(item);
                          }}
                          onClick={() => selectAddressSuggestion(item)}
                          style={{
                            padding: '0.7rem 0.85rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            borderBottom: idx === matchingSuggestions.length - 1 ? 'none' : '1px solid #F1F5F9',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF8F6')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
                        >
                          <MapPin size={18} color="#E05638" style={{ flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A' }}>
                              {item.street}
                            </div>
                            <div style={{ fontSize: '0.775rem', color: '#64748B' }}>
                              {item.neighborhood}, {item.city}, {item.state} {item.zip}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Interactive Map Location Preview (Only renders when an address is typed/selected) */}
                  {businessAddress && businessAddress.trim().length > 0 && (
                    <div
                      style={{
                        marginTop: '0.85rem',
                        borderRadius: '16px',
                        overflow: 'hidden',
                        border: '1px solid #CBD5E1',
                        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.05)',
                        backgroundColor: '#F8FAFC',
                        position: 'relative',
                      }}
                    >
                      <div
                        style={{
                          height: '180px',
                          width: '100%',
                          position: 'relative',
                          backgroundColor: '#E2E8F0',
                        }}
                      >
                        <iframe
                          title="Location Map"
                          width="100%"
                          height="100%"
                          style={{ border: 0, filter: 'contrast(1.05) saturate(1.1)' }}
                          loading="lazy"
                          src={`https://maps.google.com/maps?q=${encodeURIComponent(
                            `${businessAddress}, ${businessCity}, ${businessState}`
                          )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                        />
                      </div>
                      <div
                        style={{
                          padding: '0.55rem 0.85rem',
                          backgroundColor: '#FFFFFF',
                          borderTop: '1px solid #E2E8F0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          fontSize: '0.775rem',
                          color: '#475569',
                          fontWeight: 600,
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#0F172A', fontWeight: 700 }}>
                          <MapPin size={14} color="#E05638" /> {businessAddress}, {businessCity}, {businessState}
                        </span>
                        <span style={{ fontSize: '0.7rem', color: '#0F172A', fontWeight: 800, backgroundColor: '#F1F5F9', border: '1px solid #CBD5E1', padding: '0.15rem 0.55rem', borderRadius: '6px' }}>
                          Map Preview
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                      Business Phone
                    </label>
                    <div className="input-icon-group">
                      <Phone size={18} />
                      <input
                        type="tel"
                        className="form-input"
                        placeholder=""
                        value={businessPhone}
                        onChange={(e) => setBusinessPhone(e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                      Website / Social
                    </label>
                    <div className="input-icon-group">
                      <Globe size={18} />
                      <input
                        type="url"
                        className="form-input"
                        placeholder=""
                        value={businessWebsite}
                        onChange={(e) => setBusinessWebsite(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* MANDATORY Business Photo Section (At bottom of Step 3) */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: businessLogoUrl ? '2px solid #10B981' : '2px dashed #E2E8F0',
                    borderRadius: '20px',
                    padding: '1.5rem',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.03)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#FFF8F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ImageIcon size={20} color="#E05638" />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.95rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.2 }}>
                          Business Photo & Storefront Image *
                        </label>
                        <span style={{ fontSize: '0.775rem', color: '#64748B' }}>
                          Upload a high resolution photo of your store, restaurant, or business entrance.
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '0.725rem', fontWeight: 800, color: '#DC2626', backgroundColor: '#FEF2F2', border: '1px solid #FCA5A5', padding: '0.2rem 0.6rem', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Required
                    </span>
                  </div>

                  {businessLogoUrl ? (
                    <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '200px', width: '100%', border: '1px solid #E2E8F0', backgroundColor: '#F8FAFC' }}>
                      <img src={businessLogoUrl} alt="Storefront Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(15, 23, 42, 0.75) 0%, transparent 60%)', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '1.25rem' }}>
                        <div style={{ color: '#FFFFFF' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <CheckCircle2 size={16} color="#10B981" /> Photo Selected
                          </p>
                          <p style={{ fontSize: '0.75rem', color: '#CBD5E1', margin: 0 }}>Ready to display on your company profile</p>
                        </div>
                        <label
                          style={{
                            backgroundColor: '#FFFFFF',
                            color: '#0F172A',
                            padding: '0.55rem 1rem',
                            borderRadius: '10px',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <Upload size={14} /> Change Photo
                          <input type="file" accept="image/*" onChange={handleLogoFileUpload} style={{ display: 'none' }} />
                        </label>
                      </div>
                    </div>
                  ) : (
                    <label
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '2.5rem 1.5rem',
                        borderRadius: '16px',
                        backgroundColor: '#F8FAFC',
                        border: '2px dashed #CBD5E1',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        textAlign: 'center',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#E05638';
                        e.currentTarget.style.backgroundColor = '#FFF8F6';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#CBD5E1';
                        e.currentTarget.style.backgroundColor = '#F8FAFC';
                      }}
                    >
                      <div style={{ width: 56, height: 56, borderRadius: '50%', backgroundColor: '#FFEBE6', color: '#E05638', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.85rem', boxShadow: '0 4px 12px rgba(224, 86, 56, 0.15)' }}>
                        <Upload size={26} />
                      </div>
                      <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.25rem' }}>
                        Click to upload business photo
                      </p>
                      <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>
                        Supports PNG, JPG, WEBP (Max 10MB)
                      </p>
                      <input type="file" accept="image/*" onChange={handleLogoFileUpload} style={{ display: 'none' }} />
                    </label>
                  )}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', borderRadius: '12px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <span>Next: Operations & Verification</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 4: Operations & Verification (For EMPLOYER Only) */}
          {step === 4 && role === 'EMPLOYER' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    marginBottom: '0.75rem',
                    padding: 0,
                  }}
                >
                  <ChevronLeft size={16} /> Back to business profile & photo
                </button>

                <div
                  style={{
                    backgroundColor: '#ECFDF5',
                    border: '1px solid #A7F3D0',
                    padding: '0.65rem 1rem',
                    borderRadius: '10px',
                    fontSize: '0.825rem',
                    color: '#047857',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                  }}
                >
                  <CheckCircle2 size={16} color="#059669" />
                  <span>Business: {businessName} ({businessCity}, {businessState})</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#FFF4F1',
                    color: '#E05638',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto',
                  }}
                >
                  <ShieldCheck size={24} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem' }}>
                  Step 4: Operations & Verification
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  Verify your business credentials for candidate trust & hiring badges
                </p>
              </div>

              {error && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FCA5A5',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <ShieldAlert size={18} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleStep4Submit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                      Company Staff Size *
                    </label>
                    <div className="input-icon-group">
                      <Users size={18} />
                      <select
                        className="form-input"
                        style={{ paddingLeft: '2.5rem' }}
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                      >
                        <option value="1 - 10 employees">1 - 10 employees</option>
                        <option value="11 - 50 employees">11 - 50 employees</option>
                        <option value="51 - 200 employees">51 - 200 employees</option>
                        <option value="200+ employees">200+ employees</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                      Primary Business & Hiring Objective *
                    </label>
                    <select
                      className="form-input"
                      style={{ paddingLeft: '0.85rem' }}
                      value={hiringGoal}
                      onChange={(e) => setHiringGoal(e.target.value)}
                    >
                      <option value="Hiring Full-time & Part-time Staff">Hiring Full-time & Part-time Staff</option>
                      <option value="Offering Commercial & Local Services">Offering Commercial & Local Services</option>
                      <option value="Both Staff Hiring & Commercial Services">Both Staff Hiring & Commercial Services</option>
                    </select>
                  </div>
                </div>

                {/* Operating Hours Card with Separate Opening & Closing Time Boxes */}
                <div
                  style={{
                    backgroundColor: '#FFF8F6',
                    border: '1px solid #FFDDD5',
                    borderRadius: '16px',
                    padding: '1.25rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <Clock size={18} color="#E05638" />
                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', margin: 0 }}>
                      Business Operating Hours (Horario de Atención)
                    </label>
                  </div>

                  {/* Working Days Pill Selection */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', fontSize: '0.775rem', fontWeight: 700, color: '#64748B', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Working Days (Días de Operación)
                    </label>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {[
                        { key: 'Mon', label: 'Mon' },
                        { key: 'Tue', label: 'Tue' },
                        { key: 'Wed', label: 'Wed' },
                        { key: 'Thu', label: 'Thu' },
                        { key: 'Fri', label: 'Fri' },
                        { key: 'Sat', label: 'Sat' },
                        { key: 'Sun', label: 'Sun' },
                      ].map((day) => {
                        const selectedDays = operatingDays ? operatingDays.split(', ').filter(Boolean) : [];
                        const isSelected = selectedDays.includes(day.key);

                        const toggleDay = () => {
                          let updated: string[];
                          if (isSelected) {
                            updated = selectedDays.filter((d) => d !== day.key);
                          } else {
                            const order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                            updated = [...selectedDays, day.key].sort((a, b) => order.indexOf(a) - order.indexOf(b));
                          }
                          const newDaysStr = updated.join(', ');
                          setOperatingDays(newDaysStr);
                          setOperatingHours(`${newDaysStr}: ${openTime} - ${closeTime}`);
                        };

                        return (
                          <button
                            key={day.key}
                            type="button"
                            onClick={toggleDay}
                            style={{
                              flex: 1,
                              minWidth: '42px',
                              padding: '0.5rem 0.25rem',
                              borderRadius: '10px',
                              border: isSelected ? '2px solid #0e3b2e' : '1px solid #CBD5E1',
                              backgroundColor: isSelected ? '#0e3b2e' : '#FFFFFF',
                              color: isSelected ? '#FFFFFF' : '#475569',
                              fontWeight: isSelected ? 800 : 600,
                              fontSize: '0.825rem',
                              cursor: 'pointer',
                              textAlign: 'center',
                              transition: 'all 0.15s ease',
                              boxShadow: isSelected ? '0 4px 12px rgba(14, 59, 46, 0.25)' : 'none',
                            }}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Separate Opening & Closing Time Boxes */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'center' }}>
                    {/* Opening Time Box */}
                    <CustomTimePicker
                      label="Opens At (Abre a las)"
                      labelColor="#059669"
                      value={openTime}
                      onChange={(val) => {
                        setOpenTime(val);
                        setOperatingHours(`${operatingDays}: ${val} - ${closeTime}`);
                      }}
                      options={OPEN_TIME_OPTIONS}
                      iconColor="#059669"
                      activeBgColor="#ECFDF5"
                    />

                    {/* Closing Time Box */}
                    <CustomTimePicker
                      label="Closes At (Cierra a las)"
                      labelColor="#DC2626"
                      value={closeTime}
                      onChange={(val) => {
                        setCloseTime(val);
                        setOperatingHours(`${operatingDays}: ${openTime} - ${val}`);
                      }}
                      options={CLOSE_TIME_OPTIONS}
                      iconColor="#E05638"
                      activeBgColor="#FFF4F1"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', borderRadius: '12px', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <span>Next: Review & Confirm</span>
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          )}

          {/* STEP 5: Review & Confirm (For EMPLOYER Only) */}
          {step === 5 && role === 'EMPLOYER' && (
            <div>
              <div style={{ marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.2rem',
                    marginBottom: '0.75rem',
                    padding: 0,
                  }}
                >
                  <ChevronLeft size={16} /> Back to operations
                </button>
              </div>

              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    backgroundColor: '#FFF4F1',
                    color: '#E05638',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto',
                  }}
                >
                  <Award size={24} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.3rem' }}>
                  Step 5: Review & Confirm Business Account
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748B' }}>
                  Review your business details & location before finalizing creation
                </p>
              </div>

              {error && (
                <div
                  style={{
                    backgroundColor: '#FEF2F2',
                    color: '#DC2626',
                    border: '1px solid #FCA5A5',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    marginBottom: '1.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <ShieldAlert size={18} />
                  <span>{error}</span>
                </div>
              )}

              {/* Summary Card with Mandatory Image & Location */}
              <div
                style={{
                  backgroundColor: '#FAFAFA',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  marginBottom: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <img
                      src={businessLogoUrl}
                      alt={businessName}
                      style={{ width: 56, height: 56, borderRadius: '12px', objectFit: 'cover', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF' }}
                    />
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#0F172A' }}>{businessName}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        {businessCategory} • {businessAddress ? `${businessAddress}, ` : ''}{businessCity}, {businessState}
                      </div>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#D97706', backgroundColor: '#FFFBEB', border: '1px solid #FDE68A', padding: '0.25rem 0.65rem', borderRadius: '6px', whiteSpace: 'nowrap' }}>
                    Pending Verification
                  </span>
                </div>

                <div style={{ gridTemplateColumns: '1fr 1fr', display: 'grid', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Authorized Owner</span>
                    <strong style={{ color: '#1E293B' }}>{name}</strong> ({ownerTitle})
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Work Email</span>
                    <strong style={{ color: '#1E293B' }}>{email}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Full Address</span>
                    <strong style={{ color: '#1E293B' }}>{businessAddress || 'Physical Location'}, {businessNeighborhood}, {businessCity}, {businessState}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '0.75rem' }}>Company Size</span>
                    <strong style={{ color: '#1E293B' }}>{companySize}</strong>
                  </div>
                </div>
              </div>

              <form onSubmit={handleStep5Submit}>
                <label
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.65rem',
                    fontSize: '0.85rem',
                    color: '#334155',
                    cursor: 'pointer',
                    marginBottom: '1.5rem',
                    backgroundColor: '#FFF8F6',
                    border: '1px solid #FFDDD5',
                    padding: '0.85rem',
                    borderRadius: '12px',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    style={{ marginTop: '0.2rem', width: 16, height: 16, accentColor: '#E05638' }}
                  />
                  <span>
                    I confirm that I am an authorized representative of <strong>{businessName}</strong> and agree to the PostPlace CT Employer Guidelines & Business Terms.
                  </span>
                </label>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', borderRadius: '12px' }}
                  disabled={loading}
                >
                  {loading ? 'Creating Verified Business Account...' : 'Complete Setup & Launch Business Account ✓'}
                </button>
              </form>
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.9rem', color: '#64748B' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#E05638', fontWeight: 700 }}>
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
