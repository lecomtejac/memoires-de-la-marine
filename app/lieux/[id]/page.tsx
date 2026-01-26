'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import { useParams } from 'next/navigation';

export default function LieuPage() {
  const params = useParams();
  const idParam = params.id; // peut être string | string[] | undefined
  const [lieu, setLieu] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Convertir id en integer si c'est bien une string
  const id = Array.isArray(idParam) ? idParam[0] : idParam;

  useEffect(() => {
    if (!id) return;

    const fetchLieu = async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('id', parseInt(id)) // <-- maintenant safe
        .single();

      if (error) {
        console.error(error);
        setErrorMsg('Lieu non trouvé.');
      } else {
        setLieu(data);
      }
      setLoading(false);
    };

    fetchLieu();
  }, [id]);

  if (loading) return <p>Chargement…</p>;
  if (errorMsg) return <p>{errorMsg}</p>;
  if (!lieu) return <p>Aucun lieu à afficher.</p>;

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
