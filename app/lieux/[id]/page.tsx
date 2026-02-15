import { supabase } from '../../../lib/supabaseClient';
import React from 'react';
import Link from 'next/link';

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

function formatPeriodStart(periodStart: string | null) {
  if (!periodStart) return 'Date inconnue';

  const date = new Date(periodStart);

  if (date.getUTCDate() === 1 && date.getUTCMonth() === 0) {
    return date.getUTCFullYear().toString();
  }

  return date.toLocaleDateString('fr-FR', { timeZone: 'UTC' });
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

function formatCreatedDate(dateString: string | null) {
  if (!dateString) return 'Date inconnue';

  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'UTC',
  });
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

  // ⭐ NOUVEAU — récupérer pseudo du créateur
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
  const { data: marinsData } = await supabase
    .from('location_persons')
    .select(`person_id, persons(name, rank)`)
    .eq('location_id', id);

  const marins = marinsData?.map((item: any) => item.persons) || [];

  // ------------------------
  // Fetch photos associées
  // ------------------------
  const { data: photosData } = await supabase
    .from('photos')
    .select('*')
    .eq('location_id', id);

  const photos = photosData || [];

  // ------------------------
  // Render
  // ------------------------
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>

      {/* Bouton retour */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: 'white',
        padding: '0.3rem 1rem',
        borderBottom: '1px solid #ddd'
      }}>
        <Link href="/lieux/test-carte-leaflet" style={{
          padding: '4px 8px',
          backgroundColor: '#1e88e5',
          color: 'white',
          borderRadius: '6px',
          fontWeight: 600,
          fontSize: '12px',
          textDecoration: 'none'
        }}>
          ← Carte
        </Link>
      </div>

      {/* Titre */}
      <h1 style={{ marginBottom: '0.3rem', fontSize: '2rem', color: '#003366' }}>
        {lieu.title}
      </h1>

      {/* ⭐ Création du lieu */}
      <div style={{ marginBottom: '1.5rem', fontSize: '0.9rem', color: '#666', fontStyle: 'italic' }}>
        Lieu créé par <strong>{creatorUsername}</strong> le {formatCreatedDate(lieu.created_at)}
      </div>

      {/* Description */}
      <div style={{ backgroundColor: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h3>ℹ️ Description</h3>
        <p>{lieu.description || 'Aucune description.'}</p>
      </div>

    </div>
  );
}
