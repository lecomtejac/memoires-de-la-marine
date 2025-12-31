'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // chemin vers ton client existant

type Lieu = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
};

export default function TestSupabase() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLieux() {
      const { data, error } = await supabase.from('locations').select('*');
      if (error) {
        console.error('Erreur Supabase:', error);
        setError(error.message);
      } else {
        setLieux(data as Lieu[]);
      }
    }
    fetchLieux();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Test récupération Supabase</h2>
      {error && <p style={{ color: 'red' }}>Erreur: {error}</p>}
      <ul>
        {lieux.map((lieu) => (
          <li key={lieu.id}>
            {lieu.name} – ({lieu.latitude}, {lieu.longitude})
          </li>
        ))}
      </ul>
      {lieux.length === 0 && !error && <p>Chargement...</p>}
    </div>
  );
}
