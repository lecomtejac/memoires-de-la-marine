'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function CarteLeafletPage() {
  // Position initiale (Paris)
  const defaultPosition: [number, number] = [48.8566, 2.3522];

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Carte Leaflet minimal</h1>

      <MapContainer
        style={{ height: '600px', width: '100%' }}
        center={defaultPosition}
        zoom={5}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
