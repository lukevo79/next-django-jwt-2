'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(event.currentTarget);
        const username = formData.get('username') as string;
        const password = formData.get('password') as string;

        try {
            const response = await fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Login riuscito, reindirizza alla dashboard
                router.push('/dashboard');
            } else {
                // Login fallito, mostra errore
                setError(data.error || 'Errore durante il login');
            }
        } catch (error) {
            console.error('Errore durante il login:', error);
            setError('Errore di connessione. Riprova.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen w-full">
            <div className="flex flex-col items-center justify-center w-[300px] bg-slate-200 rounded-md p-4 font-[family-name:var(--font-geist-sans)]">
                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-2 w-full">
                        <input 
                            type="text" 
                            name="username"
                            placeholder="Username" 
                            className="w-full px-1 h-8 rounded-md border border-slate-600 text-sm text-slate-600 outline-0 bg-slate-100" 
                            required
                            disabled={isLoading}
                        />
                        <input 
                            type="password" 
                            name="password"
                            placeholder="Password" 
                            className="w-full px-1 h-8 rounded-md border border-slate-600 text-sm text-slate-600 outline-0 bg-slate-100" 
                            required
                            disabled={isLoading}
                        />
                    </div>
                    {error && (
                        <div className="text-red-600 text-sm text-center">
                            {error}
                        </div>
                    )}
                    <button 
                        type="submit" 
                        className="w-full px-1 h-8 rounded-md border border-slate-600 text-sm text-slate-100 outline-0 bg-slate-600 hover:bg-slate-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Accesso in corso...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
}