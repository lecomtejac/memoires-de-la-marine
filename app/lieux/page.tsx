'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabaseClient';

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
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLieux = async () => {
      try {
        const { data, error } = await supabase.from('locations').select('*');
        if (error) throw error;

        const filteredData: Lieu[] = (data ?? []).map((row: any) => ({
          id: row.id,
          title: row.title ?? 'Titre inconnu',
          description: row.description ?? null,
          country: row.country ?? null,
          status: row.status ?? null,
          latitude: row.latitude ?? 0,
          longitude: row.longitude ?? 0,
        }));

        setLieux(filteredData);
      } catch (err: any) {
        console.error('Erreur fetch:', err);
        setErrorMsg(err.message ?? 'Erreur lors de la récupération des lieux');
        setLieux([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLieux();
  }, []);

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Liste des lieux de mémoire</h1>

      {/* 🔘 Bouton voir la carte */}
      <div style={{ margin: '2rem 0' }}>
        <Link
          href="/lieux/carte"
          style={{
            display: 'inline-block',
            padding: '0.8rem 1.5rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          🗺️ Voir la carte
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
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
