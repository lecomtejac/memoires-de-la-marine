export default function CarteLieuxPage() {
  return (
    <div style={{ padding: '1rem', fontFamily: 'sans-serif' }}>
      <h1>Carte des lieux de mémoire</h1>

      <p style={{ marginBottom: '1rem', color: '#555' }}>
        Carte générale (les marqueurs viendront plus tard)
      </p>

      <iframe
        title="Carte OpenStreetMap"
        src="https://www.openstreetmap.org/export/embed.html?bbox=-6.5,41.0,10.5,51.5&layer=mapnik"
        style={{
          width: '100%',
          height: '80vh',
          border: '1px solid #ccc',
          borderRadius: '6px',
        }}
        loading="lazy"
      />
    </div>
  );
}
