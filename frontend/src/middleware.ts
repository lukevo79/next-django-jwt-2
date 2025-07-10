/**
 * File: middleware.ts
 * Autore: Luca Volpi
 * Email: lvolpi@cvservicesconsulting.com
 * Data: 10/07/2025
 * Descrizione: File per la gestione del middleware di autenticazione
 * 
 * Questo middleware gestisce l'autenticazione JWT per le route protette dell'applicazione.
 * Implementa un sistema di refresh automatico dei token scaduti e reindirizzamento
 * degli utenti non autenticati alla pagina di login.
 * 
 * GESTIONE ROUTE:
 * - Pagine protette: reindirizzamento al login se non autenticato
 * - API route protette: risposta 401 se non autenticato
 * - Route di autenticazione: sempre accessibili
 */

import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';
import { JWT_CONFIG, PROTECTED_PATHS } from './lib/config';

/**
 * Verifica se un token JWT è valido e non scaduto.
 * 
 * Questa funzione utilizza la libreria 'jose' per verificare la validità del token,
 * controllando sia la firma che la data di scadenza. Gestisce specificamente
 * gli errori di token scaduto per distinguerli da altri errori di validazione.
 * 
 * @param token - Il token JWT da verificare (stringa)
 * @returns Promise<{valid: boolean, expired: boolean}> - Oggetto contenente lo stato del token:
 *   - valid: true se il token è valido e non scaduto
 *   - expired: true se il token è scaduto, false altrimenti
 * 
 * @example
 * const result = await verifyJWTToken(token);
 * if (result.valid) {
 *   // Token valido, procedi
 * } else if (result.expired) {
 *   // Token scaduto, tenta refresh
 * }
 */
const verifyJWTToken = async (token: string): Promise<{valid: boolean, expired: boolean}> => {
  try {
    // Utilizza la chiave segreta dalla configurazione per verificare la firma
    const secret = new TextEncoder().encode(JWT_CONFIG.SECRET_KEY);
    
    // Verifica la firma e decodifica il payload del token
    const { payload } = await jwtVerify(token, secret);
    
    // Verifica che il payload contenga la data di scadenza (claim 'exp')
    if (!payload.exp) {
      return { valid: false, expired: false };
    }
    
    // Confronta la data di scadenza con il timestamp corrente
    const currentTime = Math.floor(Date.now() / 1000);
    const isExpired = payload.exp < currentTime;
    
    if (isExpired) {
      return { valid: false, expired: true };
    }
    
    return { valid: true, expired: false };
  } catch (error: unknown) {
    // Gestisci specificamente l'errore di token scaduto dalla libreria jose
    if (error && typeof error === 'object' && 'code' in error && error.code === 'ERR_JWT_EXPIRED') {
      return { valid: false, expired: true };
    }
    
    console.log('❌ Errore nella verifica del token:', error);
    return { valid: false, expired: false };
  }
};

/**
 * Tenta di fare refresh del token di accesso utilizzando il refresh token.
 * 
 * Questa funzione chiama l'API di refresh del frontend che gestisce automaticamente
 * i cookie di sessione. Il refresh token viene inviato tramite i cookie della richiesta.
 * 
 * @param request - La richiesta Next.js originale che contiene i cookie di sessione
 * @returns Promise<{success: boolean, newCookies?: string}> - Risultato del tentativo di refresh:
 *   - success: true se il refresh è riuscito
 *   - newCookies: stringa con i nuovi cookie se il refresh è riuscito
 * 
 * @example
 * const result = await attemptTokenRefresh(request);
 * if (result.success) {
 *   // Aggiorna i cookie con result.newCookies
 * }
 */
const attemptTokenRefresh = async (request: NextRequest): Promise<{success: boolean, newCookies?: string}> => {
  try {
    
    // Costruisci l'URL per l'API di refresh del frontend
    const refreshUrl = new URL('/api/users/refresh-token', request.url);
    
    // Chiama l'API di refresh del frontend (che gestirà i cookie)
    const refreshResponse = await fetch(refreshUrl.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Invia esplicitamente i cookie per includere il refresh_token
        'Cookie': request.headers.get('cookie') || '',
      },
      // Importante: includi i cookie per inviare il refresh_token
      credentials: 'include',
    });
    
    if (refreshResponse.ok) {
      
      // Ottieni i nuovi cookie dalla risposta dell'API
      const newCookies = refreshResponse.headers.get('set-cookie');
      return { success: true, newCookies: newCookies || undefined };
    } else {
      console.log('❌ Refresh del token fallito:', refreshResponse.status);
      const errorText = await refreshResponse.text();
      console.log('❌ Errore dettagliato:', errorText);
      return { success: false };
    }
  } catch (error) {
    console.log('❌ Errore durante il refresh del token:', error);
    return { success: false };
  }
};

