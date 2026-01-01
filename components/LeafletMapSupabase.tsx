'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

type Lieu = {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
};

export default function LeafletMapSupabase() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris
  const mapStyle = { height: '500px', width: '100%' };

  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select('id, title, description, latitude, longitude');

      if (error) console.error('Erreur Supabase Leaflet:', error);
      else setLieux(data as Lieu[]);
    }
    fetchLieux();
  }, []);

  return (
    <MapContainer
      center={defaultPosition}
      zoom={5}
      style={mapStyle}
      // scrollWheelZoom doit être passé comme boolean dans les props correctes
      // Ici on cast en MapContainerProps pour que TS ne râle pas
      {...({ scrollWheelZoom: true } as any)}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {lieux.map((lieu) => (
        <Marker key={lieu.id} position={[lieu.latitude, lieu.longitude]}>
          <Popup>
            <strong>{lieu.title}</strong>
            <br />
            {lieu.description ?? ''}
          </Popup>
          <Tooltip direction="top" offset={[0, -10]} opacity={0.9} sticky>
            {lieu.title}
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}
