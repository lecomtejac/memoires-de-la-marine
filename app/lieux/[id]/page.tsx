import { supabase } from '../../../lib/supabaseClient';
import React from 'react';

// Next.js App Router : page dynamique côté serveur
interface LieuProps {
  params: { id: string };
}

// Fonction pour retourner un nom lisible du type de lieu
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
      </div>

      {/* Type et statut */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: '1 1 200px', backgroundColor: '#fff3e6', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#d97706' }}>🏷️ Type de lieu</h3>
          <p>{getTypeLabel(lieu.type_id)}</p>
        </div>
        <div style={{ flex: '1 1 200px', backgroundColor: '#f0f5ff', padding: '1rem', borderRadius: '8px' }}>
          <h3 style={{ color: '#3b82f6' }}>📌 Statut</h3>
          <p>{lieu.status}</p>
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
                style={{ maxWidth: '250px', borderRadius: '6px', objectFit: 'cover' }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
