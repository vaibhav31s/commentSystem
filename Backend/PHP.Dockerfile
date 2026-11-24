# Install PHP dependencies from composer.lock
FROM composer:2 AS vendor
WORKDIR /app
COPY app/composer.json app/composer.lock ./
RUN composer install --no-dev --no-interaction --no-progress --prefer-dist --optimize-autoloader

FROM php:8.3-fpm-bookworm
RUN docker-php-ext-install -j "$(nproc)" pdo_mysql \
 && docker-php-ext-enable opcache \
 && { \
      echo 'opcache.memory_consumption=128'; \
      echo 'opcache.interned_strings_buffer=8'; \
      echo 'opcache.max_accelerated_files=4000'; \
      echo 'opcache.revalidate_freq=2'; \
    } > /usr/local/etc/php/conf.d/opcache-recommended.ini \
 && { echo 'expose_php=Off'; echo 'display_errors=Off'; echo 'log_errors=On'; } > /usr/local/etc/php/conf.d/production.ini \
 && echo 'clear_env = no' >> /usr/local/etc/php-fpm.d/www.conf
WORKDIR /app
COPY app/ /app/
COPY --from=vendor /app/vendor /app/vendor
USER www-data
CMD ["php-fpm"]
