import { supabase } from '../../../lib/supabaseClient';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Correction icône par défaut Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Next.js App Router : page dynamique côté serveur
interface LieuProps {
  params: { id: string };
}

function getTypeLabel(typeId: number) {
  const types: { [key: number]: string } = {
    7: 'Tombe',
    8: 'Monument',
    9: 'Plaque commémorative',
    10: 'Mémorial',
    11: 'Lieu de bataille',
    12: 'Lieu de débarquement',
    13: 'Naufrage',
    14: 'Épave',
    15: 'Musée',
    16: 'Trace de passage',
    17: 'Base',
    18: 'Port',
    19: 'Autre lieu remarquable',
  };
  return types[typeId] || 'Inconnu';
}

export default async function LieuPage({ params }: LieuProps) {
  const id = parseInt(params.id);
  if (isNaN(id)) return <p>ID invalide</p>;

  // ------------------------
  // Fetch lieu
  // ------------------------
  const { data: lieu, error: lieuError } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single();
  if (lieuError || !lieu) {
    console.error(lieuError);
    return <p>Lieu non trouvé.</p>;
  }

  // ------------------------
  // Fetch marins associés
  // ------------------------
  const { data: marinsData, error: marinsError } = await supabase
    .from('location_persons')
    .select(`person_id, persons(name, rank)`)
    .eq('location_id', id);
  if (marinsError) console.error(marinsError);
  const marins = marinsData?.map((item: any) => item.persons) || [];

  // ------------------------
  // Fetch photos associées
  // ------------------------
  const { data: photosData, error: photosError } = await supabase
    .from('photos')
    .select('*')
    .eq('location_id', id);
  if (photosError) console.error(photosError);
  const photos = photosData || [];

  // ------------------------
  // Render page
  // ------------------------
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* Statut en haut */}
      <div
        style={{
          padding: '0.5rem 1rem',
          borderRadius: '6px',
          textAlign: 'center',
          fontWeight: 'bold',
          color: '#fff',
          backgroundColor: lieu.status === 'approved' ? '#28a745' : '#dc3545',
          marginBottom: '1rem',
        }}
      >
        {lieu.status === 'approved' ? '✅ Vérifié' : '⚠️ Non vérifié'}
      </div>

      <h1 style={{ marginBottom: '1rem', fontSize: '2rem', color: '#003366' }}>{lieu.title}</h1>

      {/* Description */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3 style={{ color: '#0070f3' }}>ℹ️ Description</h3>
        <p>{lieu.description || 'Aucune description.'}</p>
      </div>

      {/* Localisation */}
      <div style={{ backgroundColor: '#eef6f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3 style={{ color: '#0070f3' }}>📍 Localisation</h3>
        <p>
          {lieu.address_text || '-'} {lieu.country || '-'} <br />
          Coordonnées : {lieu.latitude}, {lieu.longitude}
        </p>

        {/* Mini-plan Leaflet */}
        {lieu.latitude && lieu.longitude && (
          <div style={{ height: '300px', width: '100%', marginTop: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
            <MapContainer
              center={[lieu.latitude, lieu.longitude]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={[lieu.latitude, lieu.longitude]}>
                <Popup>{lieu.title}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )}
      </div>

      {/* Type de lieu */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: '1 1 200px', backgroundColor: '#fff3e6', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#d97706' }}>🏷️ Type de lieu</h3>
          <p>{getTypeLabel(lieu.type_id)}</p>
        </div>
      </div>

      {/* Marins associés */}
      {marins.length > 0 && (
        <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#0070f3' }}>👨‍✈️ Marins associés</h3>
          <ul>
            {marins.map((m: any, idx: number) => (
              <li key={idx}>
                {m.rank ? `${m.rank} – ` : ''}
                {m.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div style={{ backgroundColor: '#eef6f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
          <h3 style={{ color: '#0070f3' }}>📷 Photos</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {photos.map((p: any, idx: number) => (
              <img
                key={idx}
                src={p.url}
                alt={p.description || 'Photo du lieu'}
                style={{ maxWidth: '300px', borderRadius: '6px', objectFit: 'cover' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
