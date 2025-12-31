'use client';

import dynamic from 'next/dynamic';

const Map = dynamic(() => import('./map'), {
  ssr: false,
});

export default function CarteLeafletPage() {
  return (
    <div style={{ height: '100vh' }}>
      <Map />
    </div>
  );
}
