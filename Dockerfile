FROM php:8.2-fpm-alpine AS zah_base

# Arguments
ARG user
ARG uid
ARG GID=33

# Install additional required PHP extensions for Laravel
RUN docker-php-ext-install bcmath pdo_mysql pcntl opcache

# Change upload size
RUN cp /usr/local/etc/php/php.ini-production /usr/local/etc/php/php.ini && \
    sed -i -e "s/upload_max_filesize = 2M/upload_max_filesize = 20M/g" /usr/local/etc/php/php.ini && \
    sed -i -e "s/allow_url_fopen = On/allow_url_fopen = Off/g" /usr/local/etc/php/php.ini && \
    sed -i -e "s/expose_php = On/expose_php = Off/g" /usr/local/etc/php/php.ini


# Install composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Install Nginx
FROM zah_base as webserver
COPY --from=nginxinc/nginx-unprivileged:alpine-slim / /
COPY ./webserver/default.conf /etc/nginx/conf.d/default.conf
RUN sed -i '/http {/a \ \ \ client_max_body_size 50M;' /etc/nginx/nginx.conf
RUN sed -i 's|pid .*|pid /tmp/nginx.pid;|' /etc/nginx/nginx.conf
RUN adduser --disabled-password -G www-data www-data

# Compile assets for production use
FROM node:20.1-alpine AS assets
WORKDIR /app
COPY . .

### Add environment variables
RUN --mount=type=secret,id=appid \
    sed -i "s/^PUSHER_APP_ID=/PUSHER_APP_ID=$(cat /run/secrets/appid)/" .env.production
RUN --mount=type=secret,id=appkey \
    sed -i "s/^PUSHER_APP_KEY=/PUSHER_APP_KEY=$(cat /run/secrets/appkey)/" .env.production
RUN --mount=type=secret,id=appsecret \
    sed -i "s/^PUSHER_APP_SECRET=/PUSHER_APP_SECRET=$(cat /run/secrets/appsecret)/" .env.production

RUN npm install && npm run build
RUN rm -rf node_modules

# Single production image 
FROM webserver AS production
COPY ./webserver/opcache.ini /usr/local/etc/php/conf.d/opcache.ini
WORKDIR /var/www/html
COPY --from=assets --chown=www-data:www-data /app/ .
RUN composer install
RUN php artisan optimize:clear
USER www-data
CMD ["sh", "-c", "/usr/local/sbin/php-fpm -D && nginx -g 'daemon off;'"]

# Production Build Separated
# These builds are better on k8s
FROM webserver AS frontend
WORKDIR /var/www/html
COPY --from=assets --chown=www-data:www-data /app/ .
RUN sed -i 's/127.0.0.1/zah-backend-service/g' /etc/nginx/conf.d/default.conf
RUN composer install
RUN php artisan optimize:clear
USER www-data
CMD ["nginx", "-g", "daemon off;"]

FROM zah_base AS backend
WORKDIR /var/www/html
COPY --from=assets --chown=www-data:www-data /app/ .
RUN composer install
RUN php artisan optimize:clear
USER www-data
EXPOSE 9000
ENTRYPOINT ["php-fpm"]

FROM zah_base as queues
WORKDIR /var/www/html
COPY --from=assets --chown=www-data:www-data /app/ .
RUN composer install
USER www-data
ENTRYPOINT ["/usr/local/bin/php"]
CMD ["/var/www/html/artisan", "queue:work"]

# For Development environments
FROM node:alpine AS development
COPY --from=webserver / /
#RUN adduser --disabled-password -G www-data omar
USER www-data
CMD ["sh", "-c", "/usr/local/sbin/php-fpm -D && nginx -g 'daemon off;'"]
