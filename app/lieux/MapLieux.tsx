'use client'; // ✅ Important pour qu'il ne soit jamais rendu côté serveur

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapLieux() {
  return (
    <MapContainer
      {...{
        center: [46.603354, 1.888334],
        zoom: 6,
        scrollWheelZoom: true,
        style: { height: '70vh', width: '100%' },
      } as any}
    >
      <TileLayer
        {...{
          attribution: "&copy; OpenStreetMap contributors",
          url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        } as any}
      />
    </MapContainer>
  );
}
