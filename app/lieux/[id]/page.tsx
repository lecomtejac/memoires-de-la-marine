// ------------------------
// Page serveur
// ------------------------
import { supabase } from '../../../lib/supabaseClient';
import React from 'react';

// wrapper client pour la carte
const MapClient = ({ latitude, longitude, title }: { latitude: number; longitude: number; title: string }) => {
  'use client';
  import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';

  // Fix icône Leaflet
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
    iconUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
    shadowUrl:
      'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  });

  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={13}
      style={{ height: '300px', width: '100%' }}
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[latitude, longitude]}>
        <Popup>{title}</Popup>
      </Marker>
    </MapContainer>
  );
};

// ------------------------
// Page serveur principale
// ------------------------
interface LieuProps {
  params: { id: string };
}

export default async function LieuPage({ params }: LieuProps) {
  const id = parseInt(params.id);
  if (isNaN(id)) return <p>ID invalide</p>;

  const { data: lieu, error: lieuError } = await supabase
    .from('locations')
    .select('*')
    .eq('id', id)
    .single();

  if (lieuError || !lieu) return <p>Lieu non trouvé.</p>;

  const { data: marinsData } = await supabase
    .from('location_persons')
    .select(`person_id, persons(name, rank)`)
    .eq('location_id', id);

  const marins = marinsData?.map((item: any) => item.persons) || [];

  const { data: photosData } = await supabase
    .from('photos')
    .select('*')
    .eq('location_id', id);

  const photos = photosData || [];

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      {/* Statut vérifié/non vérifié */}
      <div
        style={{
          backgroundColor: lieu.status === 'approved' ? '#d4edda' : '#f8d7da',
          color: lieu.status === 'approved' ? '#155724' : '#721c24',
          fontWeight: 'bold',
          padding: '0.5rem 1rem',
          borderRadius: '5px',
          marginBottom: '1rem',
        }}
      >
        {lieu.status === 'approved' ? 'Vérifié' : 'Non vérifié'}
      </div>

      <h1>{lieu.title}</h1>
      <p>{lieu.description}</p>

      <h3>Localisation</h3>
      <p>
        {lieu.address_text || ''} {lieu.country || ''} ({lieu.latitude}, {lieu.longitude})
      </p>

      {/* Carte côté client */}
      {lieu.latitude && lieu.longitude && <MapClient latitude={lieu.latitude} longitude={lieu.longitude} title={lieu.title} />}

      {marins.length > 0 && (
        <>
          <h3>Marins associés</h3>
          <ul>
            {marins.map((m: any, idx: number) => (
              <li key={idx}>
                {m.rank ? `${m.rank} – ` : ''}
                {m.name}
              </li>
            ))}
          </ul>
        </>
      )}

      {photos.length > 0 && (
        <>
          <h3>Photos</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
            {photos.map((p: any, idx: number) => (
              <img
                key={idx}
                src={p.url}
                alt={p.description || 'Photo du lieu'}
                style={{ maxWidth: '200px', borderRadius: '6px' }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
