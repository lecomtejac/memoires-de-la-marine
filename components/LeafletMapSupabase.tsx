'use client';

import { MapContainer, TileLayer, Marker } from 'react-leaflet';
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
        .select('id, title, latitude, longitude');

      if (error) console.error('Erreur Supabase Leaflet:', error);
      else setLieux(data as Lieu[]);
    }

    fetchLieux();
  }, []);

  // 🔹 Pour tester avec 4 markers fixes si Supabase ne renvoie pas encore de données
  const testMarkers: Lieu[] = [
    { id: '1', title: 'Lieu 1', latitude: 48.8566, longitude: 2.3522 }, // Paris
    { id: '2', title: 'Lieu 2', latitude: 45.7640, longitude: 4.8357 }, // Lyon
    { id: '3', title: 'Lieu 3', latitude: 43.2965, longitude: 5.3698 }, // Marseille
    { id: '4', title: 'Lieu 4', latitude: 50.6292, longitude: 3.0573 }, // Lille
  ];

  const markersToShow = lieux.length > 0 ? lieux : testMarkers;

  return (
    <MapContainer style={mapStyle} center={defaultPosition} zoom={5}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {markersToShow.map((lieu) => (
        <Marker
          key={lieu.id}
          position={[lieu.latitude, lieu.longitude]}
        />
      ))}
    </MapContainer>
  );
}
