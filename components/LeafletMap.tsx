'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';

interface LeafletMapProps {
  position: LatLngExpression;
  zoom?: number;
}

export default function LeafletMap({ position, zoom = 5 }: LeafletMapProps) {
  const mapStyle = { height: '500px', width: '100%' };

  // Correct marker icon (sinon il n'apparaît pas)
  const defaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });
  L.Marker.prototype.options.icon = defaultIcon;

  return (
    <MapContainer center={position} zoom={zoom} style={mapStyle} key={position.toString()}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <Marker position={position}>
        <Popup>Marker test</Popup>
      </Marker>
    </MapContainer>
  );
}
