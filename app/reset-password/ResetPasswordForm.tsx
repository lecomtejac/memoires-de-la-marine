'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  // 🔹 Récupération du token depuis l'URL
  const token = searchParams.get('access_token')

  useEffect(() => {
    if (!token) {
      setError('Lien invalide ou expiré.')
    }
  }, [token])

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    if (!password || !confirmPassword) {
      setError('Veuillez remplir tous les champs.')
      return
    }

    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    // 🔹 Mise à jour du mot de passe côté Supabase
    const { error } = await supabase.auth.updateUser({ password })

    setLoading(false)

    if (error) {
      setError(`Erreur : ${error.message}`)
    } else {
      setMessage('Mot de passe mis à jour avec succès !')
      setPassword('')
      setConfirmPassword('')
    }
  }

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', fontFamily: 'sans-serif', padding: '0 1rem' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Réinitialiser le mot de passe</h1>

      {error && <p style={{ color: '#d63333', fontWeight: 'bold' }}>{error}</p>}
      {message && (
        <>
          <p style={{ color: 'green', fontWeight: 'bold' }}>{message}</p>
          <button
            onClick={() => router.push('/login')}
            style={{
              marginTop: '1rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#0070f3',
              color: '#fff',
              fontWeight: 'bold',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
            }}
          >
            Se connecter maintenant
          </button>
        </>
      )}

      {!error && !message && (
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
  )
}
