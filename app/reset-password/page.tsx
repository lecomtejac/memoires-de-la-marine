'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // 🔹 On récupère le token depuis l'URL
  const token = searchParams.get('access_token');

  useEffect(() => {
    if (!token) {
      setError('Lien invalide ou expiré.');
    }
  }, [token]);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }

    setLoading(true);

    // 🔹 Supabase updateUser avec le token depuis l'URL
    const { error } = await supabase.auth.updateUser({
      password,
      // Si tu veux rediriger après la mise à jour :
      // emailRedirectTo: 'https://memoires-de-la-marine-i8gy.vercel.app/login'
    }, token ? { accessToken: token } : undefined);

    setLoading(false);

    if (error) {
      setError(`Erreur : ${error.message}`);
    } else {
      setMessage('Mot de passe mis à jour avec succès ! Vous pouvez maintenant vous connecter.');
      setPassword('');
      setConfirmPassword('');
      // Optionnel : redirection automatique après 3s
      setTimeout(() => router.push('/login'), 3000);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Réinitialiser le mot de passe</h1>

      {error && <p style={{ color: '#d63333', fontWeight: 'bold' }}>{error}</p>}
      {message && <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>}

      {!error && (
        <form onSubmit={handleReset} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input
            type="password"
            placeholder="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '1rem',
              backgroundColor: '#0070f3',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'En cours…' : 'Réinitialiser le mot de passe'}
          </button>
        </form>
      )}
    </div>
  );
}
