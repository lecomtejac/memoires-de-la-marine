'use client';

import Link from 'next/link';

export default function CarteLieuxPage() {
  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '2rem',
      }}
    >
      <header style={{ marginBottom: '1.5rem' }}>
        <h1>Carte des lieux de mémoire</h1>
        <p style={{ color: '#555', marginTop: '0.5rem' }}>
          Carte générale des lieux de mémoire maritime. Les points seront ajoutés
          ultérieurement.
        </p>
      </header>

      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/lieux"
          style={{
            display: 'inline-block',
            padding: '0.6rem 1.2rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '6px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          ← Retour à la liste des lieux
        </Link>
      </div>

      <div
        style={{
          width: '100%',
          height: '500px',
          borderRadius: '10px',
          overflow: 'hidden',
          border: '1px solid #ccc',
        }}
      >
        <iframe
          src="https://www.openstreetmap.org/export/embed.html?bbox=-5.5%2C41.0%2C9.8%2C51.5&layer=mapnik"
          style={{ width: '100%', height: '100%', border: 0 }}
          loading="lazy"
        />
      </div>

      <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
        Carte centrée sur la France.
      </p>
    </div>
  );
}
