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
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLieux = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');

        if (error) {
          console.error('Erreur Supabase:', error.message);
          setErrorMsg(error.message);
        } else if (data) {
          // Vérifie que chaque ligne a bien les colonnes attendues
          const filteredData = data.map((row: any) => ({
            id: row.id,
            title: row.title ?? 'Titre inconnu',
            description: row.description ?? null,
            country: row.country ?? null,
            status: row.status ?? null,
            latitude: row.latitude ?? 0,
            longitude: row.longitude ?? 0,
          }));
          setLieux(filteredData);
        }
      } catch (err) {
        console.error('Erreur fetch:', err);
        setErrorMsg('Erreur lors de la récupération des lieux');
      } finally {
        setLoading(false);
      }
    };

    fetchLieux();
  }, []);

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      {/* Entête */}
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Mémoire de la Marine</h1>
        <p>Carte collaborative des lieux de mémoire maritime</p>
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
          Retour à l'accueil
        </Link>
      </header>

      {/* Contenu */}
      {loading ? (
        <p>Chargement des lieux…</p>
      ) : errorMsg ? (
        <p style={{ color: 'red' }}>{errorMsg}</p>
      ) : lieux.length === 0 ? (
        <p>Aucun lieu trouvé pour le moment.</p>
      ) : (
        <ul>
          {lieux.map((lieu) => (
            <li
              key={lieu.id}
              style={{
                marginBottom: '1.5rem',
                borderBottom: '1px solid #ccc',
                paddingBottom: '0.5rem',
              }}
            >
              <h2>{lieu.title}</h2>
              {lieu.description && <p>{lieu.description}</p>}
              {lieu.country && <p>Pays : {lieu.country}</p>}
              {lieu.status && <p>Statut : {lieu.status}</p>}
              <p>Coordonnées : {lieu.latitude}, {lieu.longitude}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
