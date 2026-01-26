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
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ marginBottom: '1rem' }}>{lieu.title}</h1>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Description</h3>
        <p>{lieu.description || 'Aucune description.'}</p>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Localisation</h3>
        <p>
          {lieu.address_text || '-'} {lieu.country || '-'} <br />
          Coordonnées : {lieu.latitude}, {lieu.longitude}
        </p>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Type de lieu</h3>
        <p>{lieu.type_id || '-'}</p>
      </section>

      <section style={{ marginBottom: '1.5rem' }}>
        <h3>Statut</h3>
        <p>{lieu.status}</p>
      </section>

      {marins.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h3>Marins associés</h3>
          <ul>
            {marins.map((m: any, idx: number) => (
              <li key={idx}>
                {m.rank ? `${m.rank} – ` : ''}
                {m.name}
              </li>
            ))}
          </ul>
        </section>
      )}

      {photos.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <h3>Photos</h3>
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
        </section>
      )}
    </div>
  );
}
