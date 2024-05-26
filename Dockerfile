FROM nginx:1.22.0-alpine

ARG API_URL=http://localhost:8080/vdt/

ENV API_URL=${API_URL}

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY . /usr/share/nginx/html

EXPOSE 5500

