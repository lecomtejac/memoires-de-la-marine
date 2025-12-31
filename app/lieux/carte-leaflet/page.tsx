// app/lieux/carte-leaflet/page.tsx
'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { CSSProperties } from 'react';

const LeafletMap = dynamic(
  async () => {
    const { MapContainer, TileLayer } = await import('react-leaflet');
    return function MapComponent() {
      const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris
      const mapStyle: CSSProperties = { height: '600px', width: '100%' };
      return (
        <MapContainer
          center={defaultPosition as any} // TypeScript safe cast
          zoom={5}
          style={mapStyle}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
        </MapContainer>
      );
    };
  },
  { ssr: false }
);

export default function Page() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Carte Leaflet safe Vercel</h1>
      <LeafletMap />
    </div>
  );
}
