'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '../../lib/supabaseClient'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [infoMessage, setInfoMessage] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setInfoMessage(null)
    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
    } else if (data.session) {
      router.push('/lieux/proposer')
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setErrorMessage('Veuillez entrer votre email pour réinitialiser le mot de passe.')
      return
    }

    setErrorMessage(null)
    setInfoMessage(null)
    setLoading(true)

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    setLoading(false)

    if (error) {
      setErrorMessage(error.message)
    } else {
      setInfoMessage('Un email de réinitialisation a été envoyé si l’adresse existe.')
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
      <Link
        href="/lieux/test-carte-leaflet"
        style={{
          display: 'inline-block',
          marginBottom: '1.5rem',
          textDecoration: 'none',
          color: '#0070f3',
          fontWeight: 'bold',
        }}
      >
        ⬅ Retour
      </Link>

      <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Se connecter</h1>

      <form
        onSubmit={handleLogin}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <input
          type="email"
          placeholder="Login : email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
          placeholder="Mot de passe"
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
          {loading ? 'Connexion en cours…' : 'Se connecter'}
        </button>
      </form>

      {/* Mot de passe oublié */}
      <div style={{ marginTop: '1rem', textAlign: 'right' }}>
        <button
          onClick={handleResetPassword}
          style={{
            background: 'none',
            border: 'none',
            color: '#0070f3',
            cursor: 'pointer',
            textDecoration: 'underline',
            fontSize: '0.9rem',
            padding: 0,
          }}
        >
          Mot de passe oublié ?
        </button>
      </div>

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

      {infoMessage && (
        <p
          style={{
            color: '#2ecc71',
            marginTop: '1rem',
            fontWeight: 'bold',
          }}
        >
          {infoMessage}
        </p>
      )}
    </div>
  )
}
