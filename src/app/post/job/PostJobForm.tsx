'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { formatEmploymentType, formatSchedule, formatWorkplaceType } from '@/lib/formatters';
import {
  Briefcase,
  Send,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  DollarSign,
  Clock,
  MapPin,
  Languages,
  Sparkles,
  Heart,
  Calendar,
  Award,
  Check,
  Image as ImageIcon,
  Plus,
  Trash2,
  Zap,
  ShieldCheck,
  HeartPulse,
  Utensils,
  Car,
  Wrench,
  GraduationCap,
  TrendingUp,
  Gift,
  Shirt,
  Dumbbell,
  Lock,
  Smile,
  Bus,
  Save,
  X,
} from 'lucide-react';

interface PostJobFormProps {
  user: any;
  categories: any[];
  businesses: any[];
  initialJob?: any;
  onSave?: (updatedJob: any) => void;
  onDelete?: (deletedJobId: string) => void;
  onCancel?: () => void;
}

const BENEFIT_PRESETS = [
  { key: 'Health Insurance', icon: Heart, bg: '#FEF2F2', color: '#EF4444', text: 'Comprehensive medical, dental & vision coverage' },
  { key: 'Paid Time Off', icon: Calendar, bg: '#EFF6FF', color: '#2563EB', text: 'Paid vacation, personal days & national holidays' },
  { key: 'Flexible Schedule', icon: Clock, bg: '#ECFDF5', color: '#059669', text: 'Adaptable shifts, hybrid & healthy work-life balance' },
  { key: 'Retirement Plan', icon: DollarSign, bg: '#F3E8FF', color: '#7C3AED', text: 'Company-matched 401(k) retirement savings plan' },
  { key: 'Performance Bonuses & Tips', icon: Zap, bg: '#FEF3C7', color: '#D97706', text: 'Weekly/monthly bonuses, commission & cash tips' },
  { key: 'Paid Sick & Family Leave', icon: ShieldCheck, bg: '#E1FDF4', color: '#10B981', text: 'Paid sick time & parental family leave support' },
  { key: 'Dental & Vision Coverage', icon: HeartPulse, bg: '#FFE4E6', color: '#E11D48', text: '100% covered preventative dental care & vision exams' },
  { key: 'Free Meals, Coffee & Snacks', icon: Utensils, bg: '#FFEDD5', color: '#EA580C', text: 'Free shift meals, espresso bar & workplace snacks' },
  { key: 'Company Vehicle / Gas Stipend', icon: Car, bg: '#E0E7FF', color: '#4F46E5', text: 'Company work truck/van or monthly gas reimbursement' },
  { key: 'Tools & Work Gear Provided', icon: Wrench, bg: '#F1F5F9', color: '#475569', text: 'All tools, power equipment & safety gear fully supplied' },
  { key: 'Paid Training & Certifications', icon: GraduationCap, bg: '#CFFAFE', color: '#0891B2', text: 'Paid training, CDL/OSHA licensing & certifications' },
  { key: 'Employee Discounts', icon: Sparkles, bg: '#FEF9C3', color: '#CA8A04', text: 'Exclusive discounts on store goods, food & services' },
  { key: 'Career Growth & Training', icon: Award, bg: '#FCE7F3', color: '#DB2777', text: 'Fast-track promotions, mentorship & leadership growth' },
  { key: 'Overtime Pay (1.5x Rate)', icon: TrendingUp, bg: '#CCFBF1', color: '#0D9488', text: 'Ample overtime hours with 1.5x time-and-a-half rate' },
  { key: 'Signing Bonus Available', icon: Gift, bg: '#F3E8FF', color: '#9333EA', text: 'Immediate sign-on cash bonus upon completing 90 days' },
  { key: 'Uniforms & Safety Boots', icon: Shirt, bg: '#F8FAFC', color: '#64748B', text: 'Company uniforms, jackets, safety boots & laundry' },
  { key: 'Gym Membership & Wellness', icon: Dumbbell, bg: '#DCFCE7', color: '#16A34A', text: 'Free local gym membership & annual wellness stipend' },
  { key: 'Life & Disability Insurance', icon: Lock, bg: '#EFF6FF', color: '#3B82F6', text: 'Employer-paid life, short-term & long-term disability' },
  { key: 'Childcare & Family Support', icon: Smile, bg: '#FFE4E6', color: '#F43F5E', text: 'Subsidized childcare assistance & flexible family scheduling' },
  { key: 'Commuter & Transit Pass', icon: Bus, bg: '#E0F2FE', color: '#0284C7', text: 'Pre-tax commuter pass, train stipend & parking subsidy' },
];

