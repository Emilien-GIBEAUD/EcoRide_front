# A utiliser en prod uniquement
# Pour le dev, utiliser le compose.yaml
FROM nginx:1.29.0-alpine3.22

# Copie des fichiers dans le répertoire nginx
COPY . /usr/share/nginx/html

# Copie de la configuration nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port exposé
EXPOSE 80