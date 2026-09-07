'use client';

import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, User, MessageSquare, ExternalLink, Sparkles, CheckCheck } from 'lucide-react';
import Link from 'next/link';

interface QuickChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipient: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    position?: string;
    avatarUrl?: string;
  };
  applicationId?: string;
}

export default function QuickChatModal({
  isOpen,
  onClose,
  recipient,
  applicationId,
}: QuickChatModalProps) {
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && recipient?.id) {
      setLoading(true);
      fetch('/api/messages')
        .then((res) => res.json())
        .then((data) => {
          if (data.conversations) {
            const match = data.conversations.find(
              (c: any) => c.participant1Id === recipient.id || c.participant2Id === recipient.id
            );
            if (match) {
              setConversationId(match.id);
              return fetch(`/api/messages?conversationId=${match.id}`)
                .then((res) => res.json())
                .then((msgData) => {
                  if (msgData.messages) {
                    setMessages(msgData.messages);
                  }
                });
            } else {
              setConversationId(null);
              setMessages([]);
            }
          }
        })
        .catch((err) => console.error('Failed to load chat modal messages:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, recipient?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen || !recipient || !mounted) return null;

  const handleSend = async (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const textToSend = customText || inputText;
    if (!textToSend.trim() || sending) return;

    setSending(true);
    if (!customText) setInputText('');

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: recipient.id,
          conversationId,
          text: textToSend.trim(),
          relatedType: applicationId ? 'job_application' : 'direct',
          relatedId: applicationId || null,
        }),
      });

      const data = await res.json();
      if (data.success && data.message) {
        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId);
        }
        setMessages((prev) => [...prev, data.message]);
      }
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setSending(false);
    }
  };

  const QUICK_SUGGESTIONS = [
    `Hi ${recipient.name.split(' ')[0]}, are you available for a phone interview this week?`,
    `Thank you for applying for the ${recipient.position || 'position'}! We would love to talk to you.`,
    `Could you please share your updated resume or work availability?`,
  ];

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.55)',
        backdropFilter: 'blur(6px)',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          height: '620px',
          maxHeight: '90vh',
          backgroundColor: '#FFFFFF',
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0,0,0,0.05)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'modalSlideUp 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            backgroundColor: '#0E3B2E',
            color: '#FFFFFF',
            padding: '1.15rem 1.35rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                backgroundColor: '#16845D',
                color: '#FFFFFF',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                border: '2px solid rgba(255,255,255,0.2)',
                flexShrink: 0,
              }}
            >
              {recipient.avatarUrl ? (
                <img
                  src={recipient.avatarUrl}
                  alt={recipient.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                recipient.name?.charAt(0).toUpperCase() || 'C'
              )}
            </div>
            <div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', lineHeight: '1.2' }}>
                {recipient.name}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#A7F3D0', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>{recipient.position || 'Applicant'}</span>
                <span>•</span>
                <span style={{ color: '#6EE7B7', fontWeight: 600 }}>Direct Message</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link
              href={`/employer/dashboard?tab=messages&userId=${recipient.id}${applicationId ? `&appId=${applicationId}` : ''}`}
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255,255,255,0.12)',
                color: '#FFFFFF',
                padding: '0.4rem 0.75rem',
                borderRadius: '10px',
                fontSize: '0.775rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
              title="Open full inbox layout"
            >
              <ExternalLink size={13} /> Full Inbox
            </Link>

            <button
              onClick={onClose}
              style={{
                backgroundColor: 'rgba(255,255,255,0.15)',
                border: 'none',
                color: '#FFFFFF',
                width: 32,
                height: 32,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Message Area */}
        <div
          ref={scrollRef}
          style={{
            flex: 1,
            padding: '1.25rem',
            overflowY: 'auto',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          {loading ? (
            <div style={{ margin: 'auto', textAlign: 'center', color: '#64748B', fontSize: '0.9rem' }}>
              Loading conversation...
            </div>
          ) : messages.length === 0 ? (
            <div style={{ margin: 'auto', textAlign: 'center', maxWidth: '340px', padding: '1rem' }}>
              <div
                style={{
                  width: 54,
                  height: 54,
                  borderRadius: '50%',
                  backgroundColor: '#F0FDF4',
                  color: '#16845D',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 0.85rem auto',
                }}
              >
                <MessageSquare size={26} />
              </div>
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1.05rem', marginBottom: '0.35rem' }}>
                Start a conversation with {recipient.name}
              </div>
              <div style={{ fontSize: '0.825rem', color: '#64748B', lineHeight: '1.5' }}>
                Send a quick message regarding availability, interview scheduling, or application questions.
              </div>
            </div>
          ) : (
            messages.map((msg: any) => {
              const isMine = msg.senderId !== recipient.id;
              return (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: isMine ? 'flex-end' : 'flex-start',
                  }}
                >
                  <div
                    style={{
                      maxWidth: '82%',
                      padding: '0.75rem 1rem',
                      borderRadius: isMine ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                      backgroundColor: isMine ? '#0E3B2E' : '#FFFFFF',
                      color: isMine ? '#FFFFFF' : '#0F172A',
                      border: isMine ? 'none' : '1px solid #E2E8F0',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
                      fontSize: '0.9rem',
                      lineHeight: '1.5',
                      whiteSpace: 'pre-wrap',
                      wordBreak: 'break-word',
                    }}
                  >
                    {msg.text}
                  </div>
                  <div
                    style={{
                      fontSize: '0.7rem',
                      color: '#94A3B8',
                      marginTop: '0.25rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      padding: '0 0.35rem',
                    }}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMine && <CheckCheck size={12} color="#16845D" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Quick Suggestion Chips */}
        {messages.length === 0 && (
          <div
            style={{
              padding: '0.65rem 1rem',
              backgroundColor: '#FFFFFF',
              borderTop: '1px solid #F1F5F9',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <Sparkles size={12} color="#16845D" /> Quick Templates:
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.2rem' }}>
              {QUICK_SUGGESTIONS.map((text, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(undefined, text)}
                  style={{
                    backgroundColor: '#F0FDF4',
                    color: '#0E3B2E',
                    border: '1px solid #A7F3D0',
                    borderRadius: '16px',
                    padding: '0.35rem 0.75rem',
                    fontSize: '0.775rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Footer */}
        <form
          onSubmit={(e) => handleSend(e)}
          style={{
            padding: '0.85rem 1.15rem',
            backgroundColor: '#FFFFFF',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Write a message to ${recipient.name}...`}
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              borderRadius: '14px',
              border: '1.5px solid #CBD5E1',
              fontSize: '0.9rem',
              outline: 'none',
              backgroundColor: '#F8FAFC',
            }}
          />
          <button
            type="submit"
            disabled={!inputText.trim() || sending}
            style={{
              backgroundColor: inputText.trim() && !sending ? '#0E3B2E' : '#E2E8F0',
              color: inputText.trim() && !sending ? '#FFFFFF' : '#94A3B8',
              border: 'none',
              borderRadius: '14px',
              padding: '0.75rem 1.15rem',
              fontWeight: 700,
              fontSize: '0.875rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              cursor: inputText.trim() && !sending ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
            }}
          >
            <span>Send</span>
            <Send size={15} />
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}
