/**
 * File: dashboard/page.tsx
 * Autore: Luca Volpi
 * Email: lvolpi@cvservicesconsulting.com
 * Data: 10/07/2025
 * Descrizione: Pagina dashboard protetta
 * 
 * Questa pagina è protetta dal middleware di autenticazione.
 * Include il componente ProfileComponent per dimostrare l'utilizzo
 * delle API route protette.
 */

import ProfileComponent from '@/components/ProfileComponent';

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p className="mt-2 text-gray-600">
                        Benvenuto nella dashboard protetta. Questa pagina è accessibile solo agli utenti autenticati.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Sezione informazioni */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Informazioni
                        </h2>
                        <div className="space-y-3">
                            <div>
                                <h3 className="font-medium text-gray-700">Autenticazione</h3>
                                <p className="text-sm text-gray-600">
                                    ✅ Sei autenticato e puoi accedere alle API protette
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-700">Middleware</h3>
                                <p className="text-sm text-gray-600">
                                    ✅ Il middleware gestisce automaticamente l&apos;autenticazione
                                </p>
                            </div>
                            <div>
                                <h3 className="font-medium text-gray-700">API Route</h3>
                                <p className="text-sm text-gray-600">
                                    ✅ Le API route protette sono accessibili tramite Next.js
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Sezione test API */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">
                            Test API Route Protetta
                        </h2>
                        <p className="text-sm text-gray-600 mb-4">
                            Il componente qui sotto utilizza l&apos;API route protetta /api/users/profile
                            per caricare e modificare i dati del profilo utente.
                        </p>
                        <div className="text-xs text-gray-500 bg-gray-50 p-3 rounded">
                            <strong>Endpoint testato:</strong> GET /api/users/profile<br/>
                            <strong>Metodo:</strong> PUT /api/users/profile<br/>
                            <strong>Autenticazione:</strong> Gestita automaticamente dal middleware
                        </div>
                    </div>
                </div>
                
                {/* Componente profilo */}
                <div className="mt-8">
                    <ProfileComponent />
                </div>
            </div>
        </div>
    );
}