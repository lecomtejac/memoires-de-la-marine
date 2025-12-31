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
    <div style={{ padding: '1rem', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Liste des lieux de mémoire</h1>

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

      {/* Bouton vers la page carte */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link
          href="/lieux/carte"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.1rem',
          }}
        >
          Voir la carte
        </Link>
      </div>
    </div>
  );
}
