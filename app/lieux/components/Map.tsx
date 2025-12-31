'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Types des marqueurs
export interface MarkerData {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
}

interface MapComponentProps {
  markers?: MarkerData[];
}

export default function MapComponent({ markers = [] }: MapComponentProps) {
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris

  return (
    <MapContainer
      style={{ height: '600px', width: '100%' }}
      {...{ center: defaultPosition, zoom: 5 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markers.map((m) => (
        <Marker key={m.id} position={[m.latitude, m.longitude] as L.LatLngExpression}>
          <Popup>{m.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
