"""
File: admin.py
Autore: Luca Volpi
Email: lvolpi@cvservicesconsulting.com
Data: 03/07/2025
Descrizione: Admin per i modelli dell'applicazione users
"""

from django.contrib import admin
from .models import NDUser

@admin.register(NDUser)
class NDUserAdmin(admin.ModelAdmin):
    """
    Configurazione dell'interfaccia di amministrazione per il modello NDUser.
    
    Questa classe definisce come il modello NDUser viene visualizzato e gestito
    nell'interfaccia di amministrazione di Django, includendo i campi da mostrare,
    i filtri disponibili e l'organizzazione dei campi nei form.
    
    Attributes:
        list_display (tuple): Campi da visualizzare nella lista degli utenti.
        search_fields (tuple): Campi utilizzabili per la ricerca degli utenti.
        list_filter (tuple): Filtri disponibili per la lista degli utenti.
        ordering (tuple): Ordinamento predefinito della lista utenti.
        fieldsets (tuple): Organizzazione dei campi nei form di creazione/modifica.
    """
    
    # Campi da visualizzare nella lista degli utenti
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    
    # Campi utilizzabili per la ricerca degli utenti
    search_fields = ('username', 'email', 'first_name', 'last_name')
    
    # Filtri disponibili per la lista degli utenti
    list_filter = ('is_staff', 'is_superuser', 'is_active')
    
    # Ordinamento predefinito della lista utenti
    ordering = ('username',)
    
    # Organizzazione dei campi nei form di creazione/modifica
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Personal info', {'fields': ('first_name', 'last_name', 'email')}),
    )
