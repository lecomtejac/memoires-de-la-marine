'use client';

import { MapContainer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function SetViewOnLoad({ coords }: { coords: [number, number] }) {
  const map = useMap();

  // On ajoute le fond de carte via Leaflet directement
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  map.setView(coords, 5);
  return null;
}

export default function CarteLeafletPage() {
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Carte Leaflet minimal fonctionnelle</h1>

      <MapContainer style={{ height: '600px', width: '100%' }}>
        <SetViewOnLoad coords={defaultPosition} />
      </MapContainer>
    </div>
  );
}
