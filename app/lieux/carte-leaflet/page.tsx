// app/lieux/carte-leaflet/page.tsx
'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { CSSProperties } from 'react';

// Import dynamique de MapContainer/TileLayer pour éviter l'erreur window côté serveur
const MapContainer = dynamic(
  () =>
    import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () =>
    import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);

export default function CarteLeafletPage() {
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris
  const mapStyle: CSSProperties = { height: '600px', width: '100%' };

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Carte Leaflet safe Vercel</h1>
      <MapContainer center={defaultPosition} zoom={5} style={mapStyle}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      </MapContainer>
    </div>
  );
}
