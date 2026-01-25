'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        maxWidth: '900px',
        margin: '0 auto',
        padding: '1.5rem 1rem',
      }}
    >
      {/* Bannière "en construction" */}
      <div
        style={{
          backgroundColor: '#ffcc00',
          color: '#000',
          padding: '0.75rem 1rem',
          textAlign: 'center',
          fontWeight: 'bold',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          fontSize: '0.95rem',
        }}
      >
        ⚠️ Ce site est en cours de développement ⚠️
      </div>

      {/* Entête */}
      <header
        style={{
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
            marginBottom: '0.75rem',
          }}
        >
          Mémoires de la Marine
        </h1>

        <p
          style={{
            fontSize: '1.05rem',
            margin: '0 auto 0.75rem',
            maxWidth: '750px',
          }}
        >
          Ce projet vise à recenser tous les lieux de mémoire de la Marine, de la Marine nationale en particulier et du monde maritime en général : tombes de marins célèbres, monuments, plaques commémoratives, musées, lieux de naufrage ou de débarquement, port ou bases navales principales. Et tout autres sites symboliques en lien avec la Marine...
        </p>

        <p
          style={{
            fontSize: '0.95rem',
            color: '#555',
            maxWidth: '700px',
            margin: '0 auto',
          }}
        >
          Contribuez à enrichir cette mémoire collective en découvrant ou en ajoutant des lieux de mémoire.
        </p>
      </header>

      {/* Bouton vers la page */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <Link
          href="https://memoires-de-la-marine-i8gy.vercel.app/lieux/test-carte-leaflet"
          style={{
            display: 'inline-block',
            padding: '0.9rem 1.6rem',
            backgroundColor: '#0070f3',
            color: '#fff',
            borderRadius: '999px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1.05rem',
            boxShadow: '0 6px 16px rgba(0,0,0,0.15)',
          }}
        >
          Consulter les lieux de mémoire
        </Link>
      </div>

      {/* Section explicative */}
      <section
        style={{
          lineHeight: '1.65',
          color: '#333',
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h2
          style={{
            fontSize: '1.4rem',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          À propos du projet
        </h2>

        <p>
          L’objectif est de créer une carte collaborative des lieux de mémoire maritime, avec fiches détaillées, photos, informations historiques et contribution des utilisateurs. Chaque lieu proposé sera validé par un administrateur pour garantir la qualité et la fiabilité des données..
        </p>

        <p>
          Les types de lieux recensés incluent : tombes, monuments, plaques, épaves, sites de bataille, lieux de débarquement et musées. 
        </p>

        <p>
          Issu d’une initiative personnelle, ce site évoluera progressivement tant dans son design que dans ses fonctionnalités. 
        </p>
      </section>
    </div>
  );
}
