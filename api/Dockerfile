###############################################################################
# Dockerfile
# 27/06/2025 - Luca Volpi - lvolpi@cvservicesconsulting.com
#
# Docker file per immagine di base di Python 3 Backend Django
###############################################################################

# Utilizziamo l'immagine base di Python 3
FROM python:3

# Impostiamo le etichette dell'immagine
LABEL maintainer="Luca Volpi <lvolpi@cvservicesconsulting.com>"
LABEL version="1.0"
LABEL description="Python 3 Backend Django Image"
LABEL name="django-backend"

# Impostiamo la directory di lavoro all'interno del container
WORKDIR /usr/src/app

# Copiamo il file requirements.txt nella directory di lavoro
COPY requirements.txt ./

# Aggiorniamo pip e setuptools
RUN pip install --upgrade pip
RUN pip install --upgrade setuptools

# Installiamo le dipendenze Python specificate in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copiamo il resto dei file del progetto nella directory di lavoro
# ad esclusione del Dockerfile stesso
COPY . .
COPY Dockerfile /dev/null