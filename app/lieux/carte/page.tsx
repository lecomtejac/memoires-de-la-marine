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
      {/* En-tête */}
      <header style={{ marginBottom: '1.5rem' }}>
        <h1>Carte des lieux de mémoire</h1>
        <p style={{ color: '#555', marginTop: '0.5rem' }}>
          Cette carte affichera à terme l’ensemble des lieux de mémoire maritime :
          tombes, monuments, épaves, musées et sites historiques.
        </p>
      </header>

      {/* Bouton retour */}
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

      {/* Carte */}
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
          src="https://www.openstreetmap.org/export/embed.html"
          style={{ width: '100%', height: '100%', border: 0 }}
          loading="lazy"
        />
      </div>

      {/* Texte bas de page */}
      <p style={{ marginTop: '1rem', color: '#666', fontSize: '0.9rem' }}>
        Carte générale – les marqueurs seront ajoutés ultérieurement.
      </p>
    </div>
  );
}
