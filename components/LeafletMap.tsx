'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// On définit un type pour les props
interface LeafletMapProps {
  position: [number, number]; // latitude et longitude
  zoom?: number;
}

export default function LeafletMap({ position, zoom = 5 }: LeafletMapProps) {
  const mapStyle = { height: '500px', width: '100%' };

  return (
    // @ts-ignore pour contourner les erreurs TypeScript
    <MapContainer center={position} zoom={zoom} style={mapStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        // @ts-ignore
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={position}>
        <Popup>Marker Test</Popup>
      </Marker>
    </MapContainer>
  );
}
