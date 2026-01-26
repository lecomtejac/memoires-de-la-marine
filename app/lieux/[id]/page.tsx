import { supabase } from '../../../lib/supabaseClient';
import React from 'react';

// Next.js App Router : page dynamique côté serveur
interface LieuProps {
  params: { id: string };
}

export default async function LieuPage({ params }: LieuProps) {
  const id = parseInt(params.id);

  if (isNaN(id)) {
    return <p>ID invalide</p>;
  }

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

  if (marinsError) {
    console.error(marinsError);
  }

  const marins = marinsData?.map((item: any) => item.persons) || [];

  // ------------------------
  // Fetch photos associées
  // ------------------------
  const { data: photosData, error: photosError } = await supabase
    .from('photos')
    .select('*')
    .eq('location_id', id);

  if (photosError) {
    console.error(photosError);
  }

  const photos = photosData || [];

  // ------------------------
  // Render page
  // ------------------------
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>{lieu.title}</h1>
      <p>{lieu.description}</p>

      <h3>Localisation</h3>
      <p>
        {lieu.address_text || ''} {lieu.country || ''} ({lieu.latitude},{' '}
        {lieu.longitude})
      </p>

      <h3>Statut</h3>
      <p>{lieu.status}</p>

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
