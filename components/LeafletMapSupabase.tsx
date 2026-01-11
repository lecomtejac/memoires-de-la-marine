'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// 🔹 Fix icônes Leaflet pour Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// 🔹 Icône position utilisateur
const userIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export type Lieu = {
  id: number;
  title: string;
  type_id: number | null;
  latitude: number | null;
  longitude: number | null;
  status: string | null;
  description: string | null;
  address_text: string | null;
  country: string | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  photos?: { url: string }[];
};

// 🔹 Ajuste automatiquement la carte aux lieux
function FitBounds({ lieux }: { lieux: Lieu[] }) {
  const map = useMap();
  useEffect(() => {
    if (lieux.length === 0) return;
    const bounds = L.latLngBounds(
      lieux.map((l) => [l.latitude, l.longitude] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [lieux, map]);
  return null;
}

// 🔹 Bouton Leaflet : géolocalisation utilisateur
function LocateUserControl({ onLocate }: { onLocate: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const control = L.control({ position: 'topleft' });
    control.onAdd = () => {
      const button = L.DomUtil.create('button');
      button.innerHTML = '📍 Ma position';
      button.style.background = '#fff';
      button.style.padding = '6px 10px';
      button.style.borderRadius = '6px';
      button.style.border = '1px solid #ccc';
      button.style.cursor = 'pointer';
      button.style.fontWeight = 'bold';
      L.DomEvent.disableClickPropagation(button);
      button.onclick = () => {
        if (!navigator.geolocation) {
          alert('La géolocalisation n’est pas supportée.');
          return;
        }
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            onLocate(latitude, longitude);
            map.setView([latitude, longitude], 14);
          },
          () => {
            alert('Impossible de récupérer votre position.');
          }
        );
      };
      return button;
    };
    control.addTo(map);
    return () => control.remove();
  }, [map, onLocate]);
  return null;
}

export default function LeafletMapSupabase() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [types, setTypes] = useState<{ id: number; label: string; slug: string }[]>([]);
  const [selectedType, setSelectedType] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  // 🔹 BRIDE LE Z-INDEX LEAFLET
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-pane,
      .leaflet-control,
      .leaflet-top,
      .leaflet-bottom {
        z-index: 1 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  // 🔹 Récupération des lieux
  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select(`
          id,
          title,
          description,
          latitude,
          longitude,
          status,
          type_id,
          photos(url)
        `);
      if (error) console.error('Erreur Supabase Leaflet:', error);
      else setLieux(data as Lieu[]);
      setLoading(false);
    }
    fetchLieux();
  }, []);

  // 🔹 Récupération des types
  useEffect(() => {
    async function fetchTypes() {
      const { data, error } = await supabase
        .from('location_types')
        .select('id,label,slug');
      if (error) console.error('Erreur types:', error);
      else setTypes(data ?? []);
    }
    fetchTypes();
  }, []);

  const lieuxFiltres = lieux.filter(
    (l) => selectedType === 'all' || l.type_id === selectedType
  );

  return (
    <div style={{ width: '100%' }}>
      {/* 🔹 Filtres */}
      <div
        style={{
          position: 'relative',
          zIndex: 1000,
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '12px',
          background: 'white',
          padding: '10px',
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
        }}
      >
        <button
          onClick={() => setSelectedType('all')}
          style={{
            padding: '6px 12px',
            borderRadius: '12px',
            border: selectedType === 'all' ? '2px solid #2e7d32' : '1px solid #ccc',
            backgroundColor: selectedType === 'all' ? '#e8f5e9' : '#fff',
            cursor: 'pointer',
          }}
        >
          Tous
        </button>
        {types.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelectedType(t.id)}
            style={{
              padding: '6px 12px',
              borderRadius: '12px',
              border: selectedType === t.id ? '2px solid #2e7d32' : '1px solid #ccc',
              backgroundColor: selectedType === t.id ? '#e8f5e9' : '#fff',
              cursor: 'pointer',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 🔹 Carte */}
      <div style={{ position: 'relative', height: '500px', zIndex: 1 }}>
        <MapContainer
          style={{ height: '100%', width: '100%' }}
          zoom={5}
          center={[48.8566, 2.3522]}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocateUserControl onLocate={(lat, lng) => setUserPosition([lat, lng])} />

          {lieuxFiltres.map((lieu) => (
            <Marker key={lieu.id} position={[lieu.latitude!, lieu.longitude!]}>
              <Tooltip>{lieu.title}</Tooltip>
              <Popup>
                <div style={{ width: '260px' }}>
                  <strong>{lieu.title}</strong>
                  {lieu.description && <p>{lieu.description}</p>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* 🔹 Position utilisateur */}
          {userPosition && (
            <Marker
              position={userPosition}
              icon={userIcon as L.Icon}
            >
              <Popup>Vous êtes ici</Popup>
            </Marker>
          )}

          <FitBounds lieux={lieuxFiltres} />
        </MapContainer>
      </div>
    </div>
  );
}
