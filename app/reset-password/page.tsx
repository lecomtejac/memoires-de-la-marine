'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    if (!password || !confirmPassword) {
      setErrorMessage('Veuillez remplir tous les champs.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMessage('Les mots de passe ne correspondent pas.')
      return
    }

    setLoading(true)

    // Mise à jour du mot de passe : Supabase gère le token automatiquement via l'URL
    const { error } = await supabase.auth.updateUser({
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
    } else {
      setSuccessMessage('Votre mot de passe a été réinitialisé avec succès !')
      // Redirection vers la page de login après 3 secondes
      setTimeout(() => {
        router.push('/login')
      }, 3000)
    }
  }

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        maxWidth: '500px',
        margin: '0 auto',
        padding: '2rem',
      }}
    >
      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
        Réinitialiser le mot de passe
      </h1>

      <form
        onSubmit={handleReset}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
        />

        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={{
            padding: '0.5rem',
            fontSize: '1rem',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
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
          {loading ? 'Réinitialisation en cours…' : 'Réinitialiser le mot de passe'}
        </button>
      </form>

      {errorMessage && (
        <p
          style={{
            color: '#d63333',
            marginTop: '1rem',
            fontWeight: 'bold',
          }}
        >
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p
          style={{
            color: '#2ecc71',
            marginTop: '1rem',
            fontWeight: 'bold',
          }}
        >
          {successMessage}
        </p>
      )}
    </div>
  )
}
