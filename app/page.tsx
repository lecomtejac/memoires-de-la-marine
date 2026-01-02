'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [login, setLogin] = useState('')
  const [message, setMessage] = useState('')

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('Création du compte en cours...')

    // Création de l'utilisateur dans Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage('Erreur : ' + error.message)
      return
    }

    if (data.user) {
      // Optionnel : créer un profil dans la table "profiles" avec login
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([{ id: data.user.id, login }])

      if (profileError) {
        setMessage('Compte créé mais erreur profil : ' + profileError.message)
      } else {
        setMessage('Compte créé avec succès ! Vérifie la base Supabase.')
      }
    }
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
      <h1>Créer un compte</h1>
      <form onSubmit={handleSignup} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="text"
          placeholder="Login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" style={{ padding: '0.8rem', backgroundColor: '#28a745', color: '#fff', fontWeight: 'bold', borderRadius: '5px', border: 'none' }}>
          Créer un compte
        </button>
      </form>
      <p style={{ marginTop: '1rem', color: '#333' }}>{message}</p>
    </div>
  )
}
