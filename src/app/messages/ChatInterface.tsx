'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Send,
  User,
  MessageSquare,
  Search,
  Wrench,
  Briefcase,
  ShoppingBag,
  ShieldCheck,
  Phone,
  Paperclip,
  Smile,
  ChevronRight,
  Sparkles,
  ExternalLink,
  MapPin,
  Clock,
  Star
} from 'lucide-react';

interface ChatInterfaceProps {
  currentUser: any;
  initialConversations: any[];
  initialActiveId: string | null;
  initialContext?: any;
}

export default function ChatInterface({
  currentUser,
  initialConversations,
  initialActiveId,
  initialContext
}: ChatInterfaceProps) {
  const searchParams = useSearchParams();
  const userIdFromUrl = searchParams ? searchParams.get('userId') : null;

  const [conversations, setConversations] = useState(initialConversations);
  const [activeId, setActiveId] = useState<string | null>(initialActiveId);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'services' | 'jobs' | 'marketplace'>('all');
  const [activeContext, setActiveContext] = useState<any>(initialContext || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialConversations) {
      setConversations(initialConversations);
    }
  }, [initialConversations]);

  useEffect(() => {
    if (userIdFromUrl && conversations.length > 0) {
      const match = conversations.find(
        (c) => c.participant1Id === userIdFromUrl || c.participant2Id === userIdFromUrl
      );
      if (match) {
        setActiveId(match.id);
        return;
      }
    }
    if (initialActiveId) {
      setActiveId(initialActiveId);
    }
  }, [userIdFromUrl, initialActiveId, conversations]);

  useEffect(() => {
    if (activeId) {
      setLoadingMessages(true);
      fetch(`/api/messages?conversationId=${activeId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.messages) {
            setMessages(data.messages);
          }
        })
        .finally(() => setLoadingMessages(false));
    }
  }, [activeId]);

  const chatScrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatScrollContainerRef.current) {
      chatScrollContainerRef.current.scrollTop = chatScrollContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (textToSendInput?: string) => {
    const textToSend = textToSendInput || inputText;
    if (!textToSend.trim() || !activeId) return;

    if (!textToSendInput) setInputText('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: activeId,
          text: textToSend,
        }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);

        // Update last message in thread list
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === activeId) {
              return {
                ...c,
                lastMessageAt: new Date().toISOString(),
                messages: [data.message],
              };
            }
            return c;
          })
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  const getOtherParticipant = (conv: any) => {
    return conv.participant1Id === currentUser.id ? conv.participant2 : conv.participant1;
  };

  const activeConv = conversations.find((c) => c.id === activeId);
  const activeOtherUser = activeConv ? getOtherParticipant(activeConv) : null;

  // Filter conversations
  const filteredConversations = conversations.filter((conv) => {
    const other = getOtherParticipant(conv);
    const matchesSearch = other?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    if (activeFilter === 'services') return conv.relatedType === 'service_inquiry' || conv.relatedType === 'quote_request';
    if (activeFilter === 'jobs') return conv.relatedType === 'job_application';
    if (activeFilter === 'marketplace') return conv.relatedType === 'marketplace_item' || conv.relatedType === 'item_offer';

    return true;
  });

  const formatRoleBadge = (role: string) => {
    switch (role) {
      case 'SERVICE_PROVIDER':
        return { label: 'Service Pro', bg: '#F0FDF4', color: '#16845D', border: '#A7F3D0' };
      case 'EMPLOYER':
        return { label: 'Employer', bg: '#FFF1F2', color: '#E11D48', border: '#FECDD3' };
      case 'SELLER':
        return { label: 'Local Seller', bg: '#F5F3FF', color: '#6D28D9', border: '#DDD6FE' };
      default:
        return { label: 'Local Member', bg: '#F1F5F9', color: '#475569', border: '#E2E8F0' };
    }
  };

  return (
    <div className="chat-container">
      {/* Sidebar List */}
      <div className="chat-sidebar">
        {/* Sidebar Header & Search */}
        <div style={{ padding: '1rem', borderBottom: '1px solid #ECE7DF', backgroundColor: '#FAFAFA' }}>
          <div style={{ position: 'relative', marginBottom: '0.75rem' }}>
            <Search size={16} color="#94A3B8" style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2.4rem',
                fontSize: '0.875rem',
                border: '1px solid #E2E8F0',
                borderRadius: '10px',
                outline: 'none',
                backgroundColor: '#FFFFFF'
              }}
            />
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
            <button
              type="button"
              className={`chat-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              All
            </button>
            <button
              type="button"
              className={`chat-filter-btn ${activeFilter === 'services' ? 'active' : ''}`}
              onClick={() => setActiveFilter('services')}
            >
              Pros
            </button>
            <button
              type="button"
              className={`chat-filter-btn ${activeFilter === 'jobs' ? 'active' : ''}`}
              onClick={() => setActiveFilter('jobs')}
            >
              Jobs
            </button>
            <button
              type="button"
              className={`chat-filter-btn ${activeFilter === 'marketplace' ? 'active' : ''}`}
              onClick={() => setActiveFilter('marketplace')}
            >
              Buy & Sell
            </button>
          </div>
        </div>

        {/* Thread Items */}
        <div style={{ overflowY: 'auto', height: 'calc(100% - 110px)' }}>
          {filteredConversations.length === 0 ? (
            <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748B' }}>
              <MessageSquare size={32} color="#CBD5E1" style={{ margin: '0 auto 0.75rem auto' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>No conversations found</p>
              <p style={{ fontSize: '0.78rem', color: '#94A3B8' }}>Start a message from any job, service pro, or marketplace item.</p>
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const lastMsg = conv.messages?.[0]?.text || 'No messages yet';
              const lastTime = conv.messages?.[0]?.createdAt
                ? new Date(conv.messages[0].createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';
              const isActive = conv.id === activeId;
              const roleInfo = formatRoleBadge(other?.role);

              return (
                <div
                  key={conv.id}
                  className={`chat-thread-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveId(conv.id)}
                >
                  <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      {other?.avatarUrl ? (
                        <img src={other.avatarUrl} alt={other.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: 44, height: 44, borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0F172A' }}>
                          {other?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="chat-online-dot" />
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#0F172A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {other?.name || 'User'}
                        </div>
                        {lastTime && <span style={{ fontSize: '0.7rem', color: '#94A3B8', flexShrink: 0 }}>{lastTime}</span>}
                      </div>

                      <div style={{ marginBottom: '0.3rem' }}>
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            padding: '0.1rem 0.45rem',
                            borderRadius: '999px',
                            backgroundColor: roleInfo.bg,
                            color: roleInfo.color,
                            border: `1px solid ${roleInfo.border}`
                          }}
                        >
                          {roleInfo.label}
                        </span>
                      </div>

                      <div style={{ fontSize: '0.8rem', color: '#64748B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {lastMsg}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main Chat Pane */}
      <div className="chat-main">
        {activeOtherUser ? (
          <>
            {/* Active Header Bar */}
            <div className="chat-main-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <div style={{ position: 'relative' }}>
                  {activeOtherUser.avatarUrl ? (
                    <img src={activeOtherUser.avatarUrl} alt={activeOtherUser.name} style={{ width: 42, height: 42, borderRadius: '50%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: 42, height: 42, borderRadius: '50%', backgroundColor: '#E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#0F172A' }}>
                      {activeOtherUser.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="chat-online-dot" />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0F172A' }}>{activeOtherUser.name}</span>
                    <ShieldCheck size={16} color="#16845D" />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{formatRoleBadge(activeOtherUser.role).label}</span>
                    <span>•</span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                      <MapPin size={12} color="#16845D" /> Norwalk, CT
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {activeOtherUser.phone && (
                  <a
                    href={`tel:${activeOtherUser.phone}`}
                    className="btn-chat-header-action"
                    title={`Call ${activeOtherUser.name}`}
                  >
                    <Phone size={15} />
                    <span>Call</span>
                  </a>
                )}
              </div>
            </div>

            {/* Context Card Header (If Inquiry or Quote exists) */}
            {activeContext && (
              <div className="chat-context-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                  <div className="chat-context-icon">
                    {activeContext.type === 'service' && <Wrench size={20} color="#16845D" />}
                    {activeContext.type === 'job_application' && <Briefcase size={20} color="#E11D48" />}
                    {activeContext.type === 'marketplace_item' && <ShoppingBag size={20} color="#6D28D9" />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.15rem' }}>
                      <span className="chat-context-badge">
                        {activeContext.type === 'service' ? 'SERVICE INQUIRY' : activeContext.type === 'job_application' ? 'JOB APPLICATION' : 'MARKETPLACE ITEM'}
                      </span>
                    </div>

                    {activeContext.type === 'service' && (
                      <>
                        <div className="chat-context-title">{activeContext.data.name}</div>
                        <div className="chat-context-sub">
                          {activeContext.data.category?.name || 'Local Service'} • ${activeContext.data.priceAmount}/hr • {activeContext.data.location?.neighborhood || 'Norwalk'}
                        </div>
                      </>
                    )}

                    {activeContext.type === 'job_application' && (
                      <>
                        <div className="chat-context-title">{activeContext.data.job?.title}</div>
                        <div className="chat-context-sub">
                          {activeContext.data.job?.business?.name || 'Employer'} • {activeContext.data.job?.salaryMin ? `$${activeContext.data.job.salaryMin}/hr` : 'Competitive'} • Status: {activeContext.data.status}
                        </div>
                      </>
                    )}

                    {activeContext.type === 'marketplace_item' && (
                      <>
                        <div className="chat-context-title">{activeContext.data.title}</div>
                        <div className="chat-context-sub">
                          Price: {activeContext.data.price === 0 ? 'FREE' : `$${activeContext.data.price}`} • Condition: {activeContext.data.condition} • {activeContext.data.location?.neighborhood || 'Norwalk'}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                  {activeContext.type === 'service' && (
                    <Link href={`/services/${activeContext.data.id}`} className="btn-chat-context-action">
                      View Service <ChevronRight size={14} />
                    </Link>
                  )}
                  {activeContext.type === 'job_application' && (
                    <Link href={`/jobs/${activeContext.data.jobId}`} className="btn-chat-context-action">
                      View Job <ChevronRight size={14} />
                    </Link>
                  )}
                  {activeContext.type === 'marketplace_item' && (
                    <Link href={`/marketplace/${activeContext.data.id}`} className="btn-chat-context-action">
                      View Item <ChevronRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Scrollable Messages Area */}
            <div className="chat-messages-scroll" ref={chatScrollContainerRef}>
              {loadingMessages ? (
                <div style={{ textAlign: 'center', color: '#64748B', padding: '3rem 0' }}>
                  <Clock className="animate-spin" size={24} style={{ margin: '0 auto 0.5rem auto' }} />
                  <p>Loading messages...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="chat-empty-hero">
                  <div className="chat-hero-avatar-wrap">
                    {activeOtherUser.avatarUrl ? (
                      <img src={activeOtherUser.avatarUrl} alt={activeOtherUser.name} className="chat-hero-img" />
                    ) : (
                      <div className="chat-hero-img-fallback">
                        {activeOtherUser.name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                    Start a conversation with {activeOtherUser.name}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#64748B', maxWidth: 420, margin: '0 auto 1.5rem auto' }}>
                    Ask about work availability, request a free project quote, or discuss details directly.
                  </p>

                  {/* Starter Quick Action Pills */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxWidth: 460, margin: '0 auto' }}>
                    <button
                      type="button"
                      className="chat-starter-pill"
                      onClick={() => handleSendMessage(`👋 Hi ${activeOtherUser.name.split(' ')[0]}, are you available for work this week?`)}
                    >
                      <span>👋 Hi {activeOtherUser.name.split(' ')[0]}, are you available for work this week?</span>
                      <Send size={14} color="#16845D" />
                    </button>
                    <button
                      type="button"
                      className="chat-starter-pill"
                      onClick={() => handleSendMessage(`Can you provide a free quote or estimate for a project in Norwalk?`)}
                    >
                      <span>Can you provide a free quote or estimate for a project in Norwalk?</span>
                      <Send size={14} color="#16845D" />
                    </button>
                    <button
                      type="button"
                      className="chat-starter-pill"
                      onClick={() => handleSendMessage(`What are your best rates and schedule in Fairfield County?`)}
                    >
                      <span>What are your best rates and schedule in Fairfield County?</span>
                      <Send size={14} color="#16845D" />
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMine = msg.senderId === currentUser.id;
                  const showTime = true;

                  return (
                    <div key={msg.id || index} className={`message-row ${isMine ? 'mine' : 'other'}`}>
                      {!isMine && (
                        <img
                          src={activeOtherUser.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                          alt={activeOtherUser.name}
                          className="msg-user-avatar"
                        />
                      )}
                      <div className={`message-bubble ${isMine ? 'mine' : 'other'}`}>
                        <div className="msg-text">{msg.text}</div>
                        <div className="msg-timestamp">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          {isMine && <span style={{ marginLeft: '0.3rem', color: 'rgba(255,255,255,0.85)' }}>✓</span>}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form onSubmit={onSubmit} className="chat-input-card">
              <button
                type="button"
                className="chat-input-icon-btn"
                title="Attach photo or document"
                onClick={() => alert('Attachment upload ready')}
              >
                <Paperclip size={18} color="#64748B" />
              </button>

              <input
                type="text"
                className="chat-input-field"
                placeholder={`Write a message to ${activeOtherUser.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />

              <button
                type="submit"
                disabled={!inputText.trim()}
                className={`chat-send-btn ${inputText.trim() ? 'active' : ''}`}
              >
                <span>Send</span>
                <Send size={15} />
              </button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#64748B', padding: '2rem' }}>
            <MessageSquare size={48} color="#CBD5E1" style={{ marginBottom: '1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '0.3rem' }}>Select a Conversation</h3>
            <p style={{ fontSize: '0.875rem', color: '#64748B' }}>Choose a message thread on the left to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
