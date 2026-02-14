'use client';

import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
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

// 🔹 Type des lieux
export type Lieu = {
  id: number;
  title: string;
  type_id: number | null;
  latitude: number | null;
  longitude: number | null;
  status: string | null;
  description: string | null;
  address_text: string | null;
  country: string | null;
  period_start: string | null;
  period_end: string | null;
  created_at: string | null;
  updated_at: string | null;
  created_by: string | null;
  photos?: { url: string }[];
};

// 🔹 Props composant
type LeafletMapSupabaseProps = {
  typeFilter: number | 'all';
};

// 🔹 Ajuste automatiquement la carte aux lieux
function FitBounds({ lieux }: { lieux: Lieu[] }) {
  const map = useMap();

  useEffect(() => {
    if (lieux.length === 0) {
      map.setView([46.6, 2.5], 6); // France par défaut
      return;
    }
    const bounds = L.latLngBounds(
      lieux
        .filter((l) => l.latitude && l.longitude)
        .map((l) => [l.latitude!, l.longitude!] as [number, number])
    );
    map.fitBounds(bounds, { padding: [50, 50] });
  }, [lieux, map]);

  return null;
}

// 🔹 Bouton Leaflet : géolocalisation utilisateur
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
          (pos) => {
            const { latitude, longitude } = pos.coords;
            onLocate(latitude, longitude);
            map.setView([latitude, longitude], 14);
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

// 🔹 Icônes par type de lieu
const typeIcons: Record<number, string> = {
  7: '🪦',   // Tombe
  8: '🏛️',  // Monument
  9: '📜',  // Plaque commémorative
  10: '🏛️', // Mémorial
  11: '⚔️', // Lieu de bataille
  12: '⛴️', // Lieu de débarquement
  13: '💥', // Naufrage
  14: '🛳️', // Épave
  15: '🏛️', // Musée
  16: '👣', // Trace de passage
  17: '🪖', // Base
  18: '⚓',  // Port
  19: '⭐',  // Autre lieu remarquable
};

function getTypeIcon(typeId: number | null) {
  if (!typeId) return '❓';
  return typeIcons[typeId] || '❓';
}

// 🔹 Composant principal
export default function LeafletMapSupabase({ typeFilter }: LeafletMapSupabaseProps) {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔹 Récupération des lieux
  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select(`id,title,description,latitude,longitude,status,type_id,photos(url)`);
      if (error) console.error('Erreur Supabase Leaflet:', error);
      else setLieux(data as Lieu[]);
      setLoading(false);
    }
    fetchLieux();
  }, []);

  // 🔹 Lieux filtrés par type
  const lieuxFiltres = lieux.filter(
    (l) => typeFilter === 'all' || l.type_id === typeFilter
  );

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      <MapContainer style={{ height: '100%', width: '100%' }} zoom={5} center={[48.8566, 2.3522]} scrollWheelZoom>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocateUserControl onLocate={(lat, lng) => setUserPosition([lat, lng])} />

        <MarkerClusterGroup
          showCoverageOnHover={false}
          spiderfyOnEveryZoom={false}
          chunkedLoading
          maxClusterRadius={70}
          iconCreateFunction={(cluster) => {
            const count = cluster.getChildCount();
            return L.divIcon({
              html: `<div class="cluster-blue">${count}</div>`,
              className: '',
              iconSize: L.point(44, 44, true),
            });
          }}
        >
          {lieuxFiltres.map(
            (lieu) =>
              lieu.latitude &&
              lieu.longitude && (
                <Marker key={lieu.id} position={[lieu.latitude, lieu.longitude]}>
                  <Tooltip>{lieu.title} {getTypeIcon(lieu.type_id)}</Tooltip>
                  <Popup>
                    <div style={{ width: '260px', padding: '16px', borderRadius: '12px', backgroundColor: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                      {lieu.status && (
                        <div style={{
                          backgroundColor: lieu.status === 'approved' ? '#2e7d32' : '#c62828',
                          color: '#fff',
                          padding: '2px 6px',
                          fontSize: '10px',
                          fontWeight: 600,
                          borderRadius: '12px',
                          marginBottom: '6px',
                          display: 'inline-block',
                        }}>
                          {lieu.status === 'approved' ? '✔ Vérifié' : '⏳ Non vérifié'}
                        </div>
                      )}
                      {lieu.photos?.[0]?.url && (
                        <img src={lieu.photos[0].url} alt={lieu.title} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '12px', marginBottom: '12px' }} />
                      )}
                      <strong>{lieu.title}</strong>
                      {lieu.description && <p style={{ fontSize: '13px', color: '#333' }}>{lieu.description}</p>}
                      <div style={{ textAlign: 'right', marginTop: '8px' }}>
                        <Link href={`/lieux/${lieu.id}`} style={{ fontSize: '13px', fontWeight: 600, color: '#1e88e5' }}>
                          Voir la fiche complète →
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )
          )}
        </MarkerClusterGroup>

        {userPosition && (
          <Marker position={userPosition} icon={userIcon}>
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}

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
