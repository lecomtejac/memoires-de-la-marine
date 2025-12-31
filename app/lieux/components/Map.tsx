'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapComponent() {
  // Position initiale (Paris)
  const defaultPosition: [number, number] = [48.8566, 2.3522];

  return (
    <MapContainer
      style={{ height: '600px', width: '100%' }}
      // ⚡ On initialise la vue avec `center` via `MapContainer` constructor
      // en utilisant `center` et `zoom` comme options dans `MapContainer` (anciennement props)
      {...{ center: defaultPosition, zoom: 5 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  );
}
