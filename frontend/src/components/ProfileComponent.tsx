/**
 * File: ProfileComponent.tsx
 * Autore: Luca Volpi
 * Email: lvolpi@cvservicesconsulting.com
 * Data: 10/07/2025
 * Descrizione: Componente client per la gestione del profilo utente
 * 
 * Questo componente dimostra come utilizzare le API route protette
 * per interagire con il backend Django attraverso Next.js.
 */

'use client';

import { useState, useEffect } from 'react';

/**
 * Interfaccia per i dati del profilo utente
 */
interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
}



/**
 * Componente per la gestione del profilo utente
 * 
 * Questo componente dimostra come:
 * 1. Chiamare API route protette dal client
 * 2. Gestire l'autenticazione automatica
 * 3. Gestire errori di autenticazione
 * 4. Aggiornare i dati del profilo
 */
export default function ProfileComponent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<UserProfile>>({});

  /**
   * Carica il profilo utente dall'API
   */
  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users/profile', {
        method: 'GET',
        credentials: 'include', // Importante: include i cookie
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Non autorizzato. Effettua il login.');
          return;
        }
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const data: UserProfile = await response.json();
      
      if (data && data.id) {
        setProfile(data);
        setEditData(data);
      } else {
        setError('Dati profilo non validi');
      }
    } catch (err) {
      console.error('Errore nel caricamento del profilo:', err);
      setError('Errore nel caricamento del profilo');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aggiorna il profilo utente
   */
  const updateProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Importante: include i cookie
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError('Non autorizzato. Effettua il login.');
          return;
        }
        throw new Error(`Errore HTTP: ${response.status}`);
      }

      const data: UserProfile = await response.json();
      
      if (data && data.id) {
        setProfile(data);
        setEditData(data);
        setIsEditing(false);
      } else {
        setError('Errore nell\'aggiornamento del profilo');
      }
    } catch (err) {
      console.error('Errore nell\'aggiornamento del profilo:', err);
      setError('Errore nell\'aggiornamento del profilo');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Gestisce il cambio dei campi del form
   */
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Carica il profilo al mount del componente
  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-lg">Caricamento profilo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-lg font-semibold text-red-800 mb-2">Errore</h2>
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadProfile}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Riprova
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto p-6 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h2 className="text-lg font-semibold text-yellow-800 mb-2">Nessun profilo</h2>
        <p className="text-yellow-600">Nessun profilo utente trovato.</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Profilo Utente</h2>
      
      {!isEditing ? (
        // Vista del profilo
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID</label>
            <p className="mt-1 text-sm text-gray-900">{profile.id}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <p className="mt-1 text-sm text-gray-900">{profile.username}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-sm text-gray-900">{profile.email}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <p className="mt-1 text-sm text-gray-900">{profile.first_name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cognome</label>
            <p className="mt-1 text-sm text-gray-900">{profile.last_name}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Stato Account</label>
            <p className="mt-1 text-sm text-gray-900">
              {profile.is_active ? '✅ Attivo' : '❌ Inattivo'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Ruolo Staff</label>
            <p className="mt-1 text-sm text-gray-900">
              {profile.is_staff ? '✅ Staff' : '❌ Non Staff'}
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Superuser</label>
            <p className="mt-1 text-sm text-gray-900">
              {profile.is_superuser ? '✅ Superuser' : '❌ Non Superuser'}
            </p>
          </div>
          
          <button
            onClick={loadProfile}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Caricamento...' : 'Ricarica Profilo'}
          </button>
        </div>
      ) : (
        // Form di modifica
        <form onSubmit={(e) => { e.preventDefault(); updateProfile(); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              value={editData.username || ''}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={editData.email || ''}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              value={editData.first_name || ''}
              onChange={(e) => handleInputChange('first_name', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Cognome</label>
            <input
              type="text"
              value={editData.last_name || ''}
              onChange={(e) => handleInputChange('last_name', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex space-x-3">
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'Salvando...' : 'Salva'}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditData(profile);
              }}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              disabled={loading}
            >
              Annulla
            </button>
          </div>
        </form>
      )}
    </div>
  );
} 