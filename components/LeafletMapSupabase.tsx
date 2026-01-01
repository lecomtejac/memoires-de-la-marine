'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// Fix icônes Leaflet (Next.js)
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
  latitude: number;
  longitude: number;
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

  return (
    // @ts-ignore — React-Leaflet + Next.js (indispensable pour le build)
    <MapContainer center={defaultPosition} zoom={5} style={mapStyle}>
      {/* @ts-ignore — attribution mal typée côté react-leaflet */}
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap"
      />

      {/* 🔹 UN SEUL marker pour test Supabase */}
      {lieux[0] && (
        <Marker position={[lieux[0].latitude, lieux[0].longitude]}>
          <Popup>
            {lieux[0].name ?? 'Lieu sans nom'}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
