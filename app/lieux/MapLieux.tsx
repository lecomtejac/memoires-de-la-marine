'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapLieux() {
  return (
    <MapContainer
      center={[46.603354, 1.888334]}
      zoom={6}
      scrollWheelZoom={true}
      style={{ height: '70vh', width: '100%' }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
