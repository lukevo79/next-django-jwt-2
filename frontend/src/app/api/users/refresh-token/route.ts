/**
 * File: refresh-token/route.ts
 * Autore: Luca Volpi
 * Email: lvolpi@cvservicesconsulting.com
 * Data: 10/07/2025
 * Descrizione: File per la gestione delle richieste di refresh del token
 */

import { NextResponse } from "next/server";
import { apiUsers } from "@/lib/api";
import axios from "axios";

/**
 * Opzioni per la configurazione dei cookie HTTP.
 * 
 * @interface CookieOptions
 * @property {boolean} [httpOnly] - Se il cookie deve essere accessibile solo via HTTP
 * @property {boolean} [secure] - Se il cookie deve essere inviato solo su HTTPS
 * @property {'lax' | 'strict' | 'none'} [sameSite] - Politica SameSite per il cookie
 * @property {number} [maxAge] - Durata massima del cookie in secondi
 * @property {string} [path] - Percorso per cui il cookie è valido
 */
interface CookieOptions {
    httpOnly?: boolean;
    secure?: boolean;
    sameSite?: 'lax' | 'strict' | 'none';
    maxAge?: number;
    path?: string;
}

/**
 * Gestisce la richiesta di refresh del token JWT.
 * 
 * Questa funzione agisce come proxy tra il frontend Next.js e il backend Django.
 * Riceve una richiesta POST dal client, la inoltra al backend Django con i cookie
 * di autenticazione, e restituisce la risposta con i nuovi cookie di sessione.
 * 
 * @param {Request} request - La richiesta HTTP originale dal client
 * @returns {Promise<NextResponse>} Risposta con i nuovi cookie di autenticazione
 * 
 * @throws {Error} Se la comunicazione con il backend fallisce
 * @throws {Error} Se il parsing dei cookie di risposta fallisce
 */
export async function POST(request: Request) {
    try {
        // Chiama l'API di refresh di Django
        const res = await axios.post(apiUsers.refreshToken, {}, {
            // Importante: imposta withCredentials per inviare e ricevere i cookie
            withCredentials: true,
            headers: {
                // Invia esplicitamente i cookie della richiesta originale
                'Cookie': request.headers.get('cookie') || '',
            }
        });
        
        // Verifica lo stato della risposta
        if (res.status !== 200) {
            return NextResponse.json(
                { error: "Errore durante il refresh del token: stato " + res.status },
                { status: res.status }
            );
        }
        
        // Crea la risposta di successo
        const response = NextResponse.json(
            { message: "Token rinnovato con successo" },
            { status: 200 }
        );
        
        // Inoltra i cookie dal backend Django al browser
        const setCookieHeaders = res.headers['set-cookie'] as string[];
        if (setCookieHeaders && Array.isArray(setCookieHeaders)) {
            setCookieHeaders.forEach(cookieHeader => {
                // Parsing del cookie header: "name=value; option1=value1; option2"
                const [cookieNameValue, ...options] = cookieHeader.split(';');
                const [name, value] = cookieNameValue.split('=');
                
                // Costruisce l'oggetto delle opzioni del cookie
                const cookieOptions: CookieOptions = {};
                options.forEach((option: string) => {
                    const [key, val] = option.trim().split('=');
                    const lowerKey = key.toLowerCase();
                    
                    // Mappa le opzioni del cookie dal formato HTTP al formato Next.js
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
                
                // Imposta il cookie nella risposta Next.js
                response.cookies.set(name.trim(), value.trim(), cookieOptions);
            });
        }
        
        // Restituisci la risposta
        return response;

    } catch (error: unknown) {
        // Gestione degli errori con logging appropriato
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        return NextResponse.json(
            { error: "Errore durante il refresh del token: " + errorMessage },
            { status: 500 }
        );
    }
} 