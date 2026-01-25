'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '3rem 1.5rem',
        color: '#0f172a',
      }}
    >
      {/* Bannière "en construction" */}
      <div
        style={{
          background: 'linear-gradient(90deg, #facc15, #fde047)',
          color: '#1f2933',
          padding: '1rem',
          textAlign: 'center',
          fontWeight: 600,
          borderRadius: '10px',
          marginBottom: '3rem',
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
        }}
      >
        ⚠️ Ce site est en cours de développement ⚠️
      </div>

      {/* Entête */}
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '2.6rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            marginBottom: '1rem',
          }}
        >
          Mémoires de la Marine
        </h1>

        <p
          style={{
            fontSize: '1.15rem',
            lineHeight: '1.7',
            maxWidth: '750px',
            margin: '0 auto',
            color: '#334155',
          }}
        >
          Ce projet vise à recenser tous les lieux de mémoire de la Marine, de la Marine nationale en particulier et du monde maritime en général : tombes de marins célèbres, monuments, plaques commémoratives, musées, lieux de naufrage ou de débarquement, port ou bases navales principales. Et tout autres sites symboliques en lien avec la Marine...
        </p>

        <p
          style={{
            fontSize: '1rem',
            marginTop: '1.5rem',
            color: '#64748b',
          }}
        >
          Contribuez à enrichir cette mémoire collective en découvrant ou en ajoutant des lieux de mémoire.
        </p>
      </header>

      {/* Bouton vers la page */}
      <div style={{ textAlign: 'center', marginTop: '3rem' }}>
        <Link
          href="https://memoires-de-la-marine-i8gy.vercel.app/lieux/test-carte-leaflet"
          style={{
            display: 'inline-block',
            padding: '1rem 2.5rem',
            background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
            color: '#fff',
            borderRadius: '999px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1.1rem',
            boxShadow: '0 8px 20px rgba(2, 132, 199, 0.35)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
        >
          Consulter les lieux de mémoire
        </Link>
      </div>

      {/* Section explicative */}
      <section
        style={{
          marginTop: '5rem',
          padding: '2.5rem',
          borderRadius: '16px',
          backgroundColor: '#f8fafc',
          lineHeight: '1.7',
          boxShadow: '0 10px 30px rgba(0,0,0,0.06)',
        }}
      >
        <h2
          style={{
            fontSize: '1.8rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
          }}
        >
          À propos du projet
        </h2>

        <p style={{ marginBottom: '1rem' }}>
          L’objectif est de créer une carte collaborative des lieux de mémoire maritime, avec fiches détaillées, photos, informations historiques et contribution des utilisateurs. Chaque lieu proposé sera validé par un administrateur pour garantir la qualité et la fiabilité des données..
        </p>

        <p style={{ marginBottom: '1rem' }}>
          Les types de lieux recensés incluent : tombes, monuments, plaques, épaves, sites de bataille, lieux de débarquement et musées.
        </p>

        <p>
          Issu d’une initiative personnelle, ce site évoluera progressivement tant dans son design que dans ses fonctionnalités.
        </p>
      </section>
    </div>
  );
}
