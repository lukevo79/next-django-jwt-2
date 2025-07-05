"""
URL configuration for core project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include

# Lista principale dei pattern URL del progetto
# Ogni elemento definisce un mapping tra un pattern URL e una vista
urlpatterns = [
    # Endpoint per l'interfaccia di amministrazione Django
    # Accessibile tramite /admin/ e gestisce tutte le operazioni CRUD
    # per i modelli registrati nel file admin.py
    path('admin/', admin.site.urls),
    
    # Include tutti gli URL dell'app 'users'
    # Tutti gli endpoint dell'app users saranno prefissati con /api/users/
    # Esempio: /api/users/login/, /api/users/register/, etc.
    path('api/users/', include('users.urls')),
]
