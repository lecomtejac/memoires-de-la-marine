'use client';

import dynamic from 'next/dynamic';
import { Lieu } from './types'; // optionnel : définis ton interface

// Import de MapLieux uniquement côté client
const MapLieux = dynamic(() => import('./MapLieux'), { ssr: false });

interface MapLieuxClientProps {
  lieux: Lieu[];
}

export default function MapLieuxClient({ lieux }: MapLieuxClientProps) {
  if (!lieux || lieux.length === 0) return null;
  return <MapLieux lieux={lieux} />;
}
