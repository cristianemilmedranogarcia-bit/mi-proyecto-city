'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { MapPin, Briefcase, Wrench, ShoppingBag, Bookmark, MessageSquare, Bell, PlusCircle, User, ShieldAlert, LogOut, X, Tag, ChevronDown, Check, Compass, Map, Users, Building2 } from 'lucide-react';

const US_STATES: Record<string, { name: string; cities: string[] }> = {
  CT: { name: 'Connecticut', cities: ['All Connecticut', 'Norwalk', 'Stamford', 'Greenwich', 'Danbury', 'Hartford', 'New Haven'] },
  NY: { name: 'New York', cities: ['All New York', 'New York City', 'Brooklyn', 'Queens', 'Albany', 'Buffalo', 'White Plains'] },
  NJ: { name: 'New Jersey', cities: ['All New Jersey', 'Newark', 'Jersey City', 'Hoboken', 'Princeton', 'Trenton'] },
  AZ: { name: 'Arizona', cities: ['All Arizona', 'Phoenix', 'Tucson', 'Mesa', 'Scottsdale', 'Chandler'] },
  FL: { name: 'Florida', cities: ['All Florida', 'Miami', 'Orlando', 'Tampa', 'Fort Lauderdale', 'Jacksonville'] },
  CA: { name: 'California', cities: ['All California', 'Los Angeles', 'San Francisco', 'San Diego', 'San Jose'] },
  TX: { name: 'Texas', cities: ['All Texas', 'Austin', 'Houston', 'Dallas', 'San Antonio'] },
  MA: { name: 'Massachusetts', cities: ['All Massachusetts', 'Boston', 'Cambridge', 'Worcester', 'Springfield'] },
  PA: { name: 'Pennsylvania', cities: ['All Pennsylvania', 'Philadelphia', 'Pittsburgh', 'Allentown'] },
  IL: { name: 'Illinois', cities: ['All Illinois', 'Chicago', 'Naperville', 'Rockford'] },
};

function formatTimeAgo(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSec = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSec < 60) return 'Just now';
  if (diffInSec < 3600) return `${Math.floor(diffInSec / 60)}m ago`;
  if (diffInSec < 86400) return `${Math.floor(diffInSec / 3600)}h ago`;
  return `${Math.floor(diffInSec / 86400)}d ago`;
}

interface NavbarProps {
  currentUser?: any;
}

