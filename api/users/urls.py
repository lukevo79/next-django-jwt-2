"""
File: urls.py
Autore: Luca Volpi
Email: lvolpi@cvservicesconsulting.com
Data: 03/07/2025
Descrizione: File per le URL dell'applicazione users
"""

from django.urls import path    
from .views import LoginView, LogoutView, CookieTokenRefreshView

# Configurazione delle URL patterns per l'applicazione users
# Ogni path definisce un endpoint API con il relativo view associato
urlpatterns = [
    # Endpoint per l'autenticazione degli utenti
    # POST /api/users/login/ - Gestisce il login degli utenti
    # Restituisce un JWT token in caso di successo
    path('login/', LoginView.as_view(), name='login'),
    # Endpoint per il logout degli utenti
    # POST /api/users/logout/ - Gestisce il logout degli utenti
    # Elimina i cookie di accesso e refresh
    path('logout/', LogoutView.as_view(), name='logout'),
    # Endpoint per il rinnovo del token di accesso
    # POST /api/users/refresh-token/ - Rinnova il token di accesso
    # Restituisce un nuovo token di accesso
    path('refresh-token/', CookieTokenRefreshView.as_view(), name='refresh-token'),
]
