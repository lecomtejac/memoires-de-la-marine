'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; // chemin RELATIF, sûr pour Vercel

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

// 🔹 TypeScript type pour un lieu
type Lieu = {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
};

export default function LeafletMapSupabase() {
  const [lieux, setLieux] = useState<Lieu[]>([]);

  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris
  const mapStyle = { height: '500px', width: '100%' };

  // 🔹 Fetch Supabase côté client
  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select('id, title, description, latitude, longitude');

      if (error) {
        console.error('Erreur Supabase Leaflet:', error);
      } else {
        setLieux(data as Lieu[]);
      }
    }

    fetchLieux();
  }, []);

  return (
    <MapContainer center={defaultPosition} zoom={5} style={mapStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {lieux.map((lieu) => (
        <Marker
          key={lieu.id}
          position={[lieu.latitude, lieu.longitude]}
        >
          <Popup>
            <strong>{lieu.title}</strong>
            <br />
            {lieu.description ?? ''}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
