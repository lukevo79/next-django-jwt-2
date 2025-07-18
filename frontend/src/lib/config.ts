/**
 * File: config.ts
 * Autore: Luca Volpi
 * Email: lvolpi@cvservicesconsulting.com
 * Data: 06/07/2025
 * Descrizione: Configurazione centralizzata dell'applicazione
 * 
 * Questo modulo contiene tutte le costanti e le configurazioni
 * utilizzate nell'applicazione, incluse le chiavi per l'autenticazione JWT.
 */

/**
 * Configurazione per l'autenticazione JWT
 * 
 * Questa configurazione deve corrispondere esattamente a quella
 * utilizzata dal backend Django per la verifica dei token.
 */
export const JWT_CONFIG = {
  /**
   * Chiave segreta per la verifica dei token JWT
   * 
   * IMPORTANTE: Questa chiave deve corrispondere esattamente alla SECRET_KEY
   * configurata nel backend Django (api/core/settings.py)
   */
  SECRET_KEY: 'django-insecure-gwx*pdv@0**tidmzpe&hb%ik&vtaflmaihgsxqm9_ulgb+w3f4',
  
  /**
   * Nomi dei cookie utilizzati per l'autenticazione
   */
  COOKIE_NAMES: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
  } as const,
  
  /**
   * Durata del token di accesso (in secondi)
   * Deve corrispondere a SIMPLE_JWT.ACCESS_TOKEN_LIFETIME in Django
   */
  ACCESS_TOKEN_LIFETIME: 1 * 60, // 1 minuti
  
  /**
   * Durata del token di refresh (in secondi)
   * Deve corrispondere a SIMPLE_JWT.REFRESH_TOKEN_LIFETIME in Django
   */
  REFRESH_TOKEN_LIFETIME: 24 * 60 * 60, // 1 giorno
} as const;

/**
 * Configurazione per i percorsi protetti (pagine)
 * 
 * Questi percorsi richiedono autenticazione per essere accessibili
 */
export const PROTECTED_PATHS = [
  '/dashboard',
  '/profile', 
  '/admin',
] as const;

/**
 * Configurazione per i percorsi pubblici (pagine)
 * 
 * Questi percorsi sono sempre accessibili senza autenticazione
 */
export const PUBLIC_PATHS = [
  '/',
] as const;

/**
 * Configurazione per le API route protette
 * 
 * Queste API route richiedono autenticazione per essere accessibili.
 * Le route di autenticazione (/api/users/login e /api/users/refresh-token)
 * sono automaticamente escluse da questa lista.
 */
export const PROTECTED_API_ROUTES = [
  '/api/users/profile',
  '/api/users/settings',
  '/api/data',
  '/api/admin',
] as const;

/**
 * Configurazione per le API route pubbliche
 * 
 * Queste API route sono sempre accessibili senza autenticazione.
 * Include le route di autenticazione che devono essere sempre accessibili.
 */
export const PUBLIC_API_ROUTES = [
  '/api/users/login',
  '/api/users/refresh-token',
  '/api/health',
] as const; 