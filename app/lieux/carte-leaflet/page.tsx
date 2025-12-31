// app/lieux/carte-leaflet/page.tsx
export default function Page() {
  const mapContainerStyle = {
    height: '500px',
    width: '100%',
    backgroundColor: '#e0e0e0', // couleur grise pour voir le conteneur
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem',
    color: '#333',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Test carte Leaflet</h1>
      <div style={mapContainerStyle}>
        Test
      </div>
    </div>
  );
}
