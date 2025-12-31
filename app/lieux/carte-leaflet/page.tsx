import LeafletMap from '@/components/LeafletMap';

export default function CarteLeafletPage() {
  const defaultPosition: [number, number] = [48.8566, 2.3522]; // Paris

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test carte Leaflet avec Marker</h1>
      <LeafletMap position={defaultPosition} />
    </div>
  );
}
