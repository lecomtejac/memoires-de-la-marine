'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useParams } from 'next/navigation';

export default function LieuPage() {
  const params = useParams();
  const id = params.id;
  const [lieu, setLieu] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLieu = async () => {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', id)
        .single();

      if (error) console.error(error);
      else setLieu(data);
    };

    fetchLieu();
  }, [id]);

  if (!lieu) return <p>Chargement…</p>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <h1>{lieu.title}</h1>
      <p>{lieu.description}</p>
      <p>
        Localisation : {lieu.address_text || ''} {lieu.country || ''} ({lieu.latitude}, {lieu.longitude})
      </p>
      <p>Statut : {lieu.status}</p>
    </div>
  );
}
