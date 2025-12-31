'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import { CSSProperties } from 'react';
import 'leaflet/dist/leaflet.css';

export default function CarteLeafletPage() {
  const mapStyle: CSSProperties = { height: '600px', width: '100%' };
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Carte Leaflet minimal safe Vercel</h1>
      <MapContainer center={defaultPosition} zoom={5} style={mapStyle}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      </MapContainer>
    </div>
  );
}
