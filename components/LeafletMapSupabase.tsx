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

// 🔹 Icône utilisateur
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
  photos?: { url: string }[];
};

// 🔹 Ajuste automatiquement la carte aux lieux
function FitBounds({ lieux }: { lieux: Lieu[] }) {
  const map = useMap();
  useEffect(() => {
    if (!lieux.length) return;
    const bounds = L.latLngBounds(
      lieux.map((l) => [l.latitude!, l.longitude!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [lieux, map]);
  return null;
}

// 🔹 Bouton géolocalisation
function LocateUserControl({ onLocate }: { onLocate: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const control = L.control({ position: 'topleft' });
    control.onAdd = () => {
      const button = L.DomUtil.create('button');
      button.innerHTML = '📍 Ma position';
      button.style.cssText =
        'background:#fff; padding:6px 10px; border-radius:6px; border:1px solid #ccc; cursor:pointer; font-weight:bold;';
      L.DomEvent.disableClickPropagation(button);
      button.onclick = () => {
        if (!navigator.geolocation) return alert('Géolocalisation non supportée.');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            onLocate(pos.coords.latitude, pos.coords.longitude);
            map.setView([pos.coords.latitude, pos.coords.longitude], 14);
          },
          () => alert('Impossible de récupérer votre position.')
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
  const [types, setTypes] = useState<{ id: number; label: string }[]>([]);
  const [selectedType, setSelectedType] = useState<number | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  // 🔹 Lieux Supabase
  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select('id,title,description,latitude,longitude,status,type_id,photos(url)');
      if (error) console.error(error);
      else setLieux(data as Lieu[]);
      setLoading(false);
    }
    fetchLieux();
  }, []);

  // 🔹 Types Supabase
  useEffect(() => {
    async function fetchTypes() {
      const { data, error } = await supabase.from('location_types').select('id,label');
      if (error) console.error(error);
      else setTypes(data ?? []);
    }
    fetchTypes();
  }, []);

  const lieuxFiltres = lieux.filter(
    (l) => selectedType === 'all' || l.type_id === selectedType
  );

  return (
    <div style={{ width: '100%' }}>
      {/* 🔹 Zone filtres */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
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

      {/* 🔹 Zone carte */}
      <div style={{ position: 'relative', height: '500px' }}>
        <MapContainer center={[48.8566, 2.3522]} zoom={5} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocateUserControl onLocate={(lat, lng) => setUserPosition([lat, lng])} />

          {lieuxFiltres.map((l) => (
            <Marker key={l.id} position={[l.latitude!, l.longitude!]}>
              <Tooltip>{l.title}</Tooltip>
              <Popup>
                <div>
                  <strong>{l.title}</strong>
                  {l.description && <p>{l.description}</p>}
                  {l.photos?.[0]?.url && (
                    <img src={l.photos[0].url} alt={l.title} style={{ width: '100%' }} />
                  )}
                  <div
                    style={{
                      marginTop: '6px',
                      padding: '2px 6px',
                      background: l.status === 'approved' ? '#2e7d32' : '#c62828',
                      color: 'white',
                      borderRadius: '6px',
                      display: 'inline-block',
                      fontSize: '12px',
                    }}
                  >
                    {l.status === 'approved' ? '✔ Lieu vérifié' : '⏳ Lieu non vérifié'}
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {userPosition && <Marker position={userPosition} icon={userIcon}><Popup>Vous êtes ici</Popup></Marker>}

          <FitBounds lieux={lieuxFiltres} />
        </MapContainer>

        {/* 🔹 Overlay */}
        {loading && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255,255,255,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              zIndex: 1000,
            }}
          >
            Chargement des lieux…
          </div>
        )}
        {!loading && lieuxFiltres.length === 0 && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255,255,255,0.8)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: 'bold',
              zIndex: 1000,
            }}
          >
            Aucun lieu trouvé.
          </div>
        )}
      </div>
    </div>
  );
}
