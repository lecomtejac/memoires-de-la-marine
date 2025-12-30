'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

interface Lieu {
  id: string;
  name: string;
  type: string[];
  description: string;
}

export default function LieuxPage() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLieux = async () => {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('*');

        if (error) {
          console.error('Erreur Supabase:', error.message);
        } else if (data) {
          setLieux(data as Lieu[]);
        }
      } catch (err) {
        console.error('Erreur fetch:', err);
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
        <Link href="/" style={{
          display: 'inline-block',
          marginTop: '1rem',
          padding: '0.5rem 1rem',
          backgroundColor: '#0070f3',
          color: '#fff',
          borderRadius: '5px',
          textDecoration: 'none'
        }}>
          Retour à l'accueil
        </Link>
      </header>

      {/* Contenu */}
      {loading ? (
        <p>Chargement des lieux…</p>
      ) : lieux.length === 0 ? (
        <p>Aucun lieu trouvé pour le moment.</p>
      ) : (
        <ul>
          {lieux.map((lieu) => (
            <li key={lieu.id} style={{ marginBottom: '1.5rem', borderBottom: '1px solid #ccc', paddingBottom: '0.5rem' }}>
              <h2>{lieu.name}</h2>
              {lieu.type.length > 0 && <p>Type : {lieu.type.join(', ')}</p>}
              {lieu.description && <p>{lieu.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
