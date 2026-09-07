'use client';

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { X, ChevronRight, Sparkles, Building2, Pencil, PlusCircle, Briefcase, FileText, Users, Bell, MessageCircle } from 'lucide-react';

interface TourStep {
  targetId: string | null;
  triggerId?: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  interactive?: boolean; // false = block clicks on spotlight element too
}

const TOUR_KEY = 'postplace_biz_dashboard_tour_v1';

const STEPS: TourStep[] = [
  {
    targetId: null,
    title: 'Welcome to your Business Dashboard! 🎉',
    description:
      'This is your control center. From here you can manage your business profile, post jobs, and review candidates who apply. Let us walk you through a quick tour.',
    icon: <Sparkles size={28} color="#E05638" />,
  },
  {
    targetId: 'tour-business-card',
    title: 'Your Business Profile',
    description:
      'This card shows all your business information: name, category, address, phone, and email. Candidates see this when they apply to your job postings.',
    icon: <Building2 size={22} color="#2563EB" />,
    position: 'bottom',
  },
  {
    targetId: 'tour-edit-business',
    title: 'Edit Business Profile',
    description:
      'Use this button to update your logo, description, category, address, and contact information at any time.',
    icon: <Pencil size={22} color="#E05638" />,
    position: 'bottom',
  },
  {
    targetId: 'tour-post-job',
    title: 'Post a New Job',
    description:
      'Click here to create a new job listing. You can add a title, description, salary, employment type, benefits, and more. Your posting will appear on the jobs page for the city.',
    icon: <PlusCircle size={22} color="#059669" />,
    position: 'bottom',
    interactive: false,
  },
  {
    targetId: 'tour-job-listings',
    title: 'Active Job Listings',
    description:
      'Here you can see all the jobs you have posted. Track how many people have applied to each one and manage their status (Active, Paused, or Closed).',
    icon: <Briefcase size={22} color="#7C3AED" />,
    position: 'bottom',
  },
  {
    targetId: 'tour-nav-employees',
    title: 'Employees & Staff',
    description:
      'Manage your full team from one place. View employee profiles, track hired applicants, assign roles, and communicate directly with your staff members.',
    icon: <Users size={22} color="#2563EB" />,
    position: 'bottom',
    interactive: false,
  },
  {
    targetId: 'tour-nav-messages',
    title: 'Messages',
    description:
      'Send and receive messages with job applicants and your team. All your conversations are organized in one inbox so you never miss an important reply.',
    icon: <MessageCircle size={22} color="#7C3AED" />,
    position: 'bottom',
    interactive: false,
  },
  {
    targetId: 'tour-nav-notifications',
    title: 'Notifications',
    description:
      'Stay on top of everything. Get real-time alerts for new job applications, messages from candidates, business updates, and important platform announcements.',
    icon: <Bell size={22} color="#D97706" />,
    position: 'bottom',
    interactive: false,
  },
  {
    targetId: 'tour-nav-profile',
    triggerId: 'tour-profile-menu-toggle',
    title: 'Profile & Settings ⚙️',
    description:
      'Click your name in the top right to access Profile & Settings. From here you can update your personal info, change your password, and manage your account preferences.',
    icon: <Users size={22} color="#059669" />,
    position: 'bottom',
    interactive: false,
  },
  {
    targetId: null,
    title: "You're all set! 🚀",
    description:
      'You now know your Business Dashboard. If you ever need a refresher, click "Tour" next to the page subtitle to replay this walkthrough. Good luck with your business in Norwalk!',
    icon: <Sparkles size={28} color="#E05638" />,
  },
];


