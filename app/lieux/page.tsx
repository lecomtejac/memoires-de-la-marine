'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

import { supabase } from '../../lib/supabaseClient';
import MapLieux from '@/components/MapLieux';

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
          return;
        }

        if (data) {
          const filteredData: Lieu[] = data.map((row: any) => ({
            id: row.id,
            title: row.title ?? 'Titre inconnu',
            description: row.description ?? null,
            country: row.country ?? null,
            status: row.status ?? null,
            latitude: row.latitude,
            longitude: row.longitude,
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
          Retour à l&apos;accueil
        </Link>
      </header>

      {/* Chargement / erreurs */}
      {loading && <p>Chargement des lieux…</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {/* 🗺️ Carte interactive */}
      {!loading && !errorMsg && lieux.length > 0 && (
        <MapLieux lieux={lieux} />
      )}

      {/* Liste (base unique, même source que la carte) */}
      {!loading && !errorMsg && lieux.length === 0 && (
        <p>Aucun lieu trouvé pour le moment.</p>
      )}

      {!loading && !errorMsg && lieux.length > 0 && (
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
