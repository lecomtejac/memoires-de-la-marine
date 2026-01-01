'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

// 🔹 Fix icônes Leaflet pour Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// 🔹 Icône position utilisateur
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

// 🔹 Ajuste automatiquement la carte aux lieux
function FitBounds({ lieux }: { lieux: Lieu[] }) {
  const map = useMap();

  useEffect(() => {
    if (lieux.length === 0) return;

    const bounds = L.latLngBounds(
      lieux.map((l) => [l.latitude, l.longitude] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [lieux, map]);

  return null;
}

// 🔹 Bouton Leaflet : géolocalisation utilisateur
function LocateUserControl({
  onLocate,
}: {
  onLocate: (lat: number, lng: number) => void;
}) {
  const map = useMap();

  useEffect(() => {
    const control = L.control({ position: 'topleft' });

    control.onAdd = () => {
      const button = L.DomUtil.create('button');
      button.innerHTML = '📍 Ma position';

      button.style.background = '#fff';
      button.style.padding = '6px 10px';
      button.style.borderRadius = '6px';
      button.style.border = '1px solid #ccc';
      button.style.cursor = 'pointer';
      button.style.fontWeight = 'bold';

      L.DomEvent.disableClickPropagation(button);

      button.onclick = () => {
        if (!navigator.geolocation) {
          alert('La géolocalisation n’est pas supportée.');
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            onLocate(latitude, longitude);
            map.setView([latitude, longitude], 14);
          },
          () => {
            alert('Impossible de récupérer votre position.');
          }
        );
      };

      return button;
    };

    control.addTo(map);
    return () => control.remove();
  }, [map, onLocate]);

  return null;
}

export default function LeafletMapSupabase() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPosition, setUserPosition] =
    useState<[number, number] | null>(null);
  const [selectedLieu, setSelectedLieu] = useState<Lieu | null>(null);

  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select('id, title, description, latitude, longitude');

      if (error) {
        console.error('Erreur Supabase Leaflet:', error);
      } else {
        setLieux(data as Lieu[]);
      }
      setLoading(false);
    }

    fetchLieux();
  }, []);

  return (
    <div style={{ width: '100%' }}>
      <div style={{ height: '500px', width: '100%' }}>
        {/* 🔹 Passer center et zoom via props typées correctement */}
        <MapContainer
          center={[48.8566, 2.3522]}
          zoom={5}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <LocateUserControl
            onLocate={(lat, lng) => setUserPosition([lat, lng])}
          />

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

      {/* 🔹 Détails du lieu sélectionné */}
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
