'use client';

import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

type Lieu = {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
};

// 🔹 Composant pour ajuster automatiquement la carte
function FitBounds({ lieux, userPosition }: { lieux: Lieu[]; userPosition: [number, number] | null }) {
  const map = useMap();

  useEffect(() => {
    const positions = lieux.map((l) => [l.latitude, l.longitude] as [number, number]);
    if (userPosition) positions.push(userPosition);
    if (positions.length === 0) return;

    const bounds = L.latLngBounds(positions);
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [lieux, userPosition, map]);

  return null;
}

export default function LeafletMapSupabase() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  const mapStyle = { height: '500px', width: '100%' };

  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select('id, title, description, latitude, longitude');

      if (error) console.error('Erreur Supabase Leaflet:', error.message);
      else setLieux(data as Lieu[]);

      setLoading(false);
    }

    fetchLieux();

    // 🔹 Récupérer la position utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserPosition([pos.coords.latitude, pos.coords.longitude]);
        },
        (err) => console.warn('Erreur géoloc:', err.message)
      );
    }
  }, []);

  return (
    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
      {/* 🔹 Carte */}
      <MapContainer {...({ style: mapStyle, zoom: 5, center: [48.8566, 2.3522] } as any)}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {lieux.map((lieu) => (
          <Marker key={lieu.id} position={[lieu.latitude, lieu.longitude]}>
            <Popup>
              <strong>{lieu.title}</strong>
              <br />
              {lieu.description ?? ''}
            </Popup>
          </Marker>
        ))}

        {userPosition && (
          <Marker position={userPosition} icon={new L.Icon.Default()}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}

        <FitBounds lieux={lieux} userPosition={userPosition} />
      </MapContainer>

      {/* 🔹 Overlay “Chargement…” */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
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
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
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
