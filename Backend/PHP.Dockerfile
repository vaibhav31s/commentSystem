FROM php:8.1.23-fpm-bookworm
USER root
RUN apt-get update && apt-get install -y openssh-server

RUN apt-get install -y --no-install-recommends \
        libfreetype6-dev \
        libicu-dev \
        libjpeg-dev \
        libmagickwand-dev \
        libpng-dev \
        libwebp-dev \
        libzip-dev





RUN docker-php-ext-install -j "$(nproc)" \ 
        pdo \
        pdo_mysql \
        mysqli \
        bcmath \
        exif \
        gd \
        intl \
        zip

RUN docker-php-ext-configure gd \
		--with-freetype \
		--with-jpeg \
		--with-webp

    
RUN set -eux; \
	docker-php-ext-enable opcache; \
	{ \
		echo 'opcache.memory_consumption=128'; \
		echo 'opcache.interned_strings_buffer=8'; \
		echo 'opcache.max_accelerated_files=4000'; \
		echo 'opcache.revalidate_freq=2'; \
		echo 'opcache.fast_shutdown=1'; \
	} > /usr/local/etc/php/conf.d/opcache-recommended.ini

RUN pecl install xdebug && docker-php-ext-enable xdebug

RUN pecl install imagick-3.7.0 && docker-php-ext-enable imagick

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
RUN      php -r "if (hash_file('sha384', 'composer-setup.php') === 'e21205b207c3ff031906575712edab6f13eb0b361f2085f1f1237b7126d785e826a450292b6cfd1d64d92e6563bbde02') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
RUN       php composer-setup.php
RUN     php -r "unlink('composer-setup.php');"



RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

WORKDIR /app
RUN composer install --no-scripts --no-autoloader
COPY . .

RUN composer dump-autoload --optimize
CMD ["php-fpm"]