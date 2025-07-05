# Base image
FROM node:24-slim

# Installa le dipendenze di sistema necessarie
RUN apt-get update && apt-get install -y \
    libc6 \
    && rm -rf /var/lib/apt/lists/*

# Imposta la directory di lavoro
WORKDIR /usr/src/app

# Copia i file di configurazione
COPY package*.json ./

# Installa le dipendenze
RUN npm install

# Espone la porta 3000
EXPOSE 3000

# Comando per avviare l'applicazione in modalità sviluppo
CMD ["npm", "run", "dev"] 