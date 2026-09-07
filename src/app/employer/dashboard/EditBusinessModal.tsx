'use client';

import React, { useState } from 'react';
import { X, Building2, Save, MapPin, Phone, Mail, Globe, Tag, Image, Sparkles } from 'lucide-react';

interface EditBusinessModalProps {
  business: any;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedBusiness: any) => void;
}

const CATEGORY_OPTIONS = [
  'Bakery & Food',
  'Restaurant & Cafe',
  'Retail & Shopping',
  'Print & Graphics',
  'Construction & Trades',
  'Healthcare & Wellness',
  'Professional Services',
  'Technology & Software',
  'Automotive Services',
  'Education & Childcare',
];

const PRESET_LOGOS = [
  '/images/empanada_bakery.png',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556740758-90de374c12ad?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&auto=format&fit=crop&q=80',
];

export default function EditBusinessModal({
  business,
  isOpen,
  onClose,
  onUpdate,
}: EditBusinessModalProps) {
  const [name, setName] = useState(business?.name || '');
  const [category, setCategory] = useState(business?.category || 'Bakery & Food');
  const [description, setDescription] = useState(business?.description || '');
  const [phone, setPhone] = useState(business?.phone || '');
  const [email, setEmail] = useState(business?.email || '');
  const [website, setWebsite] = useState(business?.website || '');
  const [logoUrl, setLogoUrl] = useState(business?.logoUrl || '/images/empanada_bakery.png');
  const [addressLine, setAddressLine] = useState(business?.location?.addressLine || '440 Water St');
  const [neighborhood, setNeighborhood] = useState(business?.location?.neighborhood || 'Downtown Norwalk');

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          category,
          description,
          phone,
          email,
          website,
          logoUrl,
          addressLine,
          neighborhood,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update business profile');
      }

      onUpdate(data.business);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
      <div
        className="modal-card"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '640px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="modal-header" style={{ borderBottom: '1px solid #F1F5F9', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '10px',
                backgroundColor: '#FFF4F1',
                color: '#E05638',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Building2 size={22} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Editar Perfil de Negocio
              </h3>
              <span style={{ fontSize: '0.85rem', color: '#64748B' }}>
                Actualiza los datos públicos de tu empresa en Fairfield County
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#64748B',
              padding: '4px',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {errorMsg && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              marginTop: '1rem',
              fontSize: '0.875rem',
            }}
          >
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1.25rem' }}>
          {/* Logo & Storefront photo picker */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.5rem' }}>
              <Image size={15} style={{ display: 'inline', marginRight: '0.3rem' }} /> Logo / Foto de Negocio
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <img
                src={logoUrl || '/images/empanada_bakery.png'}
                alt="Business Preview"
                style={{
                  width: 65,
                  height: 65,
                  borderRadius: '14px',
                  objectFit: 'cover',
                  border: '2px solid #E2E8F0',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              />
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  className="form-input"
                  placeholder="URL de la imagen del logo..."
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                />
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.75rem', color: '#64748B', alignSelf: 'center' }}>Demostración:</span>
                  {PRESET_LOGOS.map((url, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setLogoUrl(url)}
                      style={{
                        padding: '2px 8px',
                        fontSize: '0.725rem',
                        borderRadius: '6px',
                        border: logoUrl === url ? '1.5px solid #E05638' : '1px solid #CBD5E1',
                        backgroundColor: logoUrl === url ? '#FFF4F1' : '#F8FAFC',
                        color: logoUrl === url ? '#E05638' : '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      Opción {i + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Business Name & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                Nombre del Negocio *
              </label>
              <input
                type="text"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Nombre comercial de la empresa"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                Categoría Principal *
              </label>
              <select
                className="form-input"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
              Descripción Breve
            </label>
            <textarea
              className="form-input"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe lo que ofrece tu negocio, especialidad, horario y valor..."
              style={{ resize: 'vertical' }}
            />
          </div>

          {/* Address & Neighborhood */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                <MapPin size={14} style={{ display: 'inline', marginRight: '0.2rem' }} /> Dirección Física
              </label>
              <input
                type="text"
                className="form-input"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                placeholder="Ej. 440 Water St"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                Barrio / Zona
              </label>
              <input
                type="text"
                className="form-input"
                value={neighborhood}
                onChange={(e) => setNeighborhood(e.target.value)}
                placeholder="Ej. Downtown Norwalk / SoNo"
              />
            </div>
          </div>

          {/* Phone, Email, Website */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                <Phone size={14} style={{ display: 'inline', marginRight: '0.2rem' }} /> Teléfono de Contacto
              </label>
              <input
                type="text"
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(203) 555-0199"
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
                <Mail size={14} style={{ display: 'inline', marginRight: '0.2rem' }} /> Correo Electrónico
              </label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contacto@establisment.com"
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', marginBottom: '0.35rem' }}>
              <Globe size={14} style={{ display: 'inline', marginRight: '0.2rem' }} /> Sitio Web (Opcional)
            </label>
            <input
              type="text"
              className="form-input"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://www.elpanaderoconelpan.com"
            />
          </div>

          {/* Modal Footer Actions */}
          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline btn-lg"
              style={{ flex: 1, borderRadius: '12px' }}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ flex: 2, borderRadius: '12px', gap: '0.5rem' }}
              disabled={loading}
            >
              <Save size={18} />
              <span>{loading ? 'Guardando...' : 'Guardar Cambios de Negocio'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
