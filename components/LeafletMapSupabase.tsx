'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression, Icon } from 'leaflet';
import { createClient } from '@supabase/supabase-js';

// Import dynamique pour éviter les erreurs SSR
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
);
const Tooltip = dynamic(
  () => import('react-leaflet').then((mod) => mod.Tooltip),
  { ssr: false }
);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Lieu {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

export default function LeafletMapSupabase() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);

  const defaultCenter: LatLngExpression = [48.8566, 2.3522];
  const defaultZoom = 5;

  // Icon perso pour la localisation utilisateur
  const userIcon = new Icon({
    iconUrl: '/user-location.png', // mettre un petit png ou svg
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  useEffect(() => {
    // Récupérer les lieux depuis Supabase
    const fetchLieux = async () => {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) console.error('Erreur Supabase:', error.message);
      else setLieux(data as Lieu[]);
    };
    fetchLieux();

    // Localisation utilisateur
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserPosition([pos.coords.latitude, pos.coords.longitude]),
        (err) => console.warn('Erreur géoloc:', err.message)
      );
    }
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Carte des lieux de mémoire</h1>

      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          style={{ width: '100%', height: '100%' }}
          zoom={defaultZoom as any}
          center={defaultCenter as any} // ⚡ cast pour TypeScript
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Markers lieux */}
          {lieux.map((lieu) => (
            <Marker
              key={lieu.id}
              position={[lieu.latitude, lieu.longitude]}
            >
              <Popup>
                <strong>{lieu.title}</strong>
                <br />
                {lieu.description ?? 'Pas de description'}
              </Popup>
              <Tooltip>{lieu.title}</Tooltip>
            </Marker>
          ))}

          {/* Marker position utilisateur */}
          {userPosition && (
            <Marker position={userPosition} icon={userIcon}>
              <Popup>Vous êtes ici</Popup>
              <Tooltip>Votre position</Tooltip>
            </Marker>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
