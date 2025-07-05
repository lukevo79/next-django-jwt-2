"""
File: views.py
Autore: Luca Volpi
Email: lvolpi@cvservicesconsulting.com
Data: 03/07/2025
Descrizione: File per le viste dell'applicazione users
"""

from typing import Optional
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.request import Request
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from .serializers import LoginNDUserSerializer, NDUserSerializer


# Costanti per messaggi di errore e successo
ERROR_MESSAGES = {
    "INVALID_CREDENTIALS": "Credenziali non valide",
    "REFRESH_TOKEN_NOT_FOUND": "Nessun token di refresh trovato",
    "INVALID_REFRESH_TOKEN": "Token di refresh non valido",
    "TOKEN_REFRESH_ERROR": "Errore nel rinnovare il token",
    "TOKEN_BLACKLIST_ERROR": "Errore nell'invalidazione del token",
}

SUCCESS_MESSAGES = {
    "LOGIN_SUCCESS": "Login effettuato con successo",
    "LOGOUT_SUCCESS": "Logout effettuato con successo",
    "TOKEN_REFRESH_SUCCESS": "Token rinnovato con successo",
}

# Costanti per i cookie
COOKIE_NAMES = {
    "ACCESS_TOKEN": "access_token",
    "REFRESH_TOKEN": "refresh_token",
}

COOKIE_SETTINGS = {
    "httponly": True,
    "secure": True,
    "samesite": "None",
}


class LoginView(APIView):
    """
    Vista per gestire l'autenticazione degli utenti.
    
    Accetta credenziali utente e restituisce token JWT in cookie httpOnly.
    """
    
    def post(self, request: Request) -> Response:
        """
        Gestisce la richiesta di login.
        
        Args:
            request: Richiesta HTTP contenente le credenziali utente
            
        Returns:
            Response con dati utente e cookie JWT impostati
        """
        serializer = LoginNDUserSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors, 
                status=status.HTTP_400_BAD_REQUEST
            )

        user = serializer.validated_data['user']
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        
        response = Response(
            {"user": NDUserSerializer(user).data},
            status=status.HTTP_200_OK
        )
        
        self._set_auth_cookies(response, access_token, str(refresh))
        return response
    
    def _set_auth_cookies(
        self, 
        response: Response, 
        access_token: str, 
        refresh_token: str
    ) -> None:
        """
        Imposta i cookie di autenticazione nella risposta.
        
        Args:
            response: Oggetto Response dove impostare i cookie
            access_token: Token di accesso JWT
            refresh_token: Token di refresh JWT
        """
        response.set_cookie(
            key=COOKIE_NAMES["ACCESS_TOKEN"],
            value=access_token,
            **COOKIE_SETTINGS
        )
        response.set_cookie(
            key=COOKIE_NAMES["REFRESH_TOKEN"],
            value=refresh_token,
            **COOKIE_SETTINGS
        )


class LogoutView(APIView):
    """
    Vista per gestire il logout degli utenti.
    
    Invalida il token di refresh e rimuove i cookie di autenticazione.
    """
    
    def post(self, request: Request) -> Response:
        """
        Gestisce la richiesta di logout.
        
        Args:
            request: Richiesta HTTP contenente il token di refresh
            
        Returns:
            Response di conferma logout con cookie rimossi
        """
        refresh_token: Optional[str] = request.COOKIES.get(COOKIE_NAMES["REFRESH_TOKEN"])
        
        if not refresh_token:
            return Response(
                {"error": ERROR_MESSAGES["REFRESH_TOKEN_NOT_FOUND"]},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            refresh.blacklist()
        except Exception as e:
            return Response(
                {
                    "error": f"{ERROR_MESSAGES['TOKEN_BLACKLIST_ERROR']}: {str(e)}"
                },
                status=status.HTTP_400_BAD_REQUEST
            )
        
        response = Response(
            {"message": SUCCESS_MESSAGES["LOGOUT_SUCCESS"]},
            status=status.HTTP_200_OK
        )
        self._clear_auth_cookies(response)
        return response
    
    def _clear_auth_cookies(self, response: Response) -> None:
        """
        Rimuove i cookie di autenticazione dalla risposta.
        
        Args:
            response: Oggetto Response da cui rimuovere i cookie
        """
        response.delete_cookie(COOKIE_NAMES["ACCESS_TOKEN"])
        response.delete_cookie(COOKIE_NAMES["REFRESH_TOKEN"])


class CookieTokenRefreshView(TokenRefreshView):
    """
    Vista per rinnovare i token JWT tramite cookie.
    
    Estende TokenRefreshView per gestire token da cookie invece che dal body.
    """
    
    def post(self, request: Request) -> Response:
        """
        Gestisce il rinnovo del token di accesso.
        
        Args:
            request: Richiesta HTTP contenente il token di refresh nei cookie
            
        Returns:
            Response con nuovo token di accesso impostato nei cookie
        """
        refresh_token: Optional[str] = request.COOKIES.get(COOKIE_NAMES["REFRESH_TOKEN"])

        if not refresh_token:
            return Response(
                {"error": ERROR_MESSAGES["REFRESH_TOKEN_NOT_FOUND"]},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        try:
            refresh = RefreshToken(refresh_token)
            access_token = str(refresh.access_token)
            
            response = Response(
                {"message": SUCCESS_MESSAGES["TOKEN_REFRESH_SUCCESS"]},
                status=status.HTTP_200_OK
            )
            
            response.set_cookie(
                key=COOKIE_NAMES["ACCESS_TOKEN"],
                value=access_token,
                **COOKIE_SETTINGS
            )
            return response
            
        except InvalidToken:
            return Response(
                {"error": ERROR_MESSAGES["INVALID_REFRESH_TOKEN"]},
                status=status.HTTP_401_UNAUTHORIZED
            )
        except Exception as e:
            return Response(
                {
                    "error": f"{ERROR_MESSAGES['TOKEN_REFRESH_ERROR']}: {str(e)}"
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )