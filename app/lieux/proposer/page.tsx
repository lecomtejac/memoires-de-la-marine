'use client';

import Link from 'next/link';

export default function ProposerLieuPage() {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      
      {/* Bannière "en construction" */}
      <div
        style={{
          backgroundColor: '#ffcc00',
          color: '#000',
          padding: '1rem',
          textAlign: 'center',
          fontWeight: 'bold',
          borderRadius: '5px',
          marginBottom: '2rem',
        }}
      >
        ⚠️ Ce site est en construction ⚠️
      </div>

      {/* Entête */}
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1>Proposer un lieu de mémoire</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
          Vous pouvez contribuer à enrichir la mémoire maritime en ajoutant des lieux de mémoire.
        </p>
      </header>

      {/* Boutons */}
      <div style={{ textAlign: 'center', marginTop: '3rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {/* Bouton S’identifier */}
        <Link
  href="/login"
  style={{
    display: 'inline-block',
    padding: '1rem 2rem',
    backgroundColor: '#0070f3',
    color: '#fff',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '1.2rem',
  }}
>
  S'identifier
</Link>

        {/* Bouton Créer un compte */}
        <Link
          href="/register"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#28a745',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          Créer un compte
        </Link>

        {/* Bouton Retour Carte */}
        <Link
          href="/lieux/test-carte-leaflet"
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            backgroundColor: '#6c757d',
            color: '#fff',
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          }}
        >
          Retour carte
        </Link>
      </div>

      {/* Section explicative */}
      <section style={{ marginTop: '4rem', lineHeight: '1.6', color: '#333' }}>
        <h2>À propos du projet</h2>
        <p>
          L’objectif est de créer une carte collaborative des lieux de mémoire maritime, avec fiches détaillées, photos,
          informations historiques et contribution des utilisateurs. Chaque lieu peut être validé par un administrateur
          pour garantir la qualité et la fiabilité des données.
        </p>
        <p>
          Les types de lieux recensés incluent : tombes, monuments, plaques, épaves, sites de bataille, lieux de débarquement
          et musées. La base de données est construite sur Supabase et le site est développé avec Next.js.
        </p>
      </section>
    </div>
  );
}
