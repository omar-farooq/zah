FROM php:8.1-fpm-alpine AS zah_base

# Arguments
ARG user
ARG uid
ARG GID=33

# Install additional required PHP extensions for Laravel
RUN docker-php-ext-install bcmath pdo_mysql

# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Nginx
COPY --from=nginxinc/nginx-unprivileged:alpine-slim / /
COPY ./webserver/default.conf /etc/nginx/conf.d/default.conf
RUN adduser --disabled-password -G www-data www-data

# Compile assets for production use
FROM node:alpine AS assets
WORKDIR /app
COPY . .
RUN npm install && npm run build

# Production Build
FROM zah_base AS production
WORKDIR /var/www/html
COPY --from=assets --chown=www-data:www-data /app/ .
RUN composer install
RUN php artisan optimize:clear
USER www-data
CMD ["sh", "-c", "/usr/local/sbin/php-fpm -D && nginx -g 'daemon off;'"]

# For Development environments
FROM node:alpine AS development
COPY --from=zah_base / /
#RUN adduser --disabled-password -G www-data omar
USER www-data
CMD ["sh", "-c", "/usr/local/sbin/php-fpm -D && nginx -g 'daemon off;'"]
