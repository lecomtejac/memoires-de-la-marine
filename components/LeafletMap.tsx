'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function LeafletMap() {
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris
  const mapStyle = { height: '500px', width: '100%' };

  return (
    // On caste le MapContainer en any pour TypeScript
    <MapContainer
      // @ts-ignore
      center={defaultPosition}
      // @ts-ignore
      zoom={5}
      style={mapStyle}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // @ts-ignore
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
    </MapContainer>
  );
}
