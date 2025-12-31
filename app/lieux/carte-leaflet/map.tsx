'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';

// Correction icône Leaflet (obligatoire sur Next)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export default function Map() {
  return (
    <MapContainer
      center={[46.603354, 1.888334]} // France
      zoom={6}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='© OpenStreetMap contributors'
        url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      />

      {/* Marqueur de test */}
      <Marker position={[48.8566, 2.3522]}>
        <Popup>Paris – marqueur test</Popup>
      </Marker>
    </MapContainer>
  );
}
