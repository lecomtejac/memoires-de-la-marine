'use client';

import Link from 'next/link';

export default function HomePage() {
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
        <h1>Mémoire de la Marine</h1>
        <p style={{ fontSize: '1.2rem', marginTop: '0.5rem' }}>
          Ce projet vise à recenser tous les lieux de mémoire maritime : tombes de marins, monuments,
          plaques commémoratives, épaves, musées et sites symboliques.
        </p>
        <p style={{ fontSize: '1rem', marginTop: '1rem', color: '#555' }}>
          Contribuez à enrichir cette mémoire collective en découvrant ou ajoutant des lieux de mémoire.
        </p>
      </header>

      {/* Bouton vers la page lieux */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link
          href="/lieux"
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
          Voir les lieux de mémoire
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
