'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

interface Lieu {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
}

export default function LieuxPage() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLieux = async () => {
      try {
        const { data, error } = await supabase.from('locations').select('id, title, latitude, longitude');
        if (error) throw error;

        setLieux(
          (data ?? []).map((row: any) => ({
            id: row.id,
            title: row.title ?? 'Titre inconnu',
            latitude: row.latitude ?? 0,
            longitude: row.longitude ?? 0,
          }))
        );
      } catch (err: any) {
        console.error('Erreur fetch:', err);
        setErrorMsg(err.message ?? 'Erreur lors de la récupération');
        setLieux([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLieux();
  }, []);

  if (loading) return <p>Chargement des lieux…</p>;
  if (errorMsg) return <p style={{ color: 'red' }}>{errorMsg}</p>;

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Mémoire de la Marine</h1>
        <p>Tableau des lieux de mémoire maritime</p>
        <Link
          href="/"
          style={{
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '5px',
            textDecoration: 'none',
          }}
        >
          Retour à l&apos;accueil
        </Link>
      </header>

      {lieux.length === 0 ? (
        <p>Aucun lieu trouvé pour le moment.</p>
      ) : (
        <ul>
          {lieux.map((lieu) => (
            <li key={lieu.id} style={{ marginBottom: '1rem' }}>
              <strong>{lieu.title}</strong> — {lieu.latitude}, {lieu.longitude}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