const TITLE_SUGGESTIONS_DB = [
  // Skilled Trades & Construction
  { title: 'Construction Laborer', keywords: ['construction', 'construc', 'labor', 'site', 'builder', 'building'], categoryName: 'Trades' },
  { title: 'Construction Foreman', keywords: ['construction', 'construc', 'foreman', 'supervisor', 'lead', 'site manager'], categoryName: 'Trades' },
  { title: 'Carpenter', keywords: ['carpenter', 'carpentry', 'framing', 'woodwork', 'construction', 'finish carpenter'], categoryName: 'Trades' },
  { title: 'Plumber', keywords: ['plumber', 'plumbing', 'pipe', 'water', 'drain', 'pipefitter'], categoryName: 'Trades' },
  { title: 'Electrician', keywords: ['electrician', 'electric', 'electrical', 'wiring', 'power', 'solar'], categoryName: 'Trades' },
  { title: 'HVAC Technician', keywords: ['hvac', 'heating', 'air conditioning', 'tech', 'cooling', 'ventilation'], categoryName: 'Trades' },
  { title: 'Painter', keywords: ['painter', 'painting', 'drywall', 'plaster', 'finisher', 'spray painter'], categoryName: 'Trades' },
  { title: 'Roofer', keywords: ['roofing', 'roofer', 'siding', 'shingle', 'gutters', 'roof'], categoryName: 'Trades' },
  { title: 'Mason', keywords: ['masonry', 'mason', 'concrete', 'brick', 'cement', 'pavers'], categoryName: 'Trades' },
  { title: 'Heavy Equipment Operator', keywords: ['excavator', 'heavy equipment', 'machinery', 'crane', 'operator', 'bobcat'], categoryName: 'Trades' },
  { title: 'Welder', keywords: ['welder', 'welding', 'metal', 'fabricator', 'mig', 'tig'], categoryName: 'Trades' },
  { title: 'Auto Mechanic', keywords: ['mechanic', 'auto', 'automotive', 'car repair', 'brakes', 'engine'], categoryName: 'Trades' },
  { title: 'Landscaper', keywords: ['landscaping', 'landscaper', 'lawn', 'grounds', 'gardener', 'outdoor'], categoryName: 'Trades' },

  // Restaurant & Hospitality
  { title: 'Line Cook', keywords: ['cook', 'chef', 'line cook', 'kitchen', 'food', 'restaurant', 'culinary'], categoryName: 'Hospitality' },
  { title: 'Prep Cook', keywords: ['prep cook', 'prep', 'cook', 'kitchen', 'pantry', 'food prep'], categoryName: 'Hospitality' },
  { title: 'Sous Chef', keywords: ['sous chef', 'chef', 'cook', 'kitchen lead', 'culinary'], categoryName: 'Hospitality' },
  { title: 'Baker', keywords: ['baker', 'bakery', 'pastry', 'bread', 'dessert', 'cook'], categoryName: 'Hospitality' },
  { title: 'Barista', keywords: ['barista', 'coffee', 'cafe', 'espresso', 'coffee shop'], categoryName: 'Hospitality' },
  { title: 'Bartender', keywords: ['bartender', 'bar', 'drinks', 'cocktails', 'mixologist', 'hospitality'], categoryName: 'Hospitality' },
  { title: 'Restaurant Manager', keywords: ['manager', 'restaurant manager', 'hospitality', 'shift supervisor'], categoryName: 'Hospitality' },
  { title: 'Food Server', keywords: ['server', 'waiter', 'waitress', 'food', 'dining', 'front of house'], categoryName: 'Hospitality' },
  { title: 'Dishwasher', keywords: ['dishwasher', 'kitchen', 'utility', 'cleaning', 'steward'], categoryName: 'Hospitality' },

  // Logistics & Warehouse
  { title: 'CDL Driver', keywords: ['driver', 'cdl', 'truck driver', 'freight', 'hauling', 'class a', 'class b'], categoryName: 'Logistics' },
  { title: 'Warehouse Specialist', keywords: ['warehouse', 'forklift', 'logistics', 'shipping', 'inventory', 'material handler'], categoryName: 'Logistics' },
  { title: 'Delivery Driver', keywords: ['delivery driver', 'courier', 'van driver', 'packages', 'route driver'], categoryName: 'Logistics' },

  // Healthcare
  { title: 'Dental Hygienist', keywords: ['dental', 'hygienist', 'dentist', 'teeth', 'hygiene', 'teeth cleaning'], categoryName: 'Healthcare' },
  { title: 'Registered Nurse', keywords: ['nurse', 'nursing', 'rn', 'medical', 'clinic', 'patient care', 'healthcare'], categoryName: 'Healthcare' },
  { title: 'Caregiver', keywords: ['cna', 'nursing assistant', 'caregiver', 'patient care', 'elderly care', 'home care'], categoryName: 'Healthcare' },
  { title: 'Receptionist', keywords: ['receptionist', 'front desk', 'office', 'admin', 'secretary', 'clerk'], categoryName: 'Office' },
  { title: 'DevOps Engineer', keywords: ['engineer', 'software', 'devops', 'developer', 'coding', 'tech', 'programmer'], categoryName: 'Technology' },
];

