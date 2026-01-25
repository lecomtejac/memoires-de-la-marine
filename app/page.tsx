'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(180deg, #f8fafc, #ffffff)',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
          padding: '2.5rem 1.5rem 4rem', // ↓ remonté
          color: '#0f172a',
        }}
      >
        {/* Bannière "en construction" */}
        <div
          style={{
            backgroundColor: '#fef3c7',
            color: '#92400e',
            padding: '0.9rem',
            textAlign: 'center',
            fontWeight: 600,
            borderRadius: '12px',
            marginBottom: '2.5rem', // ↓
            border: '1px solid #fde68a',
          }}
        >
          ⚠️ Ce site est en cours de développement ⚠️
        </div>

        {/* Entête avec illustration maritime */}
        <header
          style={{
            position: 'relative',
            textAlign: 'center',
            marginBottom: '2.5rem', // ↓
            padding: '2rem 1rem', // ↓
            overflow: 'hidden',
          }}
        >
          {/* Illustration vague */}
          <svg
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              opacity: 0.12,
            }}
          >
            <path
              fill="#0ea5e9"
              d="M0,160L80,176C160,192,320,224,480,208C640,192,800,128,960,112C1120,96,1280,128,1360,144L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"
            />
          </svg>

          {/* Contenu texte */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1
              style={{
                fontSize: '2.6rem', // légèrement ↓
                fontWeight: 700,
                letterSpacing: '-0.03em',
                marginBottom: '1rem',
              }}
            >
              Mémoires de la Marine
            </h1>

            <p
              style={{
                fontSize: '1.1rem',
                lineHeight: '1.7',
                maxWidth: '780px',
                margin: '0 auto',
                color: '#334155',
              }}
            >
              Ce projet vise à recenser tous les lieux de mémoire de la Marine, de la Marine nationale en particulier et du monde maritime en général : tombes de marins célèbres, monuments, plaques commémoratives, musées, lieux de naufrage ou de débarquement, port ou bases navales principales. Et tout autres sites symboliques en lien avec la Marine...
            </p>

            <p
              style={{
                fontSize: '0.95rem',
                marginTop: '1.2rem',
                color: '#64748b',
              }}
            >
              Contribuez à enrichir cette mémoire collective en découvrant ou en ajoutant des lieux de mémoire.
            </p>
          </div>
        </header>

        {/* Appel à l’action */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '3.5rem', // ↓ remonté
          }}
        >
          <Link
            href="https://memoires-de-la-marine-i8gy.vercel.app/lieux/test-carte-leaflet"
            style={{
              padding: '1rem 2.6rem',
              backgroundColor: '#0f172a',
              color: '#ffffff',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.05rem',
              boxShadow: '0 10px 24px rgba(15, 23, 42, 0.25)',
            }}
          >
            Consulter les lieux de mémoire
          </Link>
        </div>

        {/* Section explicative */}
        <section
          style={{
            backgroundColor: '#f1f5f9',
            borderRadius: '20px',
            padding: '3rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
          }}
        >
          <h2
            style={{
              fontSize: '1.9rem',
              fontWeight: 600,
              marginBottom: '1.8rem',
            }}
          >
            À propos du projet
          </h2>

          <p style={{ lineHeight: '1.75', marginBottom: '1.2rem' }}>
            L’objectif est de créer une carte collaborative des lieux de mémoire maritime, avec fiches détaillées, photos, informations historiques et contribution des utilisateurs. Chaque lieu proposé sera validé par un administrateur pour garantir la qualité et la fiabilité des données..
          </p>

          <p style={{ lineHeight: '1.75', marginBottom: '1.2rem' }}>
            Les types de lieux recensés incluent : tombes, monuments, plaques, épaves, sites de bataille, lieux de débarquement et musées.
          </p>

          <p style={{ lineHeight: '1.75' }}>
            Issu d’une initiative personnelle, ce site évoluera progressivement tant dans son design que dans ses fonctionnalités.
          </p>
        </section>
      </div>
    </div>
  );
}
