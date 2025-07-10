/**
 * File: login/route.ts
 * Autore: Luca Volpi
 * Email: lvolpi@cvservicesconsulting.com
 * Data: 10/07/2025
 * Descrizione: File per la gestione delle richieste di login
 */

import { NextResponse } from "next/server";
import { apiUsers } from "@/lib/api";
import axios from "axios";

/**
 * Interfaccia per la richiesta di login.
 * 
 * @property {string} username - Nome utente per l'autenticazione
 * @property {string} password - Password per l'autenticazione
 */
export interface LoginRequest {
    username: string;
    password: string;
}

/**
 * Opzioni per la configurazione dei cookie.
 * 
 * @property {boolean} httpOnly - Se il cookie è accessibile solo via HTTP
 * @property {boolean} secure - Se il cookie deve essere inviato solo su HTTPS
 * @property {'lax' | 'strict' | 'none'} sameSite - Politica SameSite per il cookie
 * @property {number} maxAge - Durata massima del cookie in secondi
 * @property {string} path - Percorso per cui il cookie è valido
 */
interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    maxAge?: number;
    path?: string;
}

/**
 * Gestisce le richieste POST per l'autenticazione degli utenti.
 * 
 * Questa funzione processa le richieste di login supportando sia JSON che FormData.
 * Inoltra la richiesta al backend Django e gestisce la propagazione dei cookie
 * di autenticazione dal backend al browser del client.
 * 
 * @param {Request} request - La richiesta HTTP in arrivo
 * @returns {Promise<NextResponse>} Risposta con dati utente e cookie di sessione
 * 
 * @throws {Error} Quando la richiesta al backend fallisce
 * 
 * @example
 * // Richiesta JSON
 * POST /api/users/login
 * Content-Type: application/json
 * {
 *   "username": "user@example.com",
 *   "password": "password123"
 * }
 * 
 * @example
 * // Richiesta FormData
 * POST /api/users/login
 * Content-Type: application/x-www-form-urlencoded
 * username=user@example.com&password=password123
 */
export async function POST(request: Request) {
    let loginRequest: LoginRequest;

    // Controlla il Content-Type per determinare come parsare i dati
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
        // Parsa JSON
        const data = await request.json();
        loginRequest = {
            username: data.username,
            password: data.password
        };
    } else {
        // Parsa FormData
        const formData = await request.formData();
        loginRequest = {
            username: formData.get('username') as string,
            password: formData.get('password') as string
        };
    }

    // Verifica che i campi richiesti siano presenti
    if (!loginRequest.username || !loginRequest.password) {
        return NextResponse.json(
            { error: "Username e password sono richiesti" },
            { status: 400 }
        );
    }

    try {
        /**
         * Invia la richiesta di autenticazione al backend Django.
         * 
         * withCredentials: true è essenziale per ricevere i cookie di sessione
         * dal backend, che sono necessari per mantenere l'autenticazione.
         */
        const res = await axios.post(apiUsers.login, loginRequest, {
            // Importante: imposta withCredentials per ricevere i cookie
            withCredentials: true
        });
        
        // Verifica lo stato della risposta
        if (res.status !== 200) {
            return NextResponse.json(
                { error: "Errore durante l'autenticazione: stato " + res.status },
                { status: res.status }
            );
        }
        
        // Estrai solo i dati utente dalla risposta
        const { user } = res.data;
        
        // Crea la risposta con i dati utente
        const response = NextResponse.json(
            { user },
            { status: 200 }
        );
        
        /**
         * Propaga i cookie di autenticazione dal backend Django al browser.
         * 
         * Questo passaggio è cruciale per mantenere la sessione dell'utente
         * tra il frontend Next.js e il backend Django. I cookie contengono
         * i token JWT o altri identificatori di sessione necessari per
         * le richieste autenticate successive.
         */
        const setCookieHeaders = res.headers['set-cookie'] as string[];
        if (setCookieHeaders && Array.isArray(setCookieHeaders)) {
            setCookieHeaders.forEach(cookieHeader => {
                const [cookieNameValue, ...options] = cookieHeader.split(';');
                const [name, value] = cookieNameValue.split('=');
                const cookieOptions: CookieOptions = {};
                
                /**
                 * Parsa le opzioni del cookie dal header Set-Cookie.
                 * 
                 * Le opzioni supportate sono:
                 * - HttpOnly: Cookie accessibile solo via HTTP
                 * - Secure: Cookie inviato solo su HTTPS
                 * - SameSite: Politica di sicurezza per cross-site requests
                 * - Max-Age: Durata del cookie in secondi
                 * - Path: Percorso per cui il cookie è valido
                 */
                options.forEach((option: string) => {
                    const [key, val] = option.trim().split('=');
                    const lowerKey = key.toLowerCase();
                    if (lowerKey === 'httponly') {
                        cookieOptions.httpOnly = true;
                    } else if (lowerKey === 'secure') {
                        cookieOptions.secure = true;
                    } else if (lowerKey === 'samesite') {
                        cookieOptions.sameSite = val?.toLowerCase() as 'lax' | 'strict' | 'none' || 'lax';
                    } else if (lowerKey === 'max-age') {
                        cookieOptions.maxAge = parseInt(val);
                    } else if (lowerKey === 'path') {
                        cookieOptions.path = val;
                    }
                });
                response.cookies.set(name.trim(), value.trim(), cookieOptions);
            });
        }
        
        // Restituisci la risposta
        return response;

    } catch (error: unknown) {
        /**
         * Gestisce gli errori durante l'autenticazione.
         * 
         * Logga l'errore per il debugging e restituisce un messaggio
         * di errore generico per evitare di esporre informazioni sensibili.
         */
        console.error('Errore durante l\'autenticazione:', error);
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        return NextResponse.json(
            { error: "Errore durante l'autenticazione: " + errorMessage },
            { status: 500 }
        );
    }
}