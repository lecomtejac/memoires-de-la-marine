'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { MarkerData } from '../components/Map';

const MapComponent = dynamic(() => import('../components/Map'), { ssr: false });

export default function CarteLeafletPage() {
  const [lieux, setLieux] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLieux = async () => {
      const { data } = await supabase
        .from('locations')
        .select('id,title,latitude,longitude');
      setLieux(data ?? []);
      setLoading(false);
    };
    fetchLieux();
  }, []);

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Carte Leaflet des lieux de mémoire</h1>

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
