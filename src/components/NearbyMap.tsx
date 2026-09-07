'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface NearbyMapProps {
  center: { lat: number; lng: number };
  results: any[];
  selectedItem: any | null;
  onSelectItem: (item: any) => void;
  onSearchThisArea?: (lat: number, lng: number) => void;
}

export default function NearbyMap({
  center,
  results,
  selectedItem,
  onSelectItem,
  onSearchThisArea,
}: NearbyMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const markersRef = useRef<{ [key: string]: L.Marker }>({});
  const [mapMoved, setMapMoved] = React.useState(false);
  const [currentCenter, setCurrentCenter] = React.useState(center);

  // Initialize Map with OpenStreetMap Standard Tiles (No Watermark)
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [center.lat, center.lng],
        zoom: 13,
        zoomControl: false,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      map.on('moveend', () => {
        const c = map.getCenter();
        setCurrentCenter({ lat: c.lat, lng: c.lng });
        setMapMoved(true);
      });

      mapRef.current = map;
    } else {
      mapRef.current.setView([center.lat, center.lng], 13);
    }
  }, [center.lat, center.lng]);

  // Update Markers & Popups
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers
    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    results.forEach((item) => {
      const isSelected = selectedItem?.id === item.id;

      let bgColor = '#0e3b2e'; // Job Deep Emerald
      let labelIcon = '💼';
      let tagText = 'Job';

      if (item.type === 'SERVICE') {
        bgColor = '#16845d'; // Service Vibrant Emerald
        labelIcon = '🔧';
        tagText = 'Pro';
      } else if (item.type === 'MARKETPLACE') {
        bgColor = '#765066'; // Buy & Sell Plum Wine
        labelIcon = '🏷️';
        tagText = item.price;
      } else if (item.type === 'JOB' && item.salary) {
        tagText = item.salary.split('/')[0];
      }

      const html = `
        <div class="custom-map-pin ${isSelected ? 'selected' : ''}" style="
          background-color: ${bgColor};
          color: #FFFFFF;
          padding: 6px 12px;
          border-radius: 20px;
          font-family: Inter, -apple-system, sans-serif;
          font-size: 11px;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          box-shadow: 0 6px 18px rgba(14, 59, 46, 0.28);
          border: 2px solid ${isSelected ? '#FFFFFF' : 'rgba(255,255,255,0.9)'};
          transform: scale(${isSelected ? '1.18' : '1'});
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
          white-space: nowrap;
          max-width: 220px;
          overflow: hidden;
        ">
          <span>${labelIcon}</span>
          <span style="overflow: hidden; text-overflow: ellipsis;">${item.title}</span>
          <span style="background: rgba(255,255,255,0.25); padding: 1px 6px; border-radius: 10px; font-size: 10px; flex-shrink: 0;">${tagText}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        html,
        className: 'custom-leaflet-pin-wrapper',
        iconSize: [160, 36],
        iconAnchor: [80, 18],
      });

      const marker = L.marker([item.lat, item.lng], { icon: customIcon }).addTo(map);

      // Popup Content for Marker Click
      const popupHtml = `
        <div style="font-family: Inter, sans-serif; padding: 6px; min-width: 200px;">
          <div style="font-size: 10px; font-weight: 800; color: ${bgColor}; text-transform: uppercase; margin-bottom: 2px;">
            ${item.type === 'JOB' ? '💼 JOB' : item.type === 'SERVICE' ? '🔧 SERVICE' : '🏷️ BUY & SELL'} · 📍 ${item.distance} miles away
          </div>
          <div style="font-weight: 800; font-size: 13px; color: #0e3b2e; margin-bottom: 3px; line-height: 1.3;">
            ${item.title}
          </div>
          <div style="font-size: 11px; color: #475569; font-weight: 600; margin-bottom: 8px;">
            ${item.subtitle}
          </div>
          <a href="${item.link}" style="
            display: block;
            background-color: #0e3b2e;
            color: #FFFFFF;
            text-align: center;
            padding: 6px 12px;
            border-radius: 8px;
            font-weight: 700;
            font-size: 11px;
            text-decoration: none;
            box-shadow: 0 2px 6px rgba(14, 59, 46, 0.2);
          ">
            View Full Info →
          </a>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        offset: [0, -12],
        closeButton: true,
      });

      marker.on('click', () => {
        onSelectItem(item);
        marker.openPopup();
        map.panTo([item.lat, item.lng], { animate: true });
      });

      if (isSelected) {
        marker.openPopup();
      }

      markersRef.current[item.id] = marker;
    });
  }, [results, selectedItem, onSelectItem]);

  // Pan to selected item
  useEffect(() => {
    if (selectedItem && mapRef.current) {
      mapRef.current.panTo([selectedItem.lat, selectedItem.lng], { animate: true });
      const m = markersRef.current[selectedItem.id];
      if (m) m.openPopup();
    }
  }, [selectedItem]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '480px' }}>
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', borderRadius: '16px', overflow: 'hidden' }} />

      {/* Search This Area Floating Button */}
      {mapMoved && (
        <button
          onClick={() => {
            setMapMoved(false);
            if (onSearchThisArea) {
              onSearchThisArea(currentCenter.lat, currentCenter.lng);
            }
          }}
          style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: '#0e3b2e',
            color: '#FFFFFF',
            fontWeight: 700,
            fontSize: '0.85rem',
            padding: '0.5rem 1.1rem',
            borderRadius: '9999px',
            border: 'none',
            boxShadow: '0 8px 20px rgba(14, 59, 46, 0.3)',
            cursor: 'pointer',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            transition: 'all 0.2s ease',
          }}
        >
          <span>🔍 Search this area</span>
        </button>
      )}
    </div>
  );
}
