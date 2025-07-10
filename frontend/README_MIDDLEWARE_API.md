# Sistema di Autenticazione e API Route Protette

## Panoramica

Questo documento descrive il sistema di autenticazione JWT implementato nel frontend Next.js, che gestisce sia le pagine protette che le API route protette.

## Architettura

### Flusso di Autenticazione

1. **Middleware di Autenticazione**: Gestisce automaticamente l'autenticazione per tutte le route
2. **API Route Proxy**: Le API route di Next.js agiscono come proxy verso il backend Django
3. **Refresh Automatico**: Il sistema gestisce automaticamente il refresh dei token scaduti
4. **Gestione Cookie**: I cookie di sessione vengono propagati automaticamente

### Configurazione

#### Route Protette (Pagine)
```typescript
export const PROTECTED_PATHS = [
  '/dashboard',
  '/profile', 
  '/admin',
] as const;
```

#### API Route Protette
```typescript
export const PROTECTED_API_ROUTES = [
  '/api/users/profile',
  '/api/users/settings',
  '/api/data',
  '/api/admin',
] as const;
```

#### API Route Pubbliche
```typescript
export const PUBLIC_API_ROUTES = [
  '/api/users/login',
  '/api/users/refresh-token',
  '/api/health',
] as const;
```

## Funzionamento del Middleware

### Gestione Route

1. **Route Pubbliche**: Accesso immediato senza autenticazione
2. **Pagine Protette**: Reindirizzamento al login se non autenticato
3. **API Route Protette**: Risposta 401 se non autenticato
4. **API Route Pubbliche**: Accesso immediato (login, refresh-token)

### Logica di Autenticazione

```typescript
// Verifica token
const { valid, expired } = await verifyJWTToken(accessToken);

if (valid) {
  // Accesso permesso
} else if (expired) {
  // Tentativo di refresh automatico
  const refreshResult = await attemptTokenRefresh(request);
  if (refreshResult.success) {
    // Aggiorna cookie e permette accesso
  }
}
```

## Utilizzo delle API Route Protette

### Esempio: Componente Client

```typescript
// Chiamata API protetta dal client
const response = await fetch('/api/users/profile', {
  method: 'GET',
  credentials: 'include', // Importante: include i cookie
});

if (response.status === 401) {
  // Utente non autenticato
  // Il middleware gestisce automaticamente il reindirizzamento
}
```

### Esempio: API Route Protetta

```typescript
// /api/users/profile/route.ts
export async function GET(request: Request) {
  // Il middleware ha già verificato l'autenticazione
  // Se arriviamo qui, l'utente è autenticato
  
  const res = await axios.get(apiUsers.profile, {
    withCredentials: true,
    headers: {
      'Cookie': request.headers.get('cookie') || '',
    }
  });
  
  return NextResponse.json(res.data);
}
```

## Vantaggi del Sistema

### 1. Sicurezza
- Solo Next.js accede direttamente al backend Django
- I client non hanno mai accesso diretto al backend
- Gestione centralizzata dell'autenticazione

### 2. Semplicità
- I componenti client non devono gestire l'autenticazione
- Refresh automatico dei token
- Gestione automatica dei cookie

### 3. Flessibilità
- Facile aggiungere nuove API route protette
- Configurazione centralizzata delle route
- Supporto per diversi tipi di autenticazione

## Aggiungere Nuove API Route Protette

### 1. Aggiungere alla Configurazione

```typescript
// In config.ts
export const PROTECTED_API_ROUTES = [
  '/api/users/profile',
  '/api/users/settings',
  '/api/data',
  '/api/admin',
  '/api/users/new-endpoint', // Aggiungi qui
] as const;
```

### 2. Creare la Route

```typescript
// /api/users/new-endpoint/route.ts
export async function GET(request: Request) {
  // Il middleware gestisce l'autenticazione
  // Implementa la logica della tua API
}
```

### 3. Utilizzare dal Client

```typescript
const response = await fetch('/api/users/new-endpoint', {
  credentials: 'include',
});
```

## Gestione Errori

### Errori di Autenticazione

- **401 Unauthorized**: Utente non autenticato
- **Token Scaduto**: Refresh automatico gestito dal middleware
- **Token Invalido**: Reindirizzamento al login

### Logging

Il middleware fornisce log dettagliati per il debugging:

```
🔍 Path corrente: /api/users/profile
🔒 API route protetta rilevata, verificando autenticazione...
✅ Utente autenticato, accesso permesso
```

## Best Practices

### 1. Sempre Includere Credentials

```typescript
// ✅ Corretto
const response = await fetch('/api/users/profile', {
  credentials: 'include',
});

// ❌ Sbagliato
const response = await fetch('/api/users/profile');
```

### 2. Gestire Errori 401

```typescript
if (response.status === 401) {
  // L'utente non è autenticato
  // Il middleware gestirà il reindirizzamento
}
```

### 3. Utilizzare TypeScript

```typescript
interface ApiResponse<T> {
  user?: T;
  error?: string;
}

const data: ApiResponse<UserProfile> = await response.json();
```

## Troubleshooting

### Problema: 401 su API Route Pubblica

**Causa**: La route non è nella lista `PUBLIC_API_ROUTES`

**Soluzione**: Aggiungere la route alla configurazione

### Problema: Cookie non Inviati

**Causa**: Mancanza di `credentials: 'include'`

**Soluzione**: Aggiungere sempre `credentials: 'include'` nelle chiamate fetch

### Problema: Refresh Token Non Funziona

**Causa**: Cookie non propagati correttamente

**Soluzione**: Verificare che l'API route di refresh gestisca correttamente i cookie

## Conclusione

Questo sistema fornisce un'architettura robusta e sicura per l'autenticazione JWT, permettendo ai componenti client di utilizzare le API route protette senza preoccuparsi della gestione dell'autenticazione. Il middleware gestisce automaticamente tutti gli aspetti dell'autenticazione, rendendo lo sviluppo più semplice e sicuro. 