function NavbarContent({ currentUser: initialUser }: NavbarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(initialUser || null);
  const [selectedState, setSelectedState] = useState('CT');
  const [selectedCity, setSelectedCity] = useState('Norwalk');
  const [showStateMenu, setShowStateMenu] = useState(false);
  const [showCityMenu, setShowCityMenu] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const [showMessagesPopover, setShowMessagesPopover] = useState(false);
  const [showNotificationsPopover, setShowNotificationsPopover] = useState(false);
  const [recentNotifications, setRecentNotifications] = useState<any[]>([]);
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const msgHoverTimer = React.useRef<any>(null);
  const notifHoverTimer = React.useRef<any>(null);

  const fetchNotificationsPreview = async () => {
    setLoadingNotifications(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setRecentNotifications(data.notifications || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingNotifications(false);
    }
  };

  const fetchMessagesPreview = async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/messages');
      if (res.ok) {
        const data = await res.json();
        setRecentConversations(data.conversations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleMessagesMouseEnter = () => {
    if (msgHoverTimer.current) clearTimeout(msgHoverTimer.current);
    setShowMessagesPopover(true);
    setShowNotificationsPopover(false);
    fetchMessagesPreview();
  };

  const handleMessagesMouseLeave = () => {
    msgHoverTimer.current = setTimeout(() => {
      setShowMessagesPopover(false);
    }, 220);
  };

  const handleNotificationsMouseEnter = () => {
    if (notifHoverTimer.current) clearTimeout(notifHoverTimer.current);
    setShowNotificationsPopover(true);
    setShowMessagesPopover(false);
    fetchNotificationsPreview();
  };

  const handleNotificationsMouseLeave = () => {
    notifHoverTimer.current = setTimeout(() => {
      setShowNotificationsPopover(false);
    }, 220);
  };

  const handleMarkAllNotificationsRead = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await fetch('/api/notifications', { method: 'PATCH' });
      setUnreadNotifications(0);
      setRecentNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (e) {
      console.error(e);
    }
  };

  const handleStateChange = (newState: string) => {
    setSelectedState(newState);
    const defaultCity = US_STATES[newState]?.cities[0] || 'All Cities';
    setSelectedCity(defaultCity);
    if (typeof window !== 'undefined') {
      localStorage.setItem('postplace_state', newState);
      localStorage.setItem('postplace_city', defaultCity);
    }
    const targetPath = pathname || '/';
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    params.set('state', newState);
    params.set('city', defaultCity);
    router.push(`${targetPath}?${params.toString()}`);
  };

  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity);
    if (typeof window !== 'undefined') {
      localStorage.setItem('postplace_city', newCity);
    }
    const targetPath = pathname || '/';
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    params.set('state', selectedState);
    params.set('city', newCity);
    router.push(`${targetPath}?${params.toString()}`);
  };

  const getNavHref = (basePath: string) => {
    return `${basePath}?state=${selectedState}&city=${encodeURIComponent(selectedCity)}`;
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        !target.closest('.brand-badge-pill') &&
        !target.closest('.city-select-pill-btn') &&
        !target.closest('.custom-popover-menu') &&
        !target.closest('.nav-dropdown-popover') &&
        !target.closest('.nav-link')
      ) {
        setShowStateMenu(false);
        setShowCityMenu(false);
        setShowMessagesPopover(false);
        setShowNotificationsPopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSt = localStorage.getItem('postplace_state');
      if (savedSt && US_STATES[savedSt]) {
        setSelectedState(savedSt);
      }
      const savedCt = localStorage.getItem('postplace_city');
      if (savedCt) {
        setSelectedCity(savedCt);
      }
    }

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          setUnreadMessages(data.unreadMessages || 0);
          setUnreadNotifications(data.unreadNotifications || 0);
        }
      })
      .catch(() => { });
  }, []);

  const handleSwitchRole = async (newRole: string) => {
    try {
      const res = await fetch('/api/auth/switch-role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ activeRole: newRole }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
    router.push('/login');
    router.refresh();
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexShrink: 0, minWidth: '350px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Link href={getNavHref('/')} className="brand-logo" style={{ fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
                <span>Post<span style={{ color: '#16845d' }}>Place</span></span>
              </Link>

              {/* Custom State Dropdown Badge Pill */}
              <div style={{ position: 'relative', zIndex: 300 }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowStateMenu((prev) => !prev);
                    setShowCityMenu(false);
                  }}
                  className="brand-badge-pill"
                  title="Select State"
                  style={{ border: '1.5px solid var(--brand-accent-border)', outline: 'none' }}
                >
                  <span>{selectedState}</span>
                  <ChevronDown
                    size={11}
                    strokeWidth={2.5}
                    style={{ transform: showStateMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                  />
                </button>

                {/* Custom PostPlace State Menu */}
                {showStateMenu && (
                  <div className="custom-popover-menu" style={{ width: '220px', zIndex: 500 }}>
                    <div className="custom-popover-header">Select State</div>
                    <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                      {Object.keys(US_STATES).map((st) => {
                        const isSelected = st === selectedState;
                        return (
                          <div
                            key={st}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStateChange(st);
                              setShowStateMenu(false);
                            }}
                            className={`custom-popover-item ${isSelected ? 'active' : ''}`}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
                              <span className="popover-state-code">{st}</span>
                              <span className="popover-state-name">{US_STATES[st].name}</span>
                            </div>
                            {isSelected && <Check size={14} color="#16845d" strokeWidth={2.5} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Custom City Selector */}
            <div style={{ position: 'relative', zIndex: 300 }}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowCityMenu((prev) => !prev);
                  setShowStateMenu(false);
                }}
                className="city-select-pill-btn"
              >
                <MapPin size={15} color="#16845d" />
                <span
                  className="city-pill-text"
                  title={selectedCity.startsWith('All') ? selectedCity : `${selectedCity}, ${selectedState}`}
                >
                  {selectedCity.startsWith('All') ? selectedCity : `${selectedCity}, ${selectedState}`}
                </span>
                <ChevronDown
                  size={12}
                  strokeWidth={2}
                  style={{ transform: showCityMenu ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }}
                />
              </button>

              {/* Custom PostPlace City Menu */}
              {showCityMenu && (
                <div className="custom-popover-menu" style={{ width: '220px', zIndex: 500 }}>
                  <div className="custom-popover-header">
                    Cities in {US_STATES[selectedState]?.name || selectedState}
                  </div>
                  <div style={{ maxHeight: '260px', overflowY: 'auto' }}>
                    {US_STATES[selectedState]?.cities.map((city) => {
                      const isSelected = city === selectedCity;
                      return (
                        <div
                          key={city}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCityChange(city);
                            setShowCityMenu(false);
                          }}
                          className={`custom-popover-item ${isSelected ? 'active' : ''}`}
                        >
                          <span className="popover-city-name">{city}</span>
                          {isSelected && <Check size={14} color="#16845d" strokeWidth={2.5} />}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Nav Links */}
          <ul className="nav-links">
            <li>
              <Link prefetch={true} href="/jobs" className={`nav-link ${pathname.startsWith('/jobs') ? 'active' : ''}`}>
                <Briefcase size={17} strokeWidth={1.85} />
                <span>Jobs</span>
              </Link>
            </li>
            <li>
              <Link prefetch={true} href="/services" className={`nav-link ${pathname.startsWith('/services') ? 'active' : ''}`}>
                <Wrench size={17} strokeWidth={1.85} />
                <span>Services</span>
              </Link>
            </li>
            <li>
              <Link prefetch={true} href="/marketplace" className={`nav-link ${pathname.startsWith('/marketplace') ? 'active' : ''}`}>
                <ShoppingBag size={17} strokeWidth={1.85} />
                <span>Buy & Sell</span>
              </Link>
            </li>
            {user?.role === 'EMPLOYER' ? (
              <li>
                <Link prefetch={true} href="/employer/dashboard" className={`nav-link ${pathname.startsWith('/employer/dashboard') ? 'active' : ''}`}>
                  <Building2 size={17} strokeWidth={1.85} />
                  <span>Dashboard</span>
                </Link>
              </li>
            ) : (
              <li>
                <Link prefetch={true} href={getNavHref('/nearby')} className={`nav-link ${pathname.startsWith('/nearby') ? 'active' : ''}`}>
                  <Map size={17} strokeWidth={1.85} />
                  <span>Maps</span>
                </Link>
              </li>
            )}
            {user?.role === 'EMPLOYER' ? (
              <li>
                <Link prefetch={true} id="tour-nav-employees" href="/employer/employees" className={`nav-link ${pathname.startsWith('/employer/employees') ? 'active' : ''}`}>
                  <Users size={17} strokeWidth={1.85} />
                  <span>Employees</span>
                </Link>
              </li>
            ) : (
              <li>
                <Link prefetch={true} href={getNavHref('/saved')} className={`nav-link ${pathname.startsWith('/saved') ? 'active' : ''}`}>
                  <Bookmark size={17} strokeWidth={1.85} />
                  <span>Saved</span>
                </Link>
              </li>
            )}
            {user && (
              <>
                <li
                  style={{ position: 'relative' }}
                  onMouseEnter={handleMessagesMouseEnter}
                  onMouseLeave={handleMessagesMouseLeave}
                >
                  <Link
                    id="tour-nav-messages"
                    href={user?.role === 'EMPLOYER' ? '/employer/dashboard?tab=messages' : '/messages'}
                    className={`nav-link ${pathname.startsWith('/messages') || (pathname.startsWith('/employer/dashboard') && searchParams?.get('tab') === 'messages') ? 'active' : ''}`}
                  >
                    <MessageSquare size={17} strokeWidth={1.85} />
                    <span>Messages</span>
                    {unreadMessages > 0 && <span className="nav-badge">{unreadMessages}</span>}
                  </Link>

                  {/* Messages Hover Popover */}
                  {showMessagesPopover && (
                    <div
                      className="nav-dropdown-popover"
                      style={{ right: '-20px', width: '340px' }}
                      onMouseEnter={() => {
                        if (msgHoverTimer.current) clearTimeout(msgHoverTimer.current);
                      }}
                      onMouseLeave={handleMessagesMouseLeave}
                    >
                      <div className="nav-dropdown-header">
                        <span className="nav-dropdown-title">
                          <MessageSquare size={16} color="#16845d" /> Messages
                        </span>
                        {unreadMessages > 0 && (
                          <span className="nav-badge" style={{ fontSize: '0.68rem' }}>
                            {unreadMessages} unread
                          </span>
                        )}
                      </div>

                      <div className="nav-dropdown-body">
                        {loadingMessages && recentConversations.length === 0 ? (
                          <div style={{ padding: '1.25rem', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
                            Loading messages...
                          </div>
                        ) : recentConversations.length === 0 ? (
                          <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
                            No messages yet.
                          </div>
                        ) : (
                          recentConversations.slice(0, 4).map((conv) => {
                            const otherParticipant =
                              conv.participant1Id === user?.id ? conv.participant2 : conv.participant1;
                            const lastMsg = conv.messages && conv.messages[0];
                            const isUnread = lastMsg && !lastMsg.isRead && lastMsg.senderId !== user?.id;

                            return (
                              <div
                                key={conv.id}
                                onClick={() => {
                                  setShowMessagesPopover(false);
                                  router.push(`/messages?conversationId=${conv.id}`);
                                }}
                                className={`nav-dropdown-item ${isUnread ? 'unread' : ''}`}
                              >
                                <div
                                  style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    backgroundColor: '#E2E8F0',
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  {otherParticipant?.avatarUrl ? (
                                    <img
                                      src={otherParticipant.avatarUrl}
                                      alt={otherParticipant.name}
                                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                  ) : (
                                    <User size={18} color="#64748B" />
                                  )}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      {otherParticipant?.name || 'User'}
                                    </span>
                                    {lastMsg && (
                                      <span style={{ fontSize: '0.72rem', color: '#94A3B8' }}>
                                        {formatTimeAgo(lastMsg.createdAt)}
                                      </span>
                                    )}
                                  </div>
                                  <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                    {lastMsg ? lastMsg.text : 'No messages'}
                                  </p>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>

                      <div className="nav-dropdown-footer">
                        <Link
                          href="/messages"
                          className="nav-dropdown-footer-link"
                          onClick={() => setShowMessagesPopover(false)}
                        >
                          View All Messages →
                        </Link>
                      </div>
                    </div>
                  )}
                </li>

                <li
                  style={{ position: 'relative' }}
                  onMouseEnter={handleNotificationsMouseEnter}
                  onMouseLeave={handleNotificationsMouseLeave}
                >
                  <Link id="tour-nav-notifications" href="/notifications" className={`nav-link ${pathname.startsWith('/notifications') ? 'active' : ''}`}>
                    <Bell size={17} strokeWidth={1.85} />
                    <span>Notifications</span>
                    {unreadNotifications > 0 && <span className="nav-badge">{unreadNotifications}</span>}
                  </Link>

                  {/* Notifications Hover Popover */}
                  {showNotificationsPopover && (
                    <div
                      className="nav-dropdown-popover"
                      style={{ right: '-10px', width: '350px' }}
                      onMouseEnter={() => {
                        if (notifHoverTimer.current) clearTimeout(notifHoverTimer.current);
                      }}
                      onMouseLeave={handleNotificationsMouseLeave}
                    >
                      <div className="nav-dropdown-header">
                        <span className="nav-dropdown-title">
                          <Bell size={16} color="#16845d" /> Notifications
                        </span>
                        {unreadNotifications > 0 && (
                          <button
                            onClick={handleMarkAllNotificationsRead}
                            style={{
                              background: 'none',
                              border: 'none',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              color: '#16845d',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="nav-dropdown-body">
                        {loadingNotifications && recentNotifications.length === 0 ? (
                          <div style={{ padding: '1.25rem', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
                            Loading notifications...
                          </div>
                        ) : recentNotifications.length === 0 ? (
                          <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: '#64748B', fontSize: '0.82rem' }}>
                            No notifications yet.
                          </div>
                        ) : (
                          recentNotifications.slice(0, 5).map((notif) => (
                            <div
                              key={notif.id}
                              onClick={() => {
                                setShowNotificationsPopover(false);
                                router.push(notif.link || '/notifications');
                              }}
                              className={`nav-dropdown-item ${!notif.isRead ? 'unread' : ''}`}
                            >
                              <div
                                style={{
                                  width: 32,
                                  height: 32,
                                  borderRadius: '50%',
                                  backgroundColor: !notif.isRead ? '#DCFCE7' : '#F1F5F9',
                                  color: !notif.isRead ? '#16845d' : '#64748B',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                  marginTop: '0.1rem',
                                }}
                              >
                                <Bell size={15} />
                              </div>
                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                                  <span style={{ fontWeight: 700, fontSize: '0.82rem', color: '#0F172A' }}>
                                    {notif.title}
                                  </span>
                                  <span style={{ fontSize: '0.7rem', color: '#94A3B8', marginLeft: '0.4rem' }}>
                                    {formatTimeAgo(notif.createdAt)}
                                  </span>
                                </div>
                                <p style={{ fontSize: '0.78rem', color: '#475569', margin: 0, lineHeight: '1.35' }}>
                                  {notif.message}
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="nav-dropdown-footer">
                        <Link
                          href="/notifications"
                          className="nav-dropdown-footer-link"
                          onClick={() => setShowNotificationsPopover(false)}
                        >
                          View All Notifications →
                        </Link>
                      </div>
                    </div>
                  )}
                </li>
              </>
            )}
          </ul>

          {/* Right Header Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
            {/* Post Something Primary CTA */}
            {pathname !== '/employer/dashboard' && (
              <button className="btn btn-primary btn-sm" onClick={() => setShowPostModal(true)}>
                <PlusCircle size={15} />
                <span>Post Something</span>
              </button>
            )}

            {/* Auth / Profile Area */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <button
                  id="tour-profile-menu-toggle"
                  className="btn btn-outline"
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  style={{ gap: '0.4rem', padding: '0.4rem 0.8rem' }}
                >
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt={user.name}
                      style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
                    />
                  ) : (
                    <User size={18} />
                  )}
                  <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{user.name.split(' ')[0]}</span>
                </button>

                {/* Profile Dropdown */}
                {showProfileMenu && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '250px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                      borderRadius: '14px',
                      boxShadow: '0 12px 30px -5px rgba(15, 23, 42, 0.15)',
                      padding: '0.85rem',
                      zIndex: 200,
                    }}
                  >
                    {/* User Header */}
                    <div style={{ padding: '0.4rem 0.5rem 0.65rem 0.5rem', borderBottom: '1.5px solid #E2E8F0', marginBottom: '0.65rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {user.name}
                        </span>
                        {(() => {
                          const isEmployer = user.role === 'EMPLOYER';
                          const isBizVerified = user.business?.isVerified || user.businesses?.[0]?.isVerified;
                          if (!isEmployer) {
                            return (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#E05638', backgroundColor: '#FFF4F1', border: '1px solid #FFDDD5', padding: '0.15rem 0.45rem', borderRadius: '5px', flexShrink: 0 }}>
                                Personal
                              </span>
                            );
                          }
                          if (isBizVerified) {
                            return (
                              <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#047857', backgroundColor: '#ECFDF5', border: '1px solid #A7F3D0', padding: '0.15rem 0.45rem', borderRadius: '5px', flexShrink: 0 }}>
                                ✓ Verified
                              </span>
                            );
                          }
                          return (
                            <span style={{ fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', color: '#D97706', backgroundColor: '#FEF3C7', border: '1px solid #FDE68A', padding: '0.15rem 0.45rem', borderRadius: '5px', flexShrink: 0 }}>
                              ⏳ Pending
                            </span>
                          );
                        })()}
                      </div>
                      <div style={{ fontSize: '0.775rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: '0.5rem' }}>
                        {user.email}
                      </div>

                      <Link
                        href="/profile"
                        id="tour-nav-profile"
                        onClick={() => setShowProfileMenu(false)}
                        className={`profile-menu-item ${pathname === '/profile' ? 'active' : ''}`}
                        style={{ margin: '0.2rem -0.3rem 0 -0.3rem' }}
                      >
                        <User size={16} color="#059669" />
                        <span>Profile & Settings</span>
                      </Link>
                    </div>

                    {/* Navigation Links */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {user.role === 'EMPLOYER' ? (
                        <>
                          <Link
                            href="/employer/dashboard"
                            onClick={() => setShowProfileMenu(false)}
                            className={`profile-menu-item ${pathname === '/employer/dashboard' ? 'active' : ''}`}
                          >
                            <Building2 size={17} color="#E05638" />
                            <span>Business Dashboard</span>
                          </Link>

                          <Link
                            href="/employer/employees"
                            onClick={() => setShowProfileMenu(false)}
                            className={`profile-menu-item ${pathname.startsWith('/employer/employees') ? 'active' : ''}`}
                          >
                            <Users size={17} color="#2563EB" />
                            <span>Employees & Staff</span>
                          </Link>
                        </>
                      ) : (
                        <Link
                          href="/saved"
                          onClick={() => setShowProfileMenu(false)}
                          className={`profile-menu-item ${pathname === '/saved' ? 'active' : ''}`}
                        >
                          <Bookmark size={17} color="#E05638" />
                          <span>My Saved & Applications</span>
                        </Link>
                      )}

                      {/* Messages Shortcut */}
                      <Link
                        href="/messages"
                        onClick={() => setShowProfileMenu(false)}
                        className={`profile-menu-item ${pathname.startsWith('/messages') ? 'active' : ''}`}
                        style={{ justifyContent: 'space-between' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <MessageSquare size={17} color="#7C3AED" />
                          <span>Messages</span>
                        </div>
                        {unreadMessages > 0 && (
                          <span className="nav-badge" style={{ position: 'static' }}>
                            {unreadMessages}
                          </span>
                        )}
                      </Link>

                      {/* Notifications Shortcut */}
                      <Link
                        href="/notifications"
                        onClick={() => setShowProfileMenu(false)}
                        className={`profile-menu-item ${pathname.startsWith('/notifications') ? 'active' : ''}`}
                        style={{ justifyContent: 'space-between' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <Bell size={17} color="#D97706" />
                          <span>Notifications</span>
                        </div>
                        {unreadNotifications > 0 && (
                          <span className="nav-badge" style={{ position: 'static' }}>
                            {unreadNotifications}
                          </span>
                        )}
                      </Link>

                      {user.role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          onClick={() => setShowProfileMenu(false)}
                          className={`profile-menu-item ${pathname.startsWith('/admin') ? 'active' : ''}`}
                          style={{ color: '#DC2626', backgroundColor: pathname.startsWith('/admin') ? '#FEF2F2' : 'transparent' }}
                        >
                          <ShieldAlert size={17} />
                          <span>Admin System</span>
                        </Link>
                      )}

                      {/* Divider & Bottom Section */}
                      <div style={{ borderTop: '1.5px solid #E2E8F0', marginTop: '0.4rem', paddingTop: '0.4rem' }}>
                        <button
                          onClick={handleLogout}
                          className="profile-menu-item"
                          style={{
                            color: '#64748B',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            width: '100%',
                          }}
                        >
                          <LogOut size={17} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Link
                  href="/login"
                  className="btn btn-outline btn-sm"
                  style={{ height: '37px', padding: '0 1.15rem', fontSize: '0.85rem', fontWeight: 700 }}
                >
                  Sign In
                </Link>
                <Link href="/register" className="btn btn-dark btn-sm">
                  Create Account
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Post Modal Choice */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>What would you like to post?</h3>
              <button
                onClick={() => setShowPostModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748B' }}
              >
                <X size={20} />
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              <div
                onClick={() => {
                  setShowPostModal(false);
                  router.push('/post/job');
                }}
                style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#FFFFFF',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#E05638')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: '#FFF4F1',
                    color: '#E05638',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto',
                  }}
                >
                  <Briefcase size={22} />
                </div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Post a Job</h4>
                <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Hiring staff or local gig help
                </p>
              </div>

              <div
                onClick={() => {
                  setShowPostModal(false);
                  router.push('/post/service');
                }}
                style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#FFFFFF',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#0F172A')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: '#F1F5F9',
                    color: '#0F172A',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto',
                  }}
                >
                  <Wrench size={22} />
                </div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Offer Service</h4>
                <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Handyman, cleaning, plumbing
                </p>
              </div>

              <div
                onClick={() => {
                  setShowPostModal(false);
                  router.push('/post/item');
                }}
                style={{
                  border: '1px solid #CBD5E1',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  backgroundColor: '#FFFFFF',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#059669')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#CBD5E1')}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: '#ECFDF5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 0.75rem auto',
                  }}
                >
                  <Tag size={22} />
                </div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.3rem' }}>Sell an Item</h4>
                <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
                  Electronics, furniture, cars, tools
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Navbar(props: NavbarProps) {
  return (
    <React.Suspense fallback={<header className="navbar"><div className="navbar-inner"></div></header>}>
      <NavbarContent {...props} />
    </React.Suspense>
  );
}
