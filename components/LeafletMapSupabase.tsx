'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { LatLngExpression } from 'leaflet';
import { createClient } from '@supabase/supabase-js';

// Import dynamique de React-Leaflet pour éviter SSR
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

// Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Typage du lieu de mémoire
interface Lieu {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
}

export default function LeafletMapSupabase() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [selectedLieu, setSelectedLieu] = useState<Lieu | null>(null);

  // Coordonnées par défaut pour centrer la carte
  const defaultCenter: LatLngExpression = [48.8566, 2.3522];
  const defaultZoom = 5;

  // Charger les lieux depuis Supabase
  useEffect(() => {
    const fetchLieux = async () => {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) {
        console.error('Erreur Supabase:', error.message);
      } else {
        setLieux(data as Lieu[]);
      }
    };
    fetchLieux();
  }, []);

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center' }}>Carte des lieux de mémoire</h1>

      <div style={{ height: '500px', width: '100%' }}>
        <MapContainer
          style={{ width: '100%', height: '100%' }}
          center={defaultCenter}
          zoom={defaultZoom}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {lieux.map((lieu) => (
            <Marker
              key={lieu.id}
              position={[lieu.latitude, lieu.longitude] as LatLngExpression}
              eventHandlers={{
                click: () => {
                  console.log('Lieu sélectionné:', lieu.title);
                  setSelectedLieu(lieu);
                },
              }}
            >
              <Popup>
                <strong>{lieu.title}</strong>
                <br />
                {lieu.description ?? 'Pas de description'}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Zone de détail sous la carte */}
      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          minHeight: '100px',
        }}
      >
        {selectedLieu ? (
          <>
            <h2>{selectedLieu.title}</h2>
            <p>{selectedLieu.description ?? 'Pas de description.'}</p>
            <p>
              <strong>Latitude:</strong> {selectedLieu.latitude} |{' '}
              <strong>Longitude:</strong> {selectedLieu.longitude}
            </p>
          </>
        ) : (
          <p style={{ fontStyle: 'italic', color: '#555' }}>
            Détail du lieu de mémoire sélectionné
          </p>
        )}
      </div>
    </div>
  );
}
