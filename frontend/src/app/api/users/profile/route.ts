/**
 * File: profile/route.ts
 * Autore: Luca Volpi
 * Email: lvolpi@cvservicesconsulting.com
 * Data: 10/07/2025
 * Descrizione: File per la gestione delle richieste del profilo utente
 * 
 * Questa API route è protetta dal middleware e richiede autenticazione.
 * Agisce come proxy tra il frontend e il backend Django.
 */

import { NextResponse } from "next/server";
import { apiUsers } from "@/lib/api";
import axios from "axios";

/**
 * Gestisce le richieste GET per ottenere il profilo dell'utente autenticato.
 * 
 * Questa funzione è protetta dal middleware di autenticazione.
 * Se l'utente non è autenticato, il middleware restituirà 401 prima
 * che questa funzione venga eseguita.
 * 
 * @param {Request} request - La richiesta HTTP in arrivo
 * @returns {Promise<NextResponse>} Risposta con i dati del profilo utente
 * 
 * @throws {Error} Quando la richiesta al backend fallisce
 * 
 * @example
 * // Richiesta autenticata
 * GET /api/users/profile
 * Cookie: access_token=...; refresh_token=...
 * 
 * // Risposta di successo
 * {
 *   "user": {
 *     "id": 1,
 *     "username": "user@example.com",
 *     "email": "user@example.com",
 *     "first_name": "Mario",
 *     "last_name": "Rossi"
 *   }
 * }
 */
export async function GET(request: Request) {
    try {
        /**
         * Invia la richiesta al backend Django per ottenere il profilo utente.
         * 
         * withCredentials: true è essenziale per inviare i cookie di autenticazione
         * al backend, che sono necessari per identificare l'utente autenticato.
         */
        const res = await axios.get(apiUsers.profile, {
            // Importante: imposta withCredentials per inviare i cookie
            withCredentials: true,
            headers: {
                // Invia esplicitamente i cookie della richiesta originale
                'Cookie': request.headers.get('cookie') || '',
            }
        });
        
        // Verifica lo stato della risposta
        if (res.status !== 200) {
            return NextResponse.json(
                { error: "Errore durante il recupero del profilo: stato " + res.status },
                { status: res.status }
            );
        }
        
        // Restituisci i dati del profilo utente
        return NextResponse.json(
            res.data,
            { status: 200 }
        );

    } catch (error: unknown) {
        /**
         * Gestisce gli errori durante il recupero del profilo.
         * 
         * Logga l'errore per il debugging e restituisce un messaggio
         * di errore appropriato.
         */
        console.error('Errore durante il recupero del profilo:', error);
        
        // Gestisci errori specifici di axios
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.error || error.message;
            
            return NextResponse.json(
                { error: `Errore durante il recupero del profilo: ${message}` },
                { status }
            );
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        return NextResponse.json(
            { error: "Errore durante il recupero del profilo: " + errorMessage },
            { status: 500 }
        );
    }
}

/**
 * Gestisce le richieste PUT per aggiornare il profilo dell'utente autenticato.
 * 
 * Questa funzione è protetta dal middleware di autenticazione.
 * Se l'utente non è autenticato, il middleware restituirà 401 prima
 * che questa funzione venga eseguita.
 * 
 * @param {Request} request - La richiesta HTTP in arrivo con i dati da aggiornare
 * @returns {Promise<NextResponse>} Risposta con i dati aggiornati del profilo
 * 
 * @throws {Error} Quando la richiesta al backend fallisce
 * 
 * @example
 * // Richiesta di aggiornamento
 * PUT /api/users/profile
 * Content-Type: application/json
 * {
 *   "first_name": "Mario",
 *   "last_name": "Rossi",
 *   "email": "nuovo@email.com"
 * }
 */
export async function PUT(request: Request) {
    try {
        // Parsa i dati della richiesta
        const updateData = await request.json();
        
        /**
         * Invia la richiesta di aggiornamento al backend Django.
         * 
         * withCredentials: true è essenziale per inviare i cookie di autenticazione
         * al backend, che sono necessari per identificare l'utente autenticato.
         */
        const res = await axios.put(apiUsers.profile, updateData, {
            // Importante: imposta withCredentials per inviare i cookie
            withCredentials: true,
            headers: {
                'Content-Type': 'application/json',
                // Invia esplicitamente i cookie della richiesta originale
                'Cookie': request.headers.get('cookie') || '',
            }
        });
        
        // Verifica lo stato della risposta
        if (res.status !== 200) {
            return NextResponse.json(
                { error: "Errore durante l'aggiornamento del profilo: stato " + res.status },
                { status: res.status }
            );
        }
        
        // Restituisci i dati aggiornati del profilo
        return NextResponse.json(
            res.data,
            { status: 200 }
        );

    } catch (error: unknown) {
        /**
         * Gestisce gli errori durante l'aggiornamento del profilo.
         * 
         * Logga l'errore per il debugging e restituisce un messaggio
         * di errore appropriato.
         */
        console.error('Errore durante l\'aggiornamento del profilo:', error);
        
        // Gestisci errori specifici di axios
        if (axios.isAxiosError(error)) {
            const status = error.response?.status || 500;
            const message = error.response?.data?.error || error.message;
            
            return NextResponse.json(
                { error: `Errore durante l'aggiornamento del profilo: ${message}` },
                { status }
            );
        }
        
        const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto';
        return NextResponse.json(
            { error: "Errore durante l'aggiornamento del profilo: " + errorMessage },
            { status: 500 }
        );
    }
} 