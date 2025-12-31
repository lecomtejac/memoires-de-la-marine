'use client';

import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Petit composant pour centrer la carte
function SetViewOnLoad({ coords }: { coords: [number, number] }) {
  const map = useMap();
  map.setView(coords, 5);
  return null;
}

export default function CarteLeafletPage() {
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Carte Leaflet minimal</h1>

      <MapContainer style={{ height: '600px', width: '100%' }}>
        <SetViewOnLoad coords={defaultPosition} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
}
