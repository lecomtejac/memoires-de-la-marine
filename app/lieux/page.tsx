'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

interface Lieu {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
}

export default function TestLieuxPage() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchLieux = async () => {
      try {
        const { data, error } = await supabase.from('locations').select('*');
        if (error) throw error;
        console.log('Données récupérées:', data); // <- Vérifie dans la console

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

  if (loading) return <p>Chargement…</p>;
  if (errorMsg) return <p style={{ color: 'red' }}>{errorMsg}</p>;

  return (
    <div>
      <h1>Test récupération lieux</h1>
      <ul>
        {lieux.map((lieu) => (
          <li key={lieu.id}>
            {lieu.title} — {lieu.latitude}, {lieu.longitude}
          </li>
        ))}
      </ul>
    </div>
  );
}
