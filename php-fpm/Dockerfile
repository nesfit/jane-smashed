FROM bitnami/php-fpm:latest

RUN apt-get update && apt-get install -y cron nano

COPY ./laravel /app

WORKDIR /app
RUN composer install && composer update
RUN npm install
RUN npm run prod

CMD php-fpm -F --pid /opt/bitnami/php/tmp/php-fpm.pid -y /opt/bitnami/php/etc/php-fpm.conf