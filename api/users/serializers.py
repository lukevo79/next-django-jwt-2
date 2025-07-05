"""
File: serializers.py
Autore: Luca Volpi
Email: lvolpi@cvservicesconsulting.com
Data: 03/07/2025
Descrizione: Serializer per i modelli dell'applicazione users
"""

from typing import Any, Dict, Optional
from rest_framework import serializers
from .models import NDUser


class AuthenticationError(Exception):
    """Eccezione personalizzata per errori di autenticazione."""
    
    def __init__(self, message: str) -> None:
        self.message = message
        super().__init__(self.message)


class NDUserSerializer(serializers.ModelSerializer):
    """
    Serializer per la gestione degli utenti.
    
    Questo serializer gestisce la serializzazione e deserializzazione
    dei dati utente, fornendo un'interfaccia sicura per la gestione
    delle informazioni degli utenti.
    
    Attributes:
        id (int): ID dell'utente
        username (str): Nome utente dell'utente
        email (str): Indirizzo email dell'utente
        first_name (str): Nome dell'utente
        last_name (str): Cognome dell'utente
        is_active (bool): Flag che indica se l'utente è attivo
        is_staff (bool): Flag che indica se l'utente è staff
        is_superuser (bool): Flag che indica se l'utente è superuser
    """
    
    class Meta:
        model = NDUser
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'is_active', 'is_staff', 'is_superuser'
        ]
        read_only_fields = ['id']


class LoginNDUserSerializer(serializers.Serializer):
    """
    Serializer per la validazione delle credenziali di login.
    
    Questo serializer gestisce la validazione dei dati di login dell'utente,
    verificando che le credenziali siano corrette e che l'utente sia attivo.
    Implementa una validazione robusta con gestione degli errori personalizzata.
    
    Attributes:
        username (str): Nome utente per l'autenticazione
        password (str): Password dell'utente (write_only per sicurezza)
    """
    
    username = serializers.CharField(
        max_length=150,
        help_text="Nome utente per l'autenticazione"
    )
    password = serializers.CharField(
        write_only=True,
        help_text="Password dell'utente"
    )

    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Valida le credenziali di login dell'utente.
        
        Questo metodo verifica che:
        1. Username e password siano forniti
        2. L'utente esista nel database
        3. La password sia corretta
        4. L'utente sia attivo
        
        Args:
            data: Dizionario contenente username e password
            
        Returns:
            I dati validati con l'utente aggiunto se la validazione ha successo
            
        Raises:
            serializers.ValidationError: Se le credenziali sono invalide o mancanti,
                o se l'utente è disattivato
        """
        username: str = data.get('username', '')
        password: str = data.get('password', '')

        if not username or not password:
            raise serializers.ValidationError(
                'Username e password sono richiesti.'
            )

        user: Optional[NDUser] = self._get_user_by_username(username)
        
        if not user:
            raise serializers.ValidationError('Credenziali non valide.')
        
        if not user.check_password(password):
            raise serializers.ValidationError('Credenziali non valide.')
        
        if not user.is_active:
            raise serializers.ValidationError('Utente disattivato.')
        
        # Aggiungi l'utente ai dati validati
        data['user'] = user
        return data

    def _get_user_by_username(self, username: str) -> Optional[NDUser]:
        """
        Recupera un utente dal database tramite username.
        
        Args:
            username: Nome utente da cercare
            
        Returns:
            L'utente se trovato, None altrimenti
        """
        try:
            return NDUser.objects.filter(username=username).first()
        except Exception as e:
            # Log dell'errore per debugging
            print(f"Errore nel recupero utente: {e}")
            return None

        

