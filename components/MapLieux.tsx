'use client';

import { useEffect, useRef } from 'react';
import { Lieu } from './types';

interface MapLieuxProps {
  lieux: Lieu[];
}

export default function MapLieux({ lieux }: MapLieuxProps) {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Import dynamique à l'intérieur du useEffect
    let map: any;
    (async () => {
      const L = await import('leaflet'); // importe Leaflet seulement côté client
      const 'leaflet/dist/leaflet.css';

      if (!mapRef.current) return;

      map = L.map(mapRef.current).setView([48.8566, 2.3522], 5);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      lieux.forEach((lieu) => {
        L.marker([lieu.latitude, lieu.longitude])
          .addTo(map)
          .bindPopup(`<b>${lieu.title}</b><br/>${lieu.description ?? ''}`);
      });
    })();

    return () => {
      if (map) map.remove();
    };
  }, [lieux]);

  return <div ref={mapRef} style={{ height: '500px', width: '100%' }} />;
}
