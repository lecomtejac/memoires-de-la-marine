'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import Link from 'next/link';
import MarkerClusterGroup from 'react-leaflet-cluster';

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

export type Lieu = {
  id: number;
  title: string;
  type_id: number | null;
  latitude: number | null;
  longitude: number | null;
  status: string | null;
  description: string | null;
  photos?: { url: string }[];
};

// 🔹 Props : type sélectionné
type LeafletMapSupabaseProps = {
  selectedType: number | 'all';
};

function FitBounds({ lieux }: { lieux: Lieu[] }) {
  const map = useMap();
  useEffect(() => {
    if (lieux.length === 0) return map.setView([46.6, 2.5], 6);
    const bounds = L.latLngBounds(
      lieux
        .filter((l) => l.latitude && l.longitude)
        .map((l) => [l.latitude!, l.longitude!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [lieux, map]);
  return null;
}

function LocateUserControl({ onLocate }: { onLocate: (lat: number, lng: number) => void }) {
  const map = useMap();
  useEffect(() => {
    const control = L.control({ position: 'topleft' });
    control.onAdd = () => {
      const button = L.DomUtil.create('button');
      button.innerHTML = '📍 Ma position';
      Object.assign(button.style, {
        background: '#fff',
        padding: '6px 10px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        cursor: 'pointer',
        fontWeight: 'bold',
      });
      L.DomEvent.disableClickPropagation(button);
      button.onclick = () => {
        if (!navigator.geolocation) return alert('La géolocalisation n’est pas supportée.');
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            onLocate(coords.latitude, coords.longitude);
            map.setView([coords.latitude, coords.longitude], 14);
          },
          () => alert('Impossible de récupérer votre position.')
        );
      };
      return button;
    };
    control.addTo(map);
    return () => control.remove();
  }, [map, onLocate]);
  return null;
}

// 🔹 Icônes par type
const typeIcons: Record<number, string> = {
  7: '🪦',
  8: '🏛️',
  9: '📜',
  10: '🏛️',
  11: '⚔️',
  12: '⛴️',
  13: '💥',
  14: '🛳️',
  15: '🏛️',
  16: '👣',
  17: '🪖',
  18: '⚓',
  19: '⭐',
};
function getTypeIcon(typeId: number | null) {
  if (!typeId) return '❓';
  return typeIcons[typeId] || '❓';
}

export default function LeafletMapSupabase({ selectedType }: LeafletMapSupabaseProps) {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupérer tous les lieux
  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select('id,title,type_id,latitude,longitude,status,description,photos(url)');
      if (error) console.error(error);
      else setLieux(data as Lieu[]);
      setLoading(false);
    }
    fetchLieux();
  }, []);

  // 🔹 Filtrage
  const lieuxFiltres = lieux.filter(
    (l) => selectedType === 'all' || l.type_id === selectedType
  );

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <MapContainer
        style={{ height: '100%', width: '100%' }}
        center={[48.8566, 2.3522]}
        zoom={5}
        scrollWheelZoom={true}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocateUserControl onLocate={(lat, lng) => setUserPosition([lat, lng])} />

        <MarkerClusterGroup>
          {lieuxFiltres.map(
            (lieu) =>
              lieu.latitude &&
              lieu.longitude && (
                <Marker key={lieu.id} position={[lieu.latitude, lieu.longitude]}>
                  <Tooltip>{lieu.title} {getTypeIcon(lieu.type_id)}</Tooltip>
                  <Popup>
                    <div style={{ width: '260px' }}>
                      <strong>{lieu.title}</strong>
                      {lieu.description && <p>{lieu.description}</p>}
                      {lieu.photos?.[0]?.url && (
                        <img src={lieu.photos[0].url} alt={lieu.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                      )}
                      <div style={{ textAlign: 'right', marginTop: '8px' }}>
                        <Link href={`/lieux/${lieu.id}`}>Voir la fiche complète →</Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MarkerClusterGroup>

        {userPosition && <Marker position={userPosition} icon={userIcon}><Popup>Vous êtes ici</Popup></Marker>}

        <FitBounds lieux={lieuxFiltres} />
      </MapContainer>

      {loading && (
        <div style={{
          position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '1.2rem', fontWeight: 'bold', zIndex: 1000
        }}>
          Chargement des lieux…
        </div>
      )}

      {!loading && lieuxFiltres.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0, backgroundColor: 'rgba(255,255,255,0.8)',
          display: 'flex', justifyContent: 'center', alignItems: 'center',
          fontSize: '1.2rem', fontWeight: 'bold', zIndex: 1000
        }}>
          Aucun lieu trouvé.
        </div>
      )}
    </div>
  );
}
