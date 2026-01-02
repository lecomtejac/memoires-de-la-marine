'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

type AdminUser = {
  id: string
  email: string
  login: string
  role: string
  created_at: string
  last_sign_in_at: string | null
  confirmed_at: string | null
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // Récupérer tous les utilisateurs
  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) {
      setMessage('Erreur : ' + error.message)
    } else {
      setUsers(data)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Modifier login ou rôle
  const updateUser = async (id: string, field: 'login' | 'role', value: string) => {
    setMessage('')
    const { error } = await supabase
      .from('admin_users')
      .update({ [field]: value })
      .eq('id', id)
    if (error) setMessage('Erreur : ' + error.message)
    else fetchUsers()
  }

  // Supprimer un utilisateur
  const deleteUser = async (id: string) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    const { error } = await supabase.from('admin_users').delete().eq('id', id)
    if (error) setMessage('Erreur : ' + error.message)
    else fetchUsers()
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '1000px', margin: '2rem auto', padding: '1rem' }}>
      <h1>Gestion des utilisateurs</h1>
      {message && <p style={{ color: 'red' }}>{message}</p>}
      {loading ? (
        <p>Chargement...</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
          <thead>
            <tr>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Email</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Login</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Rôle</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Créé le</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Dernière connexion</th>
              <th style={{ border: '1px solid #ccc', padding: '0.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>{user.email}</td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                  <input
                    value={user.login || ''}
                    onChange={(e) => updateUser(user.id, 'login', e.target.value)}
                    style={{ width: '100%', padding: '0.3rem' }}
                  />
                </td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                  <select
                    value={user.role || 'user'}
                    onChange={(e) => updateUser(user.id, 'role', e.target.value)}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                  {new Date(user.created_at).toLocaleString()}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                  {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : '-'}
                </td>
                <td style={{ border: '1px solid #ccc', padding: '0.5rem' }}>
                  <button
                    onClick={() => deleteUser(user.id)}
                    style={{ backgroundColor: 'red', color: 'white', border: 'none', padding: '0.4rem 0.8rem', cursor: 'pointer' }}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
