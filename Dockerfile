# FROM nginx:1.22.0-alpine

# COPY nginx.conf /etc/nginx/conf.d/default.conf

# COPY . /usr/share/nginx/html

# EXPOSE 5500

FROM nginx:1.22.0-alpine

COPY nginx.conf /etc/nginx/nginx.conf

COPY . /usr/share/nginx/html

EXPOSE 5500

CMD ["nginx", "-g", "daemon off;"

