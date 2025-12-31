// app/lieux/carte-leaflet/page.tsx
import LeafletMap from '@/components/LeafletMap';

export default function Page() {
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Carte Leaflet avec marker dynamique</h1>
      <LeafletMap position={defaultPosition} zoom={5} />
    </div>
  );
}
