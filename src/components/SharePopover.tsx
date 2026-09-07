'use client';

import React, { useState } from 'react';
import { Share2, Link as LinkIcon, Mail, MessageSquare, Check } from 'lucide-react';

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" />
    <path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" />
  </svg>
);

interface SharePopoverProps {
  title: string;
  url?: string;
  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;
}

export default function SharePopover({ title, url: customUrl, buttonStyle, buttonClassName }: SharePopoverProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const getShareUrl = () => {
    if (customUrl) {
      if (customUrl.startsWith('http://') || customUrl.startsWith('https://')) {
        return customUrl;
      }
      if (typeof window !== 'undefined') {
        return `${window.location.origin}${customUrl.startsWith('/') ? '' : '/'}${customUrl}`;
      }
      return customUrl;
    }
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  const toggleShareMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = getShareUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
    }
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      setShowShareMenu(false);
    }, 1500);
  };

  const handleEmailShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = getShareUrl();
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`Check this out on PostPlace:\n\n${title}\n${shareUrl}`);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
    setShowShareMenu(false);
  };

  const handleSmsShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = getShareUrl();
    const body = encodeURIComponent(`Check out: ${title} ${shareUrl}`);
    window.open(`sms:?&body=${body}`, '_blank');
    setShowShareMenu(false);
  };

  const handleWhatsAppShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const shareUrl = getShareUrl();
    const text = encodeURIComponent(`Check out: *${title}*\n${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
    setShowShareMenu(false);
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={toggleShareMenu}
        className={buttonClassName || 'share-btn-icon'}
        style={buttonStyle}
        title="Share"
      >
        <Share2 size={17} />
      </button>

      {showShareMenu && (
        <>
          <div
            className="popover-backdrop"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowShareMenu(false);
            }}
          />
          <div
            className="share-dropdown-menu"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <button type="button" className="share-menu-item" onClick={handleCopyLink}>
              {copied ? <Check size={16} color="#16845d" /> : <LinkIcon size={16} />}
              <span>{copied ? 'Copied link!' : 'Copy link'}</span>
            </button>
            <button type="button" className="share-menu-item" onClick={handleEmailShare}>
              <Mail size={16} />
              <span>Email</span>
            </button>
            <button type="button" className="share-menu-item" onClick={handleSmsShare}>
              <MessageSquare size={16} />
              <span>Text message</span>
            </button>
            <button type="button" className="share-menu-item" onClick={handleWhatsAppShare}>
              <WhatsAppIcon size={16} />
              <span>WhatsApp</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
