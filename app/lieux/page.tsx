'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import MapLieux from './MapLieux';

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

  // Définir un centre moyen pour la carte
  const defaultCenter: [number, number] =
    lieux.length > 0
      ? [lieux[0].latitude, lieux[0].longitude]
      : [46.603354, 1.888334]; // France

  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Carte des lieux de mémoire</h1>

      {/* 🗺️ CARTE */}
      <div style={{ marginBottom: '2rem' }}>
        <MapLieux center={defaultCenter} />
      </div>

      {/* 📋 LISTE */}
      <h2>Liste des lieux de mémoire</h2>

      {loading && <p>Chargement des lieux…</p>}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
      {!loading && !errorMsg && lieux.length === 0 && <p>Aucun lieu trouvé.</p>}

      {!loading && !errorMsg && lieux.length > 0 && (
        <ul>
          {lieux.map((lieu) => (
            <li key={lieu.id} style={{ marginBottom: '1rem' }}>
              <strong>{lieu.title}</strong>
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
