'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

interface Lieu {
  id: string;
  title: string;
  description?: string | null;
  country?: string | null;
  status?: string | null;
  latitude: number;
  longitude: number;
}

export default function LieuxPage() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLieux() {
      try {
        const { data, error } = await supabase.from('locations').select('*');
        if (error) throw error;

        const mappedData: Lieu[] = (data ?? []).map((row: any) => ({
          id: row.id,
          title: row.title ?? 'Titre inconnu',
          description: row.description ?? null,
          country: row.country ?? null,
          status: row.status ?? null,
          latitude: row.latitude ?? 0,
          longitude: row.longitude ?? 0,
        }));

        setLieux(mappedData);
      } catch (err: any) {
        console.error('Erreur fetch:', err);
        setErrorMsg(err.message ?? 'Erreur lors de la récupération des lieux');
        setLieux([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLieux();
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Liste des lieux de mémoire</h1>

      {/* Boutons pour cartes / navigation */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Nouveau bouton "Retour accueil" */}
        <Link
          href="/"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#888',
            color: '#fff',
            borderRadius: '5px',
            textDecoration: 'none',
          }}
        >
          Retour accueil
        </Link>

        {/* Bouton orange "Tester la carte Leaflet" */}
        <Link
          href="/lieux/test-carte-leaflet"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#ff6600',
            color: '#fff',
            borderRadius: '5px',
            textDecoration: 'none',
          }}
        >
          Tester la carte Leaflet
        </Link>
      </div>

      {loading && <p>Chargement des lieux…</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {!loading && !errorMsg && lieux.length === 0 && <p>Aucun lieu trouvé.</p>}

      {!loading && !errorMsg && lieux.length > 0 && (
        <ul>
          {lieux.map((lieu) => (
            <li key={lieu.id} style={{ marginBottom: '1rem' }}>
              <strong>{lieu.title}</strong>
              {lieu.description && <p>{lieu.description}</p>}
              {lieu.country && <p>Pays : {lieu.country}</p>}
              {lieu.status && <p>Statut : {lieu.status}</p>}
              <p>
                Coordonnées : {lieu.latitude}, {lieu.longitude}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