const POPULAR_TITLE_CHIPS = [
  'Construction Laborer',
  'Carpenter',
  'Plumber',
  'Electrician',
  'Line Cook',
  'Prep Cook',
  'CDL Driver',
  'Warehouse Specialist',
  'Landscaper',
  'Auto Mechanic',
  'Registered Nurse',
  'Receptionist',
];

export default function PostJobForm({
  user,
  categories,
  businesses,
  initialJob,
  onSave,
  onDelete,
  onCancel,
}: PostJobFormProps) {
  const router = useRouter();
  const isEditing = !!initialJob;
  const [step, setStep] = useState(1);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [step]);

  // Form State
  const [title, setTitle] = useState(initialJob?.title || '');
  const [status, setStatus] = useState(initialJob?.status || 'active');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [categoryId, setCategoryId] = useState(initialJob?.categoryId || categories[0]?.id || '');
  const [businessId, setBusinessId] = useState(initialJob?.businessId || businesses[0]?.id || '');
  const [description, setDescription] = useState(initialJob?.description || '');
  const [requirements, setRequirements] = useState(initialJob?.requirements || '');

  // Responsibilities
  const [responsibilityList, setResponsibilityList] = useState<string[]>(() => {
    if (!initialJob?.responsibilities) return [''];
    const lines = initialJob.responsibilities
      .split('\n')
      .map((l: string) => l.replace(/^[•\-\*\s]+/, '').trim())
      .filter(Boolean);
    return lines.length > 0 ? lines : [''];
  });

  // Benefits
  const [selectedBenefits, setSelectedBenefits] = useState<string[]>(() => {
    if (!initialJob?.benefits) return ['Health Insurance', 'Paid Time Off', 'Flexible Schedule'];
    const parts = initialJob.benefits.split(',').map((s: string) => s.trim());
    return parts.filter((p: string) => BENEFIT_PRESETS.some((preset) => preset.key === p));
  });

  const [customBenefits, setCustomBenefits] = useState(() => {
    if (!initialJob?.benefits) return '';
    const parts = initialJob.benefits.split(',').map((s: string) => s.trim());
    const custom = parts.filter((p: string) => !BENEFIT_PRESETS.some((preset) => preset.key === p));
    return custom.join(', ');
  });

  // Pay & Options
  const [salaryMin, setSalaryMin] = useState(initialJob?.salaryMin?.toString() || '');
  const [salaryMax, setSalaryMax] = useState(initialJob?.salaryMax?.toString() || '');
  const [salaryType, setSalaryType] = useState(initialJob?.salaryType || 'hourly');
  const [employmentType, setEmploymentType] = useState(initialJob?.employmentType || 'full-time');
  const [schedule, setSchedule] = useState(initialJob?.schedule || 'flexible');
  const [isRemote, setIsRemote] = useState(initialJob?.isRemote || 'onsite');
  const [languages, setLanguages] = useState(initialJob?.languages || 'English Required');

  // Workplace Gallery Photos
  const [photos, setPhotos] = useState<string[]>(() => {
    try {
      if (initialJob?.galleryImages) {
        const parsed = typeof initialJob.galleryImages === 'string' ? JSON.parse(initialJob.galleryImages) : initialJob.galleryImages;
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [parsed[0] || '', parsed[1] || '', parsed[2] || ''];
        }
      }
    } catch (e) {}
    return ['', '', ''];
  });

  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  const userBusiness = businesses.find((b) => b.id === businessId) || businesses[0];
  const isPendingVerification = user.role === 'EMPLOYER' && userBusiness && !userBusiness.isVerified;

  if (isPendingVerification && !isEditing) {
    return (
      <div className="search-box-wrapper" style={{ padding: '2.75rem 2rem', textAlign: 'center' }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: '50%',
            backgroundColor: '#FEF3C7',
            color: '#D97706',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            border: '2px solid #FDE68A',
          }}
        >
          <ShieldAlert size={32} />
        </div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
          Business Verification Pending (Pendiente de Aprobación)
        </h2>
        <p style={{ fontSize: '0.975rem', color: '#64748B', maxWidth: '520px', margin: '0 auto 1.5rem auto', lineHeight: '1.55' }}>
          Your business profile <strong>"{userBusiness.name}"</strong> is currently pending administrator review. Once an administrator approves your business account in the admin portal, job posting will be unlocked.
        </p>
        <button
          onClick={() => router.push('/employer/dashboard')}
          className="btn btn-primary btn-lg"
          style={{ borderRadius: '12px', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
        >
          Return to Business Dashboard
        </button>
      </div>
    );
  }

  const addResponsibilityItem = () => {
    setResponsibilityList((prev) => [...prev, '']);
  };

  const updateResponsibilityItem = (index: number, value: string) => {
    setResponsibilityList((prev) => {
      const copy = [...prev];
      copy[index] = value;
      return copy;
    });
  };

  const removeResponsibilityItem = (index: number) => {
    setResponsibilityList((prev) => prev.filter((_, i) => i !== index));
  };

  const getCombinedResponsibilitiesString = () => {
    return responsibilityList
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
      .join('\n• ');
  };

  const filteredSuggestions = React.useMemo(() => {
    const query = title.toLowerCase().trim();
    let matches = TITLE_SUGGESTIONS_DB.filter((item) => {
      if (!query) return true;
      return (
        item.title.toLowerCase().includes(query) ||
        item.keywords.some((kw) => kw.toLowerCase().includes(query))
      );
    });

    if (query.length >= 2) {
      const formattedInput = title.trim().charAt(0).toUpperCase() + title.trim().slice(1);
      if (!matches.some((m) => m.title.toLowerCase() === formattedInput.toLowerCase())) {
        matches.unshift({ title: formattedInput, keywords: [query], categoryName: 'General' });
      }
    }
    return matches.slice(0, 10);
  }, [title]);

  const selectSuggestedTitle = (suggestedTitle: string, suggestedCategoryName?: string) => {
    setTitle(suggestedTitle);
    setShowSuggestions(false);
    if (suggestedCategoryName && categories.length > 0) {
      const matchedCat = categories.find((c) =>
        c.name.toLowerCase().includes(suggestedCategoryName.toLowerCase())
      );
      if (matchedCat) {
        setCategoryId(matchedCat.id);
      }
    }
  };

  const toggleBenefitPreset = (benefitKey: string) => {
    if (selectedBenefits.includes(benefitKey)) {
      setSelectedBenefits(selectedBenefits.filter((b) => b !== benefitKey));
    } else {
      setSelectedBenefits([...selectedBenefits, benefitKey]);
    }
  };

  const getCombinedBenefitsString = () => {
    const parts = [...selectedBenefits];
    if (customBenefits.trim()) {
      parts.push(customBenefits.trim());
    }
    return parts.join(', ');
  };

  const getGalleryImagesArray = () => {
    return photos.map((p) => p.trim()).filter((p) => p.length > 5).slice(0, 3);
  };

  const fillSampleWorkplacePhotos = () => {
    setPhotos([
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1553413077-190dd305871c?auto=format&fit=crop&w=800&q=80',
    ]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const combinedBenefits = getCombinedBenefitsString();
    const galleryArray = getGalleryImagesArray();

    try {
      const endpoint = isEditing ? `/api/jobs/${initialJob.id}` : '/api/jobs';
      const method = isEditing ? 'PATCH' : 'POST';

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          status,
          categoryId,
          businessId: businessId || undefined,
          description,
          responsibilities: getCombinedResponsibilitiesString(),
          requirements,
          benefits: combinedBenefits,
          galleryImages: galleryArray,
          salaryMin,
          salaryMax,
          salaryType,
          employmentType,
          schedule,
          isRemote,
          languages,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || `Failed to ${isEditing ? 'update' : 'publish'} job`);
      }

      if (onSave) {
        onSave(data.job);
      } else {
        router.push(`/jobs/${data.job.id}`);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!initialJob || !confirm(`¿Estás seguro de que deseas eliminar la vacante "${initialJob.title}"?`)) return;
    setDeleting(true);
    setError('');

    try {
      const res = await fetch(`/api/jobs/${initialJob.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete job');
      if (onDelete) onDelete(initialJob.id);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const previewResponsibilities = responsibilityList
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const previewPhotos = getGalleryImagesArray();

  return (
    <div className="search-box-wrapper" style={{ padding: '2rem', position: 'relative' }}>
      {onCancel && (
        <button
          type="button"
          onClick={onCancel}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
        >
          <X size={24} />
        </button>
      )}

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: '#FFF4F1', color: '#E05638', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto' }}>
          <Briefcase size={24} />
        </div>
        <h1 style={{ fontSize: '1.75rem', marginBottom: '0.3rem', fontWeight: 800, color: '#0F172A' }}>
          {isEditing ? 'Editar Publicación de Empleo' : 'Post a New Job Listing'}
        </h1>
        <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
          Step {step} of 3 — {step === 1 ? 'Basic Details & Description' : step === 2 ? 'Pay, Perks & Photo Gallery' : 'Preview & Save Listing'}
        </p>
      </div>

      {error && (
        <div style={{ backgroundColor: '#FEF2F2', color: '#DC2626', padding: '0.75rem', borderRadius: '8px', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <ShieldAlert size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* STEP 1: Basic Information */}
      {step === 1 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div style={{ position: 'relative' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Job Title *
            </label>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="e.g. Warehouse Associate, Line Cook, Front Desk Specialist"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              required
            />

            {/* Live Autocomplete Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 50,
                  marginTop: '4px',
                  backgroundColor: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  maxHeight: '260px',
                  overflowY: 'auto',
                  padding: '6px',
                }}
              >
                <div style={{ padding: '6px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>
                  Quick Title Suggestions
                </div>
                {filteredSuggestions.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectSuggestedTitle(item.title, item.categoryName);
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Sparkles size={15} style={{ color: '#E05638' }} />
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#0F172A' }}>{item.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Quick Suggestion Chips */}
            <div style={{ marginTop: '0.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748B' }}>Popular:</span>
              {POPULAR_TITLE_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => selectSuggestedTitle(chip)}
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: '#475569',
                    backgroundColor: '#F1F5F9',
                    border: '1px solid #E2E8F0',
                    borderRadius: '16px',
                    padding: '3px 10px',
                    cursor: 'pointer',
                  }}
                >
                  + {chip}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: isEditing ? '1fr 1fr 1fr' : '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Job Category *
              </label>
              <select
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Company Profile
              </label>
              <select
                className="form-input"
                style={{ paddingLeft: '1rem' }}
                value={businessId}
                onChange={(e) => setBusinessId(e.target.value)}
              >
                {businesses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
                <option value="">{user?.name ? `${user.name} (Direct Employer)` : 'Direct Employer'}</option>
              </select>
            </div>

            {isEditing && (
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.4rem' }}>
                  Vacant Status
                </label>
                <select
                  className="form-input"
                  style={{ paddingLeft: '0.8rem', fontWeight: 700 }}
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="active">🟢 Active Listing</option>
                  <option value="paused">🟡 Paused</option>
                  <option value="closed">🔴 Closed</option>
                </select>
              </div>
            )}
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
              Job Overview / Description *
            </label>
            <textarea
              rows={5}
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="Provide a comprehensive summary of the job position..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: '1rem' }}
            onClick={() => {
              if (!title || !description) {
                setError('Please fill in required job title and description');
                return;
              }
              setError('');
              setStep(2);
            }}
          >
            <span>Next: Pay, Perks & Photos</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}

      {/* STEP 2: Pay, Responsibilities, Benefits & Gallery */}
      {step === 2 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {/* Salary Grid */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.6rem' }}>
              Pay & Salary Range
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748B', marginBottom: '0.2rem' }}>Min Salary ($)</label>
                <input
                  type="number"
                  className="form-input"
                  style={{ paddingLeft: '0.8rem' }}
                  placeholder="21.50"
                  value={salaryMin}
                  onChange={(e) => setSalaryMin(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748B', marginBottom: '0.2rem' }}>Max Salary ($)</label>
                <input
                  type="number"
                  className="form-input"
                  style={{ paddingLeft: '0.8rem' }}
                  placeholder="26.00"
                  value={salaryMax}
                  onChange={(e) => setSalaryMax(e.target.value)}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748B', marginBottom: '0.2rem' }}>Pay Type</label>
                <select className="form-input" style={{ paddingLeft: '0.8rem' }} value={salaryType} onChange={(e) => setSalaryType(e.target.value)}>
                  <option value="hourly">Hourly ($/hr)</option>
                  <option value="yearly">Yearly Salary ($/yr)</option>
                  <option value="gig">Flat Rate / Gig ($)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Schedule, Workplace & Languages */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Employment Type
              </label>
              <select className="form-input" style={{ paddingLeft: '0.8rem' }} value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="temp">Temporary</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Schedule
              </label>
              <select className="form-input" style={{ paddingLeft: '0.8rem' }} value={schedule} onChange={(e) => setSchedule(e.target.value)}>
                <option value="morning">Morning Shift</option>
                <option value="evening">Evening Shift</option>
                <option value="flexible">Flexible Hours</option>
                <option value="weekend">Weekends Only</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Workplace Type
              </label>
              <select className="form-input" style={{ paddingLeft: '0.8rem' }} value={isRemote} onChange={(e) => setIsRemote(e.target.value)}>
                <option value="onsite">On-site (Norwalk CT)</option>
                <option value="hybrid">Hybrid</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#475569', marginBottom: '0.4rem' }}>
                Language Requirement
              </label>
              <select className="form-input" style={{ paddingLeft: '0.8rem' }} value={languages} onChange={(e) => setLanguages(e.target.value)}>
                <option value="English Required">English Required</option>
                <option value="English and Spanish">English and Spanish</option>
                <option value="Spanish">Spanish</option>
              </select>
            </div>
          </div>

          {/* Job Responsibilities Builder */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.3rem' }}>
              Job Responsibilities
            </label>
            <span style={{ fontSize: '0.8rem', color: '#64748B', display: 'block', marginBottom: '0.75rem' }}>
              Add key responsibilities individually. They will be formatted automatically with checkmark badges.
            </span>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {responsibilityList.map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: '50%',
                      backgroundColor: '#ECFDF5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <input
                    type="text"
                    className="form-input"
                    style={{ flex: 1, paddingLeft: '0.85rem' }}
                    placeholder=""
                    value={item}
                    onChange={(e) => updateResponsibilityItem(idx, e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => removeResponsibilityItem(idx)}
                    style={{
                      padding: '9px',
                      borderRadius: '8px',
                      border: '1px solid #FCA5A5',
                      backgroundColor: '#FEF2F2',
                      color: '#EF4444',
                      cursor: 'pointer',
                    }}
                    title="Remove task"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={addResponsibilityItem}
              style={{
                width: '100%',
                marginTop: '0.75rem',
                padding: '12px',
                borderRadius: '10px',
                border: '2px dashed #CBD5E1',
                backgroundColor: '#F8FAF9',
                color: '#475569',
                fontSize: '0.85rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
            >
              <Plus size={18} strokeWidth={2.5} />
              <span>Add Task / Responsibility</span>
            </button>
          </div>

          {/* Benefits Selection */}
          <div>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.4rem' }}>
              Benefits & Perks (Select provided perks)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '0.85rem' }}>
              {BENEFIT_PRESETS.map((preset) => {
                const isSelected = selectedBenefits.includes(preset.key);
                const Icon = preset.icon;
                return (
                  <button
                    key={preset.key}
                    type="button"
                    onClick={() => toggleBenefitPreset(preset.key)}
                    style={{
                      padding: '0.75rem 0.9rem',
                      borderRadius: '10px',
                      border: isSelected ? `2px solid ${preset.color}` : '1px solid #E2E8F0',
                      backgroundColor: isSelected ? preset.bg : '#FFFFFF',
                      color: isSelected ? preset.color : '#475569',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <Icon size={16} />
                    <span style={{ flex: 1 }}>{preset.key}</span>
                    {isSelected && <Check size={16} strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '1rem' }}
              placeholder="Custom benefits or extra perks (e.g. Free shift meals, gas stipend)..."
              value={customBenefits}
              onChange={(e) => setCustomBenefits(e.target.value)}
            />
          </div>

          {/* Workplace Photo Gallery (Up to 3 Photos) */}
          <div style={{ backgroundColor: '#F8FAF9', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0F172A', display: 'flex', alignItems: 'center', gap: '0.4rem', margin: 0 }}>
                  <ImageIcon size={18} color="#2563EB" /> Workplace Photo Gallery (Max 3 Photos)
                </label>
                <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Enter photo URLs of your workplace, office, or warehouse</span>
              </div>
              <button
                type="button"
                onClick={fillSampleWorkplacePhotos}
                className="btn btn-outline btn-sm"
                style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem' }}
              >
                + Load 3 Sample Photos
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <input
                type="url"
                className="form-input"
                style={{ paddingLeft: '0.8rem' }}
                placeholder="Photo 1 URL"
                value={photos[0]}
                onChange={(e) => setPhotos([e.target.value, photos[1], photos[2]])}
              />
              <input
                type="url"
                className="form-input"
                style={{ paddingLeft: '0.8rem' }}
                placeholder="Photo 2 URL"
                value={photos[1]}
                onChange={(e) => setPhotos([photos[0], e.target.value, photos[2]])}
              />
              <input
                type="url"
                className="form-input"
                style={{ paddingLeft: '0.8rem' }}
                placeholder="Photo 3 URL"
                value={photos[2]}
                onChange={(e) => setPhotos([photos[0], photos[1], e.target.value])}
              />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline btn-lg" onClick={() => setStep(1)} style={{ flex: 1 }}>
              <ArrowLeft size={18} /> Back
            </button>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => setStep(3)} style={{ flex: 2 }}>
              <span>Next: Preview Listing</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview & Save */}
      {step === 3 && (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 600 }}>
            Live Preview of your Published Job Listing:
          </div>

          {/* LIVE PREVIEW CONTAINER */}
          <div className="search-box-wrapper" style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem', backgroundColor: '#FFFFFF' }}>
            {/* Header / Title */}
            {(() => {
              const selectedBusiness = businesses.find((b) => b.id === businessId);
              const companyName = selectedBusiness ? selectedBusiness.name : user?.name ? `${user.name} (Direct Employer)` : 'Direct Employer';

              return (
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  <div className="company-logo-box" style={{ width: 56, height: 56, flexShrink: 0 }}>
                    {selectedBusiness?.logoUrl ? (
                      <img src={selectedBusiness.logoUrl} alt={companyName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
                    ) : (
                      <Briefcase size={28} color="#64748B" />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.2rem', color: '#0F172A' }}>{title || 'Job Title'}</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#475569', marginBottom: '0.45rem' }}>
                      <span>{companyName}</span>
                      {selectedBusiness?.isVerified && (
                        <span title="Verified Business">
                          <ShieldCheck size={16} color="#2563EB" />
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '0.6rem' }}>
                      Norwalk, CT · {formatEmploymentType(employmentType)} · {formatSchedule(schedule)} · {formatWorkplaceType(isRemote)}
                    </div>
                    {salaryMin && (
                      <span className="salary-tag" style={{ fontSize: '0.9rem', padding: '0.25rem 0.75rem' }}>
                        ${salaryMin}{salaryMax ? ` – $${salaryMax}` : ''}/{salaryType === 'hourly' ? 'hr' : 'yr'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* 1. Job Overview */}
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.75rem', color: '#0F172A' }}>Job Overview</h3>
              <p style={{ color: '#334155', lineHeight: '1.7', whiteSpace: 'pre-line', fontSize: '0.975rem' }}>{description}</p>
            </div>

            {/* 2. Job Details */}
            <div style={{ paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                  <Briefcase size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Job Details</h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Key specifications & language preferences</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
                {salaryMin && (
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Pay & Salary</div>
                      <span style={{ display: 'inline-block', marginTop: '0.25rem', padding: '0.25rem 0.65rem', borderRadius: '8px', backgroundColor: '#F1F5F9', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                        ${salaryMin}{salaryMax ? ` – $${salaryMax}` : ''} / {salaryType === 'hourly' ? 'hour' : 'year'}
                      </span>
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: '#EFF6FF', color: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Employment Type</div>
                    <span style={{ display: 'inline-block', marginTop: '0.25rem', padding: '0.25rem 0.65rem', borderRadius: '8px', backgroundColor: '#F1F5F9', fontSize: '0.85rem', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                      {employmentType}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: '#FEF3C7', color: '#D97706', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Schedule</div>
                    <span style={{ display: 'inline-block', marginTop: '0.25rem', padding: '0.25rem 0.65rem', borderRadius: '8px', backgroundColor: '#F1F5F9', fontSize: '0.85rem', fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>
                      {schedule}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: 34, height: 34, borderRadius: '10px', backgroundColor: '#FCE7F3', color: '#DB2777', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Languages size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#0F172A' }}>Language Requirement</div>
                    <span style={{ display: 'inline-block', marginTop: '0.25rem', padding: '0.25rem 0.65rem', borderRadius: '8px', backgroundColor: '#F1F5F9', fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                      {languages || 'English Required'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Job Responsibilities Preview */}
            {previewResponsibilities.length > 0 && (
              <div style={{ paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#ECFDF5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                    <Briefcase size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Job Responsibilities</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Key tasks and daily expectations for this role</span>
                  </div>
                </div>

                <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: 0, margin: 0, listStyle: 'none' }}>
                  {previewResponsibilities.map((task, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                      <div style={{ width: 22, height: 22, borderRadius: '50%', backgroundColor: '#ECFDF5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '0.15rem' }}>
                        <Check size={13} strokeWidth={3} />
                      </div>
                      <span style={{ fontSize: '0.95rem', color: '#334155', lineHeight: '1.6', fontWeight: 500 }}>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 4. Benefits Preview */}
            {selectedBenefits.length > 0 && (
              <div style={{ paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
                  <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#D97706' }}>
                    <Sparkles size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Benefits</h3>
                    <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Perks and compensation advantages provided</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem' }}>
                  {selectedBenefits.map((bName, idx) => {
                    const preset = BENEFIT_PRESETS.find((p) => p.key === bName);
                    const IconComponent = preset ? preset.icon : Sparkles;
                    const bgColor = preset ? preset.bg : '#FEF9C3';
                    const textColor = preset ? preset.color : '#CA8A04';
                    const descText = preset ? preset.text : 'Included with position';

                    return (
                      <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                        <div
                          style={{
                            width: 36,
                            height: 36,
                            borderRadius: '10px',
                            backgroundColor: bgColor,
                            color: textColor,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                            marginTop: '0.1rem',
                          }}
                        >
                          <IconComponent size={18} />
                        </div>
                        <div>
                          <div style={{ fontSize: '0.925rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.15rem' }}>{bName}</div>
                          <div style={{ fontSize: '0.825rem', color: '#64748B', lineHeight: '1.45' }}>{descText}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 5. Workplace Gallery Preview */}
            {previewPhotos.length > 0 && (
              <div style={{ paddingTop: '2rem', borderTop: '1px solid #E2E8F0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div style={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563EB' }}>
                      <ImageIcon size={20} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0, color: '#0F172A' }}>Workplace Gallery</h3>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>Photos of the business environment</span>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '14px', overflow: 'hidden', backgroundColor: '#0F172A' }}>
                  <img src={previewPhotos[activePhotoIdx] || previewPhotos[0]} alt="Workplace photo preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginTop: '1rem' }}>
            {isEditing ? (
              <button
                type="button"
                className="btn btn-outline"
                onClick={handleDelete}
                style={{ color: '#DC2626', borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', borderRadius: '12px', gap: '0.5rem', fontWeight: 700 }}
                disabled={deleting || submitting}
              >
                <Trash2 size={18} />
                <span>{deleting ? 'Deleting Job...' : 'Delete Job'}</span>
              </button>
            ) : (
              <button type="button" className="btn btn-outline btn-lg" onClick={() => setStep(2)}>
                <ArrowLeft size={18} /> Edit Details
              </button>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn btn-outline btn-lg" onClick={() => setStep(2)}>
                <ArrowLeft size={18} /> Back
              </button>
              <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                {isEditing ? <Save size={18} /> : <Send size={18} />}
                <span>{submitting ? (isEditing ? 'Saving Changes...' : 'Publishing Job Listing...') : (isEditing ? 'Save Changes' : 'Publish Job Listing')}</span>
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
