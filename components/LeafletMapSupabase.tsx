'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// 🔹 Fix icônes Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// 🔹 Icônes personnalisées
const userIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const pendingIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
const validatedIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-red.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Lieu = {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
  status: string;
};

// 🔹 Ajuste automatique des bounds
function FitBounds({ lieux }: { lieux: Lieu[] }) {
  const map = useMap();
  useEffect(() => {
    if (!lieux.length) return;
    const bounds = L.latLngBounds(lieux.map(l => [l.latitude, l.longitude] as [number, number]));
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
      button.style.background = '#fff';
      button.style.padding = '6px 10px';
      button.style.borderRadius = '6px';
      button.style.border = '1px solid #ccc';
      button.style.cursor = 'pointer';
      button.style.fontWeight = 'bold';
      L.DomEvent.disableClickPropagation(button);
      button.onclick = () => {
        if (!navigator.geolocation) return alert('La géolocalisation n’est pas supportée.');
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            onLocate(coords.latitude, coords.longitude);
            map.setView([coords.latitude, coords.longitude], 14);
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
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select('id, title, description, latitude, longitude, status');
      if (error) console.error('Erreur Supabase Leaflet:', error);
      else setLieux(data as Lieu[]);
      setLoading(false);
    }
    fetchLieux();
  }, []);

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
      <MapContainer
        {...({ style: { height: '500px', width: '100%' }, zoom: 5, center: [48.8566, 2.3522] } as any)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocateUserControl onLocate={(lat, lng) => setUserPosition([lat, lng])} />

        {/* 🔹 Markers */}
        {lieux.map((lieu) => {
          const icon = lieu.status === 'validated' ? validatedIcon : pendingIcon;
          return (
            <Marker
              key={lieu.id}
              {...({ position: [lieu.latitude, lieu.longitude], icon } as any)} // TS fix
            >
              {/* cast Tooltip en any pour TS */}
              <Tooltip {...({ direction: 'top', offset: [0, -10], opacity: 1, permanent: false } as any)}>
                {lieu.title}
              </Tooltip>
              <Popup>
                <strong>{lieu.title}</strong>
                <br />
                {lieu.description ?? ''}
              </Popup>
            </Marker>
          );
        })}

        {userPosition && (
          <Marker {...({ position: userPosition, icon: userIcon } as any)}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}

        <FitBounds lieux={lieux} />
      </MapContainer>

      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            zIndex: 1000,
          }}
        >
          Chargement des lieux…
        </div>
      )}

      {!loading && lieux.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            zIndex: 1000,
          }}
        >
          Aucun lieu trouvé.
        </div>
      )}
    </div>
  );
}
