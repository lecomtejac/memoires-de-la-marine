'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

interface Lieu {
  id: string;
  title: string;
  description: string | null;
  country: string | null;
  status: string | null;
  latitude: number;
  longitude: number;
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

        console.log('Supabase data:', data, 'error:', error);

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
      ) : li
