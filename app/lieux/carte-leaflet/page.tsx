'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabaseClient';

const MapComponent = dynamic(() => import('../components/Map'), { ssr: false });

interface Lieu {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
}

export default function CarteLeafletPage() {
  const [lieux, setLieux] = useState<Lieu[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLieux = async () => {
      const { data } = await supabase.from('locations').select('id,title,latitude,longitude');
      setLieux(data ?? []);
      setLoading(false);
    };
    fetchLieux();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Carte Leaflet des lieux de mémoire</h1>
      <Link href="/lieux" style={{ display: 'inline-block', marginBottom: '1rem', color: '#0070f3' }}>
        ← Retour à la liste
      </Link>

      {loading ? (
        <p>Chargement de la carte…</p>
      ) : (
        <div style={{ height: '600px', width: '100%' }}>
          <MapComponent markers={lieux} />
        </div>
      )}
    </div>
  );
}
