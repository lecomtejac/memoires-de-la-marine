'use client';

import dynamic from 'next/dynamic';
import { Lieu } from './types'; // optionnel

// Leaflet doit être importé uniquement côté client
const MapLieux = dynamic(() => import('./MapLieux'), { ssr: false });

interface MapLieuxClientProps {
  lieux: Lieu[];
}

export default function MapLieuxClient({ lieux }: MapLieuxClientProps) {
  // si lieux undefined ou vide, ne rien afficher
  if (!Array.isArray(lieux) || lieux.length === 0) return null;

  return <MapLieux lieux={lieux} />;
}
