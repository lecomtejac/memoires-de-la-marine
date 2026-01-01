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
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Liste des lieux de mémoire</h1>

      {/* Boutons pour cartes */}
      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <Link
          href="/lieux/carte"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '5px',
            textDecoration: 'none',
          }}
        >
          Carte E-Frame
        </Link>
        <Link
          href="/lieux/carte-leaflet"
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#00b300',
            color: '#fff',
            borderRadius: '5px',
            textDecoration: 'none',
          }}
        >
          Carte Leaflet
        </Link>
        {/* Nouveau bouton orange vers /lieux/test-carte-leaflet */}
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
