'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const accessToken = searchParams.get('access_token')

  const handleReset = async () => {
    if (!password) return

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password }, accessToken ? { accessToken } : undefined)
    setLoading(false)

    if (error) setMessage(`Erreur : ${error.message}`)
    else {
      setMessage('Mot de passe réinitialisé avec succès !')
      setTimeout(() => router.push('/login'), 2000)
    }
  }

  if (!accessToken) return <p>Lien invalide ou expiré.</p>

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', fontFamily: 'sans-serif' }}>
      <h1>Réinitialiser le mot de passe</h1>
      <input
        type="password"
        placeholder="Nouveau mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
      />
      <button
        onClick={handleReset}
        disabled={loading}
        style={{
          padding: '0.75rem',
          width: '100%',
          backgroundColor: '#0070f3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: loading ? 'not-allowed' : 'pointer',
        }}
      >
        {loading ? 'En cours…' : 'Réinitialiser le mot de passe'}
      </button>

      {message && <p style={{ marginTop: '1rem', color: '#2ecc71' }}>{message}</p>}
    </div>
  )
}
