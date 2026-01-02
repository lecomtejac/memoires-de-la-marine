'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import Link from 'next/link'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('') // nouveau champ pseudo
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      // 1️⃣ Création de l'utilisateur dans Supabase Auth
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      })

      if (authError) {
        setMessage('Erreur Auth : ' + authError.message)
        setLoading(false)
        return
      }

      const user = data.user
      if (!user) {
        setMessage("Utilisateur non créé.")
        setLoading(false)
        return
      }

      // 2️⃣ Création du profil dans public.profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,       // clé primaire liée à auth.users.id
          email: user.email,
          username: username || user.email.split('@')[0], // par défaut l'email avant @
        })

      if (profileError) {
        console.error('Erreur création profil :', profileError)
        setMessage("✅ Compte créé, mais erreur lors de la création du profil.")
        setLoading(false)
        return
      }

      // ✅ Succès complet
      setMessage('✅ Compte et profil créés avec succès !')
      setEmail('')
      setPassword('')
      setUsername('')
    } catch (err) {
      console.error(err)
      setMessage('Erreur inattendue lors de la création du compte.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '2rem',
        fontFamily: 'sans-serif',
      }}
    >
      {/* Retour */}
      <Link
        href="/lieux/proposer"
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

      <h1 style={{ marginBottom: '1rem' }}>Créer un compte</h1>

      <form
        onSubmit={handleSignup}
        style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <input
          type="text"
          placeholder="Nom d’utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="email"
          placeholder="Adresse email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '0.75rem',
            fontSize: '1rem',
            borderRadius: '8px',
            border: 'none',
            backgroundColor: '#28a745',
            color: '#fff',
            fontWeight: 'bold',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Création en cours...' : '✍️ Créer le compte'}
        </button>
      </form>

      {message && (
        <p
          style={{
            marginTop: '1.5rem',
            color: message.startsWith('✅') ? 'green' : 'red',
          }}
        >
          {message}
        </p>
      )}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  padding: '0.75rem',
  fontSize: '1rem',
  borderRadius: '8px',
  border: '1px solid #ccc',
}
