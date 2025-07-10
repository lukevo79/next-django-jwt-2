/**
 * File: interfaces.ts
 * Autore: Luca Volpi
 * Email: lvolpi@cvservicesconsulting.com
 * Data: 06/07/2025
 * Descrizione: Interfacce per l'applicazione
 * 
 * Questo modulo contiene le interfacce per l'applicazione
 */

/**
 * Interfaccia che rappresenta un utente del sistema.
 * 
 * Questa interfaccia definisce la struttura dei dati per un utente,
 * utilizzata per la gestione dell'autenticazione e del profilo utente.
 * Le proprietà sono allineate con il modello User di Django.
 */
export interface User {
    /** ID univoco dell'utente nel database. Opzionale per la creazione di nuovi utenti. */
    id?: number;
    
    /** Nome utente univoco utilizzato per l'accesso al sistema. */
    username: string;
    
    /** Indirizzo email dell'utente, utilizzato per comunicazioni e recupero password. */
    email: string;
    
    /** Nome di battesimo dell'utente. */
    first_name: string;
    
    /** Cognome dell'utente. */
    last_name: string;
    
    /** Indica se l'account utente è attivo e può accedere al sistema. */
    is_active: boolean;
    
    /** Indica se l'utente ha privilegi di staff (accesso all'admin). */
    is_staff: boolean;
    
    /** Indica se l'utente ha privilegi di superuser (accesso completo). */
    is_superuser: boolean;
}