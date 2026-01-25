'use client';

import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
        background: 'linear-gradient(180deg, #f6f9fc 0%, #ffffff 100%)',
        padding: '1.5rem 1rem 4rem',
      }}
    >
      <div
        style={{
          maxWidth: '960px',
          margin: '0 auto',
        }}
      >
        {/* Bannière "en construction" */}
        <div
          style={{
            backgroundColor: '#ffe08a',
            color: '#1a1a1a',
            padding: '0.6rem 1rem',
            textAlign: 'center',
            fontWeight: '600',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}
        >
          ⚠️ Site en cours de développement ⚠️
        </div>

        {/* Carte principale */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            padding: '2rem 1.5rem 2.5rem',
            boxShadow: '0 20px 40px rgba(0, 40, 80, 0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Illustration maritime très légère */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'radial-gradient(circle at top right, rgba(0,112,243,0.06), transparent 60%)',
              pointerEvents: 'none',
            }}
          />

          {/* Entête */}
          <header
            style={{
              position: 'relative',
              textAlign: 'center',
              marginBottom: '2rem',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2rem, 4.5vw, 2.6rem)',
                marginBottom: '1rem',
                color: '#0b1f33',
                letterSpacing: '0.5px',
              }}
            >
              Mémoires de la Marine
            </h1>

            <p
              style={{
                fontSize: '1.05rem',
                maxWidth: '760px',
                margin: '0 auto 1rem',
                color: '#1f2933',
              }}
            >
              Ce projet vise à recenser tous les lieux de mémoire de la Marine, de la Marine nationale en particulier et du monde maritime en général : tombes de marins célèbres, monuments, plaques commémoratives, musées, lieux de naufrage ou de débarquement, port ou bases navales principales. Et tout autres sites symboliques en lien avec la Marine...
            </p>

            <p
              style={{
                fontSize: '0.95rem',
                color: '#4b5563',
                maxWidth: '720px',
                margin: '0 auto',
              }}
            >
              Contribuez à enrichir cette mémoire collective en découvrant ou en ajoutant des lieux de mémoire.
            </p>
          </header>

          {/* Bouton */}
          <div
            style={{
              textAlign: 'center',
              marginBottom: '2.5rem',
            }}
          >
            <Link
              href="https://memoires-de-la-marine-i8gy.vercel.app/lieux/test-carte-leaflet"
              style={{
                display: 'inline-block',
                padding: '1rem 2.2rem',
                background:
                  'linear-gradient(135deg, #003a8f, #005fcc)',
                color: '#ffffff',
                borderRadius: '999px',
                textDecoration: 'none',
                fontWeight: '600',
                fontSize: '1.05rem',
                boxShadow: '0 12px 24px rgba(0, 64, 128, 0.35)',
              }}
            >
              Consulter les lieux de mémoire
            </Link>
          </div>

          {/* Section explicative */}
          <section
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              lineHeight: '1.7',
              color: '#1f2933',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                marginBottom: '1.2rem',
                textAlign: 'center',
                color: '#0b1f33',
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
      </div>
    </div>
  );
}
