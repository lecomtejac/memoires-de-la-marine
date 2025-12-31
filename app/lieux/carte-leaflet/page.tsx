'use client';

import { MapContainer as LeafletMapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function Page() {
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris
  const mapStyle = { height: '500px', width: '100%' };

  const MapContainer: any = LeafletMapContainer; // <-- CAST any pour TS

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test carte Leaflet</h1>
      <MapContainer center={defaultPosition} zoom={5} style={mapStyle}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      </MapContainer>
    </div>
  );
}
