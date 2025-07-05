"""
File: authentication.py
Autore: Luca Volpi
Email: lvolpi@cvservicesconsulting.com
Data: 03/07/2025
Descrizione: File per l'autenticazione dei token JWT nei cookie
"""

from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import AuthenticationFailed


class NDCookieJWTAuthentication(JWTAuthentication):
    """
    Classe per l'autenticazione JWT tramite cookie HTTP.
    
    Estende JWTAuthentication per gestire l'autenticazione utilizzando
    token JWT memorizzati nei cookie HTTP invece che negli header Authorization.
    Questa implementazione è utile per applicazioni web che necessitano
    di autenticazione persistente tramite cookie.
    
    Attributes:
        None
        
    Example:
        >>> authentication = NDCookieJWTAuthentication()
        >>> user, token = authentication.authenticate(request)
    """

    def authenticate(self, request):
        """
        Autentica un utente utilizzando il token JWT dal cookie.
        
        Recupera il token JWT dal cookie 'access_token' nella richiesta HTTP,
        valida il token e restituisce l'utente associato insieme al token validato.
        
        Args:
            request: L'oggetto HttpRequest contenente i cookie della richiesta.
            
        Returns:
            tuple: Una tupla (user, token) dove user è l'utente autenticato
                   e token è il token JWT validato.
                   
        Raises:
            AuthenticationFailed: Se il token non è valido o se si verifica
                                 un errore nel recupero dell'utente.
                                 
        Note:
            - Se non viene trovato alcun token nel cookie, restituisce None
            - Il token viene validato utilizzando il metodo della classe padre
            - L'utente viene recuperato dal token validato
        """
        # Recupera il token JWT dal cookie 'access_token'
        token = request.COOKIES.get('access_token')

        # Se non è presente alcun token, l'autenticazione fallisce
        if not token:
            return None
        
        try:
            # Valida il token JWT utilizzando il metodo della classe padre
            validated_token = self.get_validated_token(token)
        except AuthenticationFailed as e:
            # Solleva un'eccezione con messaggio personalizzato per token non validi
            raise AuthenticationFailed(f"Token non valido: {str(e)}")
        
        try:
            # Recupera l'utente dal token validato
            user = self.get_user(validated_token)
            return user, validated_token
        except AuthenticationFailed as e:
            # Solleva un'eccezione con messaggio personalizzato per errori di recupero utente
            raise AuthenticationFailed(f"Errore nel recupero dell'utente: {str(e)}")