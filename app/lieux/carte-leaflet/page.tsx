'use client';

import LeafletMap from '@/components/LeafletMap';

export default function Page() {
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test carte Leaflet avec marker</h1>
      <LeafletMap position={defaultPosition} zoom={5} />
    </div>
  );
}
