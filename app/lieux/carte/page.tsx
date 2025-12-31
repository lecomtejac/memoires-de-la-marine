'use client';

import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

// On importe MapContainer et TileLayer uniquement côté client pour éviter l'erreur "window is not defined"
const MapContainer = dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false });

export default function CartePage() {
  const franceCenter: [number, number] = [46.603354, 1.888334]; // centre France

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Carte des lieux de mémoire</h1>

      <div style={{ height: '80vh', width: '100%' }}>
        <MapContainer center={franceCenter} zoom={6} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        </MapContainer>
      </div>
    </div>
  );
}
