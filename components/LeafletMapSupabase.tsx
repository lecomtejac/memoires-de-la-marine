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
  photos?: { url: string }[];
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

  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase
        .from('locations')
        .select(`
          id,
          title,
          description,
          latitude,
          longitude,
          photos(url)
        `); // 🔹 on récupère les photos

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
    <div style={{ position: 'relative', height: '500px', width: '100%' }}>
      <MapContainer
        {...({
          style: { height: '500px', width: '100%' },
          zoom: 5,
          center: [48.8566, 2.3522],
        } as any)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* 🔹 Bouton géolocalisation */}
        <LocateUserControl
          onLocate={(lat, lng) => setUserPosition([lat, lng])}
        />

        {/* 🔹 Lieux Supabase avec tooltip et popup */}
        {lieux.map((lieu) => (
          <Marker key={lieu.id} position={[lieu.latitude, lieu.longitude]}>
            <Tooltip
              {...({
                direction: 'top',
                offset: [0, -10],
                opacity: 1,
                permanent: false,
              } as any)}
            >
              {lieu.title}
            </Tooltip>
           <Popup>
  <div
    style={{
      position: 'relative',
      width: '260px',
      padding: '12px',
      boxSizing: 'border-box',
      fontFamily: 'inherit',
    }}
  >
    {/* Badge statut */}
    <div
      style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        backgroundColor:
          lieu.status === 'approved' ? '#2e7d32' : '#c62828',
        color: '#fff',
        padding: '4px 10px',
        fontSize: '12px',
        fontWeight: 600,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        zIndex: 1,
      }}
    >
      {lieu.status === 'approved'
        ? '✔ Lieu vérifié'
        : '⏳ Lieu non vérifié'}
    </div>

    {/* Image */}
    {lieu.photos?.[0]?.url ? (
      <img
        src={lieu.photos[0].url}
        alt={lieu.title}
        style={{
          width: '100%',
          height: '140px',
          objectFit: 'cover',
          borderRadius: '8px',
          marginBottom: '8px',
        }}
      />
    ) : null}

    {/* Titre */}
    <strong
      style={{
        display: 'block',
        fontSize: '16px',
        marginBottom: '4px',
      }}
    >
      {lieu.title}
    </strong>

    {/* Description */}
    {lieu.description && (
      <p
        style={{
          fontSize: '13px',
          margin: 0,
          lineHeight: '1.4',
        }}
      >
        {lieu.description}
      </p>
    )}
  </div>
</Popup>


          </Marker>
        ))}

        {/* 🔹 Position utilisateur */}
        {userPosition && (
          <Marker
            {...({
              position: userPosition,
              icon: userIcon,
            } as any)}
          >
            <Popup>Vous êtes ici</Popup>
          </Marker>
        )}

        <FitBounds lieux={lieux} />
      </MapContainer>

      {/* 🔹 Overlay chargement */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            zIndex: 1000,
          }}
        >
          Chargement des lieux…
        </div>
      )}

      {/* 🔹 Aucun lieu */}
      {!loading && lieux.length === 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,255,255,0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            zIndex: 1000,
          }}
        >
          Aucun lieu trouvé.
        </div>
      )}
    </div>
  );
}
