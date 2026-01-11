import Link from 'next/link';

export default function CompteActivePage() {
  return (
    <main
      style={{
        padding: '40px',
        textAlign: 'center',
        maxWidth: '600px',
        margin: '0 auto',
      }}
    >
      <h1>✅ Compte créé et activé</h1>

      <p style={{ marginTop: '20px' }}>
        Votre adresse email a été vérifiée avec succès.
      </p>

      <p>
        Vous pouvez maintenant vous connecter à votre compte.
      </p>

      <Link href="/login">
        <button
          style={{
            marginTop: '30px',
            padding: '12px 24px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          Se connecter
        </button>
      </Link>
    </main>
  );
}