// Viewport-relative rect (for position:fixed elements)
interface ViewportRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export default function DashboardTour({
  businessId,
  forceOpen,
  onClose,
  onActiveChange,
  isPaused,
}: {
  businessId?: string;
  forceOpen?: boolean;
  onClose?: () => void;
  onActiveChange?: (active: boolean) => void;
  isPaused?: boolean;
}) {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState<ViewportRect | null>(null);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const rafRef = useRef<number | null>(null);
  const [prevForceOpen, setPrevForceOpen] = useState(forceOpen);

  // Sync prop changes during render to avoid 1-frame flash of old step position
  if (forceOpen && !prevForceOpen) {
    setPrevForceOpen(true);
    setStep(0);
    setRect(null);
    setTooltipStyle({});
    setActive(true);
  } else if (!forceOpen && prevForceOpen) {
    setPrevForceOpen(false);
  }

  // Check localStorage on mount OR respond to forceOpen
  useEffect(() => {
    if (forceOpen) {
      onActiveChange?.(true);
      return;
    }
    const key = businessId ? `${TOUR_KEY}_${businessId}` : TOUR_KEY;
    const seen = localStorage.getItem(key);
    if (!seen) {
      setTimeout(() => {
        setActive(true);
        onActiveChange?.(true);
      }, 700);
    }
  }, [businessId, forceOpen]);

  const currentStep = STEPS[step];

  /** Measure the target element AFTER any scroll settles */
  const measureTarget = useCallback(() => {
    if (!currentStep.targetId) {
      setRect(null);
      setTooltipStyle({});
      return;
    }

    if (currentStep.triggerId) {
      const targetEl = document.getElementById(currentStep.targetId);
      if (!targetEl) {
        const triggerEl = document.getElementById(currentStep.triggerId);
        if (triggerEl) {
          triggerEl.click();
        }
      }
    }

    setTimeout(() => {
      const el = document.getElementById(currentStep.targetId!);
      if (!el) {
        setRect(null);
        setTooltipStyle({});
        return;
      }

      // 1. Scroll element into view
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // 2. Wait for scroll animation to complete, then measure
      if (rafRef.current) clearTimeout(rafRef.current as unknown as number);
      rafRef.current = setTimeout(() => {
        const r = el.getBoundingClientRect();

        // Viewport-relative coords (correct for position:fixed)
        const vr: ViewportRect = {
          top: r.top,
          left: r.left,
          width: r.width,
          height: r.height,
        };
        setRect(vr);

        // Compute tooltip placement
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const tooltipW = Math.min(340, vw - 32);
        const pad = 16;
        const pos = currentStep.position || 'bottom';
        const style: React.CSSProperties = { width: tooltipW, position: 'fixed' };

        if (pos === 'bottom') {
          style.top = Math.min(r.bottom + pad, vh - 260);
          style.left = Math.max(16, Math.min(r.left + r.width / 2 - tooltipW / 2, vw - tooltipW - 16));
        } else if (pos === 'top') {
          // Anchor below tooltip to just above the element — grows upward
          style.bottom = Math.max(16, vh - r.top + pad);
          style.left = Math.max(16, Math.min(r.left + r.width / 2 - tooltipW / 2, vw - tooltipW - 16));
          // If too little space above, fall back to below
          if (r.top < 260) {
            delete style.bottom;
            style.top = r.bottom + pad;
          }
        } else if (pos === 'left') {
          style.top = Math.max(16, r.top + r.height / 2 - 120);
          style.right = Math.max(16, vw - r.left + pad);
        } else if (pos === 'right') {
          style.top = Math.max(16, r.top + r.height / 2 - 120);
          style.left = r.right + pad;
        }

        setTooltipStyle(style);
      }, 520) as unknown as number;
    }, 50);
  }, [currentStep]);

  useEffect(() => {
    if (!active) return;
    setRect(null);
    setTooltipStyle({});
    measureTarget();

    const onResize = () => measureTarget();
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      if (rafRef.current) clearTimeout(rafRef.current as unknown as number);
    };
  }, [active, step, measureTarget]);

  const closeTriggerMenuIfNeeded = () => {
    if (currentStep?.triggerId) {
      const targetEl = document.getElementById(currentStep.targetId || '');
      if (targetEl) {
        const triggerEl = document.getElementById(currentStep.triggerId);
        triggerEl?.click();
      }
    }
  };

  const dismiss = () => {
    closeTriggerMenuIfNeeded();
    const key = businessId ? `${TOUR_KEY}_${businessId}` : TOUR_KEY;
    localStorage.setItem(key, 'true');
    setActive(false);
    setStep(0);
    setRect(null);
    setTooltipStyle({});
    onActiveChange?.(false);
    onClose?.();
  };

  const next = () => {
    closeTriggerMenuIfNeeded();
    setRect(null);
    setTooltipStyle({});
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
    } else {
      dismiss();
    }
  };

  // Lock body scroll while tour is active (robust cross-browser approach)
  useEffect(() => {
    if (!active) return;

    const SCROLL_KEYS = new Set(['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' ']);

    const blockWheel = (e: WheelEvent) => e.preventDefault();
    const blockTouch = (e: TouchEvent) => e.preventDefault();
    const blockKeys = (e: KeyboardEvent) => {
      if (SCROLL_KEYS.has(e.key)) e.preventDefault();
    };

    // Also set overflow on both html and body for extra safety
    const htmlEl = document.documentElement;
    const prevHtmlOverflow = htmlEl.style.overflow;
    const prevBodyOverflow = document.body.style.overflow;
    htmlEl.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    window.addEventListener('wheel', blockWheel, { passive: false });
    window.addEventListener('touchmove', blockTouch, { passive: false });
    window.addEventListener('keydown', blockKeys);

    return () => {
      htmlEl.style.overflow = prevHtmlOverflow;
      document.body.style.overflow = prevBodyOverflow;
      window.removeEventListener('wheel', blockWheel);
      window.removeEventListener('touchmove', blockTouch);
      window.removeEventListener('keydown', blockKeys);
    };
  }, [active]);

  if (!active) return null;

  const isCentered = !currentStep.targetId;
  const isLast = step === STEPS.length - 1;
  const progress = ((step + 1) / STEPS.length) * 100;
  // When paused (e.g. a modal is open), hide overlays so modal is fully usable
  const overlaysVisible = !isPaused;

  return (
    <>
      {/* Visual dark overlay (pointer-events:none — purely decorative) */}
      {overlaysVisible && isCentered && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9001,
            backgroundColor: 'rgba(0,0,0,0.72)',
          }}
        />
      )}
      {overlaysVisible && !isCentered && rect && (
          <svg
            style={{
              position: 'fixed',
              inset: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9001,
              pointerEvents: 'none',
            }}
          >
            <defs>
              <mask id="tour-spotlight-mask">
                <rect width="100%" height="100%" fill="white" />
                <rect
                  x={rect.left - 10}
                  y={rect.top - 10}
                  width={rect.width + 20}
                  height={rect.height + 20}
                  rx="16"
                  fill="black"
                />
              </mask>
            </defs>
            <rect
              width="100%"
              height="100%"
              fill="rgba(0,0,0,0.72)"
              mask="url(#tour-spotlight-mask)"
            />
          </svg>
      )}

      {/* 4 surrounding click-blockers */}
      {overlaysVisible && !isCentered && rect && (() => {
        const pad = 10;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const sx = rect.left - pad;
        const sy = rect.top - pad;
        const sw = rect.width + pad * 2;
        const sh = rect.height + pad * 2;
        const blockerStyle: React.CSSProperties = {
          position: 'fixed',
          zIndex: 9005,
          backgroundColor: 'transparent',
          cursor: 'default',
        };
        return (
          <>
            {/* Top */}
            <div style={{ ...blockerStyle, top: 0, left: 0, width: vw, height: Math.max(0, sy) }} />
            {/* Bottom */}
            <div style={{ ...blockerStyle, top: sy + sh, left: 0, width: vw, height: Math.max(0, vh - (sy + sh)) }} />
            {/* Left */}
            <div style={{ ...blockerStyle, top: sy, left: 0, width: Math.max(0, sx), height: sh }} />
            {/* Right */}
            <div style={{ ...blockerStyle, top: sy, left: sx + sw, width: Math.max(0, vw - (sx + sw)), height: sh }} />
            {/* Extra blocker over spotlight if step is non-interactive */}
            {currentStep.interactive === false && (
              <div style={{ ...blockerStyle, top: sy, left: sx, width: sw, height: sh, borderRadius: 16 }} />
            )}
          </>
        );
      })()}

      {/* Pulsing highlight ring around target */}
      {overlaysVisible && rect && !isCentered && (
        <div
          style={{
            position: 'fixed',
            top: rect.top - 10,
            left: rect.left - 10,
            width: rect.width + 20,
            height: rect.height + 20,
            borderRadius: 16,
            border: '2.5px solid #E05638',
            boxShadow: '0 0 0 3px rgba(224,86,56,0.25), 0 0 24px rgba(224,86,56,0.5)',
            zIndex: 9002,
            pointerEvents: 'none',
            animation: 'tourPulse 1.8s ease-in-out infinite',
          }}
        />
      )}

      {/* Tooltip card */}
      {(isCentered || rect) && (
        <div
          key={`tour-step-${step}`}
          style={
            isCentered
              ? {
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  zIndex: 9010,
                  width: Math.min(420, window.innerWidth - 32),
                  animation: 'tourCenterFadeIn 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }
              : {
                  ...tooltipStyle,
                  zIndex: 9010,
                  animation: 'tourFadeIn 0.25s ease',
                }
          }
        >
          <div
            style={{
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '1.5rem',
              boxShadow: '0 24px 60px rgba(0,0,0,0.3), 0 0 0 1px rgba(0,0,0,0.06)',
            }}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '12px',
                    backgroundColor: '#FFF4F1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {currentStep.icon}
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#E05638', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.1rem' }}>
                    Step {step + 1} of {STEPS.length}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#0F172A', margin: 0, lineHeight: 1.3 }}>
                    {currentStep.title}
                  </h3>
                </div>
              </div>
              <button
                onClick={dismiss}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', padding: '2px', borderRadius: '6px', display: 'flex', flexShrink: 0 }}
                title="Skip tour"
              >
                <X size={18} />
              </button>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.65, margin: '0 0 1.1rem 0' }}>
              {currentStep.description}
            </p>

            {/* Progress bar */}
            <div style={{ height: 4, backgroundColor: '#F1F5F9', borderRadius: 99, marginBottom: '1rem', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #E05638, #F97316)',
                  borderRadius: 99,
                  transition: 'width 0.4s ease',
                }}
              />
            </div>

            {/* Buttons — both on the right side */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.6rem' }}>
              <button
                onClick={dismiss}
                style={{
                  background: 'none',
                  border: '1.5px solid #E2E8F0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: '#64748B',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  padding: '0.5rem 0.9rem',
                  whiteSpace: 'nowrap',
                }}
              >
                Skip Tour
              </button>
              <button
                onClick={next}
                style={{
                  background: 'linear-gradient(135deg, #E05638, #F97316)',
                  border: 'none',
                  borderRadius: '10px',
                  color: '#FFFFFF',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  padding: '0.55rem 1.25rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  boxShadow: '0 4px 14px rgba(224,86,56,0.4)',
                  whiteSpace: 'nowrap',
                }}
              >
                {isLast ? 'Get Started! 🚀' : 'Continue'}
                {!isLast && <ChevronRight size={16} />}
              </button>
            </div>
          </div>

          {/* Arrow pointer */}
          {!isCentered && currentStep.position === 'bottom' && (
            <div style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderBottom: '8px solid #FFFFFF', filter: 'drop-shadow(0 -2px 2px rgba(0,0,0,0.08))' }} />
          )}
          {!isCentered && currentStep.position === 'top' && (
            <div style={{ position: 'absolute', bottom: -8, left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '8px solid transparent', borderRight: '8px solid transparent', borderTop: '8px solid #FFFFFF', filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.08))' }} />
          )}
          {!isCentered && currentStep.position === 'left' && (
            <div style={{ position: 'absolute', top: '50%', right: -8, transform: 'translateY(-50%)', width: 0, height: 0, borderTop: '8px solid transparent', borderBottom: '8px solid transparent', borderLeft: '8px solid #FFFFFF' }} />
          )}
        </div>
      )}

      <style>{`
        @keyframes tourCenterFadeIn {
          from { opacity: 0; transform: translate(-50%, -50%) scale(0.92); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes tourFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tourPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(224,86,56,0.25), 0 0 20px rgba(224,86,56,0.4); }
          50%       { box-shadow: 0 0 0 6px rgba(224,86,56,0.12), 0 0 36px rgba(224,86,56,0.6); }
        }
      `}</style>
    </>
  );
}