/**
 * Verifica se l'utente è autenticato controllando il cookie access_token.
 * 
 * Questa funzione implementa la logica principale di autenticazione:
 * 1. Controlla la presenza del cookie access_token
 * 2. Verifica la validità del token
 * 3. Se il token è scaduto, tenta automaticamente il refresh
 * 4. Restituisce lo stato dell'autenticazione e i nuovi cookie se necessario
 * 
 * @param request - La richiesta Next.js che contiene i cookie di sessione
 * @returns Promise<{authenticated: boolean, needsRefresh?: boolean, newCookies?: string}> - Stato dell'autenticazione:
 *   - authenticated: true se l'utente è autenticato
 *   - needsRefresh: true se è stato necessario fare refresh del token
 *   - newCookies: stringa con i nuovi cookie se è stato fatto refresh
 * 
 * @example
 * const authResult = await isAuthenticated(request);
 * if (authResult.authenticated) {
 *   // Utente autenticato, procedi
 *   if (authResult.needsRefresh) {
 *     // Aggiorna i cookie con authResult.newCookies
 *   }
 * }
 */
const isAuthenticated = async (request: NextRequest): Promise<{authenticated: boolean, needsRefresh?: boolean, newCookies?: string}> => {
  // Estrai il token di accesso dai cookie
  const accessToken = request.cookies.get(JWT_CONFIG.COOKIE_NAMES.ACCESS_TOKEN);
  
  if (!accessToken) {
    console.log('❌ Nessun token di accesso trovato');
    return { authenticated: false };
  }
  
  // Verifica la validità del token
  const { valid, expired } = await verifyJWTToken(accessToken.value);
  
  if (valid) {
    return { authenticated: true };
  }
  
  // Se il token è scaduto, tenta il refresh automatico
  if (expired) {
    console.log('🔄 Token scaduto, tentativo di refresh...');
    const refreshResult = await attemptTokenRefresh(request);
    
    if (refreshResult.success) {
      return { 
        authenticated: true, 
        needsRefresh: true, 
        newCookies: refreshResult.newCookies 
      };
    }
  }
  
  return { authenticated: false };
};

/**
 * Middleware per gestire l'autenticazione delle route protette.
 * 
 * Questo middleware implementa un sistema completo di autenticazione JWT:
 * 
 * FLUSSO DI FUNZIONAMENTO:
 * 1. Controlla se il path richiesto è protetto (pagine o API route)
 * 2. Se il path non è protetto, permette l'accesso immediato
 * 3. Per i path protetti, verifica l'autenticazione dell'utente
 * 4. Se l'utente non è autenticato:
 *    - Per le pagine: reindirizza alla pagina di login
 *    - Per le API route: restituisce 401 Unauthorized
 * 5. Se il token è scaduto, tenta automaticamente il refresh
 * 6. Se il refresh riesce, aggiorna i cookie e permette l'accesso
 * 7. Se l'utente è autenticato, permette l'accesso alle pagine protette
 * 
 * GESTIONE ERRORI:
 * - Token mancante: reindirizzamento al login (pagine) o 401 (API)
 * - Token scaduto: tentativo di refresh automatico
 * - Refresh fallito: reindirizzamento al login (pagine) o 401 (API)
 * - Token invalido: reindirizzamento al login (pagine) o 401 (API)
 * 
 * @param request - La richiesta Next.js in arrivo
 * @returns NextResponse - Risposta con eventuali reindirizzamenti, cookie aggiornati o errori 401
 * 
 * @example
 * // Il middleware viene chiamato automaticamente da Next.js
 * // per ogni richiesta che corrisponde al matcher configurato
 */
export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  console.log(`🔍 Path corrente: ${path}`);

  // Controlla se è una pagina protetta
  const isProtectedPage = PROTECTED_PATHS.some(protectedPath => 
    path.startsWith(protectedPath)
  );

  // Se non è una pagina protetta, permette l'accesso
  if (!isProtectedPage) {
    console.log('✅ Path pubblico, accesso permesso');
    console.log('─'.repeat(50));
    return NextResponse.next();
  }

  console.log('🔒 Pagina protetta rilevata, verificando autenticazione...');

  // Verifica l'autenticazione dell'utente
  const authResult = await isAuthenticated(request);

  if (!authResult.authenticated) {
    console.log('❌ Utente non autenticato');
    // Per le pagine, reindirizza al login
    console.log('🔄 Reindirizzamento al login per pagina protetta');
    console.log('─'.repeat(50));
    const loginUrl = new URL('/', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Se il refresh è stato necessario, aggiorna i cookie nella risposta
  if (authResult.needsRefresh && authResult.newCookies) {
    // Crea la risposta normale per continuare la richiesta
    const response = NextResponse.next();
    // Imposta i nuovi cookie nella risposta per aggiornare la sessione
    response.headers.set('set-cookie', authResult.newCookies);
    console.log('✅ Cookie aggiornati, accesso permesso');
    console.log('─'.repeat(50));
    return response;
  }

  console.log('✅ Utente autenticato, accesso permesso');
  console.log('─'.repeat(50));
  return NextResponse.next();
}

/**
 * Configurazione del matcher per il middleware.
 * 
 * Definisce quali route devono essere processate dal middleware.
 * Include le API route per gestire l'autenticazione anche per le chiamate API.
 * 
 * PATTERN ESCLUSI:
 * - _next/static: file statici di Next.js
 * - _next/image: ottimizzazione immagini di Next.js
 * - favicon.ico: icona del browser
 * 
 * PATTERN INCLUSI:
 * - Tutte le pagine dell'applicazione
 * - Tutte le API route (incluse quelle protette)
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * 
     * Include tutte le pagine e tutte le API route per gestire l'autenticazione
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
