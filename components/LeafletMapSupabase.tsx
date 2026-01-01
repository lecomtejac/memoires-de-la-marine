'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
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

const userIcon = new L.Icon({
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

type Lieu = {
  id: string;
  title: string;
  description: string | null;
  latitude: number;
  longitude: number;
};

function FitBounds({ lieux }: { lieux: Lieu[] }) {
  const map = useMap();

  useEffect(() => {
    if (!lieux.length) return;
    const bounds = L.latLngBounds(lieux.map((l) => [l.latitude, l.longitude] as [number, number]));
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [lieux, map]);

  return null;
}

export default function LeafletMapSupabase() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [selectedLieu, setSelectedLieu] = useState<Lieu | null>(null);

  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select('id, title, description, latitude, longitude');

      if (error) console.error(error);
      else setLieux(data as Lieu[]);

      setLoading(false);
    }
    fetchLieux();
  }, []);

  // 🔹 Valeur par défaut du centre
  const defaultCenter: [number, number] = [48.8566, 2.3522];
  const defaultZoom = 5;

  return (
    <div style={{ width: '100%' }}>
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
              position={[lieu.latitude, lieu.longitude]}
              eventHandlers={{
                click: () => setSelectedLieu(lieu),
              }}
            >
              <Tooltip>{lieu.title}</Tooltip>
              <Popup>
                <strong>{lieu.title}</strong>
                <br />
                {lieu.description ?? ''}
              </Popup>
            </Marker>
          ))}

          {userPosition && (
            <Marker position={userPosition} icon={userIcon}>
              <Popup>Vous êtes ici</Popup>
            </Marker>
          )}

          <FitBounds lieux={lieux} />
        </MapContainer>
      </div>

      {loading && <p>Chargement des lieux…</p>}
      {!loading && lieux.length === 0 && <p>Aucun lieu trouvé.</p>}

      {selectedLieu && (
        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            border: '1px solid #ccc',
            borderRadius: '8px',
            backgroundColor: '#f9f9f9',
          }}
        >
          <h2>{selectedLieu.title}</h2>
          <p>{selectedLieu.description ?? 'Pas de description.'}</p>
          <p>
            <strong>Latitude:</strong> {selectedLieu.latitude} |{' '}
            <strong>Longitude:</strong> {selectedLieu.longitude}
          </p>
        </div>
      )}
    </div>
  );
}
