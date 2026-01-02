'use client'

import { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Création du compte en cours...')

    // 1️⃣ Créer l’utilisateur dans Supabase Auth
    const { data, error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setMessage('Erreur Auth : ' + error.message)
      return
    }

    if (data.user) {
      // 2️⃣ Ajouter login et rôle dans admin_users
      const { error: dbError } = await supabase
        .from('admin_users')
        .update({ login: login, role: 'user' })
        .eq('id', data.user.id)

      if (dbError) {
        setMessage('Compte créé dans Auth mais erreur admin_users : ' + dbError.message)
      } else {
        setMessage('Compte créé avec succès !')
        setEmail('')
        setPassword('')
        setLogin('')
      }
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Créer un compte</h1>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '2rem' }}>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
          style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '0.8rem', borderRadius: '5px', border: '1px solid #ccc' }}
        />
        <button
          type="submit"
          style={{
            padding: '0.8rem',
            backgroundColor: '#28a745',
            color: '#fff',
            fontWeight: 'bold',
            borderRadius: '5px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Créer un compte
        </button>
      </form>

      <p style={{ marginTop: '1rem', color: '#333', textAlign: 'center' }}>{message}</p>
    </div>
  )
}
