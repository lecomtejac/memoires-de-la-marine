'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // ton client existant

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
  name: string;
  latitude: number;
  longitude: number;
};

export default function LeafletMap() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris
  const mapStyle = { height: '500px', width: '100%' };

  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) console.error('Erreur Supabase:', error);
      else setLieux(data as Lieu[]);
    }
    fetchLieux();
  }, []);

  return (
    <MapContainer center={defaultPosition} zoom={5} style={mapStyle}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {/* On affiche pour l'instant juste le premier marker pour vérifier */}
      {lieux[0] && (
        <Marker position={[lieux[0].latitude, lieux[0].longitude]}>
          <Popup>{lieux[0].name}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
