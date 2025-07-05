"""
File: models.py
Autore: Luca Volpi
Email: lvolpi@cvservicesconsulting.com
Data: 30/06/2025
Descrizione: Modelli per l'applicazione users di Test JWT Authentication
"""

from django.contrib.auth.models import AbstractUser


class NDUser(AbstractUser):
    """Modello utente personalizzato che estende AbstractUser di Django.
    
    Questa classe rappresenta il modello utente principale dell'applicazione,
    ereditando tutte le funzionalità di autenticazione e autorizzazione
    fornite da Django's AbstractUser.
    
    Attributes:
        username: Nome utente univoco per l'autenticazione
        email: Indirizzo email dell'utente
        first_name: Nome dell'utente
        last_name: Cognome dell'utente
        is_active: Flag che indica se l'utente è attivo
        is_staff: Flag che indica se l'utente ha accesso all'admin
        is_superuser: Flag che indica se l'utente è un superuser
        date_joined: Data di registrazione dell'utente
        last_login: Data dell'ultimo accesso dell'utente
        
    Note:
        Questo modello può essere esteso in futuro per aggiungere campi
        personalizzati specifici per l'applicazione.
    """
    pass
