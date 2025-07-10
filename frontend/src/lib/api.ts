/**
 * File: api.ts
 * Autore: Luca Volpi
 * Email: lvolpi@cvservicesconsulting.com
 * Data: 06/07/2025
 * Descrizione: File per le API dell'applicazione
 * 
 * Questo modulo contiene le configurazioni degli endpoint API per l'autenticazione
 * e la gestione degli utenti. Fornisce URL centralizzati per tutte le operazioni
 * relative agli utenti nel sistema.
 */

/**
 * URL base dell'API
 * 
 * Definisce l'endpoint di base per tutte le chiamate API.
 * Attualmente configurato per puntare al server di sviluppo locale.
 * 
 * @type {string} L'URL base del server API
 */
// Per sviluppo locale dal browser, usa localhost
// Per container Docker, usa api:8000
const baseUrl = "http://api:8000"

/**
 * Oggetto contenente tutti gli endpoint API relativi agli utenti
 * 
 * Questo oggetto raggruppa tutti gli URL necessari per le operazioni
 * di autenticazione e gestione utenti, fornendo un'interfaccia centralizzata
 * per l'accesso alle API.
 * 
 * @type {Object} Oggetto con endpoint per operazioni utente
 */
export const apiUsers = {
    /**
     * Endpoint per il recupero dei dettagli dell'utente autenticato
     * 
     * GET: Recupera i dettagli dell'utente autenticato
     * 
     * @type {string} URL per il profilo utente
     */
    profile: `${baseUrl}/api/users/profile/`,
    /**
     * Endpoint per l'autenticazione dell'utente
     * 
     * POST: Invia credenziali (username/password) per ottenere token di accesso
     * 
     * @type {string} URL per il login utente
     */
    login: `${baseUrl}/api/users/login/`,
    
    /**
     * Endpoint per il refresh del token di accesso
     * 
     * POST: Utilizza il refresh token per ottenere un nuovo access token
     * quando quello corrente è scaduto
     * 
     * @type {string} URL per il refresh del token
     */
    refreshToken: `${baseUrl}/api/users/refresh-token/`,
    
    /**
     * Endpoint per il logout dell'utente
     * 
     * POST: Invalida il token corrente e termina la sessione utente
     * 
     * @type {string} URL per il logout utente
     */
    logout: `${baseUrl}/api/users/logout/`,
}