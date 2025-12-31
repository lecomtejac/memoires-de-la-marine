'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Pour que le marker s'affiche correctement avec Leaflet v1+
// (sinon le marker ne s'affiche pas avec Webpack/Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function LeafletMap() {
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris
  const mapStyle = { height: '500px', width: '100%' };

  return (
    // @ts-ignore pour contourner les erreurs TypeScript
    <MapContainer center={defaultPosition} zoom={5} style={mapStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // @ts-ignore
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={defaultPosition}>
        <Popup>Test Marker</Popup>
      </Marker>
    </MapContainer>
  );
}
