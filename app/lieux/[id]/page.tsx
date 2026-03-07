import { supabase } from '../../../lib/supabaseClient';
import React from 'react';
import Link from 'next/link';

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

function formatPeriodStart(periodStart: string | null) {
  if (!periodStart) return 'Date inconnue';

  const date = new Date(periodStart);

  // Si c’est le 1er janvier → on affiche seulement l’année
  if (date.getUTCDate() === 1 && date.getUTCMonth() === 0) {
    return date.getUTCFullYear().toString();
  }

  // Sinon date complète (JJ/MM/AAAA)
  return date.toLocaleDateString('fr-FR', {
    timeZone: 'UTC',
  });
}

function formatPhotoDate(dateString: string | null) {
  if (!dateString) return null;

  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

// ⭐ NOUVEAU — format date création lieu
function formatCreatedDate(dateString: string | null) {
  if (!dateString) return 'Date inconnue';

  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const id = parseInt(params.id);

  const { data: lieu } = await supabase
    .from('locations')
    .select('title, description')
    .eq('id', id)
    .single();

  if (!lieu) {
    return {
      title: 'Lieu de mémoire maritime',
    };
  }

  return {
    title: `${lieu.title} – ${getTypeLabel(lieu.type_id)} | Mémoires de la Marine`,
    description:
      lieu.description?.slice(0, 160) ||
      `Découvrez ${lieu.title}, lieu de mémoire maritime recensé sur Mémoires de la Marine.`,
    alternates: {
      canonical: `https://www.memoiresdelamarine.fr/lieux/${id}`,
    },
  };
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

  // ⭐ NOUVEAU — récupérer le pseudo du créateur
  let creatorUsername = 'inconnu';

  if (lieu.created_by) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', lieu.created_by)
      .single();

    if (profile?.username) creatorUsername = profile.username;
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
      
      {/* 🔹 Bouton Retour Carte */}
     <div
  style={{
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: 'white',
    padding: '0.3rem 1rem',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'flex-start',
  }}
>
  <Link
    href="/lieux/test-carte-leaflet"
    style={{
      display: 'inline-block',
      padding: '4px 8px',
      backgroundColor: '#1e88e5',
      color: 'white',
      borderRadius: '6px',
      fontWeight: '600',
      fontSize: '12px',
      textDecoration: 'none',
    }}
  >
    ← Carte
  </Link>
</div>

      {/* 🔹 Titre du lieu */}
      <h1 style={{ marginBottom: '1rem', fontSize: '2rem', color: '#003366' }}>
        {lieu.title}
      </h1>

      {/* ⭐ NOUVEAU — Création du lieu */}
      <div
        style={{
          marginTop: '-0.5rem',
          marginBottom: '1.5rem',
          fontSize: '0.9rem',
          color: '#666',
          fontStyle: 'italic',
        }}
      >
        Lieu créé par <strong>{creatorUsername}</strong> le {formatCreatedDate(lieu.created_at)}
      </div>

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

      {/* Date / période du lieu */}
<div
  style={{
    backgroundColor: '#f5f7fa',
    padding: '1rem',
    borderRadius: '8px',
    marginBottom: '1rem',
    borderLeft: '4px solid #6366f1',
  }}
>
  <h3 style={{ color: '#4f46e5' }}>🗓️ Date / période du lieu</h3>
  <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>
    {formatPeriodStart(lieu.period_start)}
  </p>
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
  <div
    key={idx}
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: '250px',
    }}
  >
    <img
      src={p.url}
      alt={p.description || 'Photo du lieu'}
      style={{
        width: '100%',
        borderRadius: '6px',
        objectFit: 'cover',
      }}
    />

    {p.created_at && (
      <span
        style={{
          marginTop: '0.4rem',
          fontSize: '0.8rem',
          color: '#555',
          fontStyle: 'italic',
        }}
      >
        Prise le {formatPhotoDate(p.created_at)}
      </span>
    )}
  </div>
))}
          </div>
        </div>
      )}

<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Place",
      name: lieu.title,
      url: `https://www.memoiresdelamarine.fr/lieux/${id}`,
      description: lieu.description,
    }),
  }}
/>
      
    </div>
  );
}
