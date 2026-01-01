'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // chemin RELATIF (Vercel OK)

// 🔧 Fix icônes Leaflet (Next.js / Vercel)
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
  name: string | null;
  latitude: number | null;
  longitude: number | null;
};

export default function LeafletMapSupabase() {
  const [lieux, setLieux] = useState<Lieu[]>([]);

  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris
  const mapStyle = { height: '500px', width: '100%' };

  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select('id, name, latitude, longitude');

      if (error) {
        console.error('Erreur Supabase Leaflet:', error);
      } else {
        setLieux(data as Lieu[]);
      }
    }

    fetchLieux();
  }, []);

  const premierLieuValide = lieux.find(
    (l) => typeof l.latitude === 'number' && typeof l.longitude === 'number'
  );

  return (
    <>
      <MapContainer center={defaultPosition} zoom={5} style={mapStyle}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔹 UN SEUL marker pour test Supabase */}
        {premierLieuValide && (
          <Marker
            position={[
              premierLieuValide.latitude as number,
              premierLieuValide.longitude as number,
            ]}
          >
            <Popup>
              {premierLieuValide.name ?? 'Lieu sans nom'}
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* 🧪 DEBUG : données Supabase affichées */}
      <pre style={{ fontSize: 12, marginTop: 12 }}>
        {JSON.stringify(lieux, null, 2)}
      </pre>
    </>
  );
}
