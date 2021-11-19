FROM bitnami/php-fpm:latest

RUN apt-get update
RUN apt-get install -y cron unzip curl software-properties-common

COPY ./laravel /app

WORKDIR /app
RUN composer install

RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential libpng-dev
RUN npm install -D imagemin-pngquant@5.0.1
RUN npm run dev

RUN chmod -R 777 storage bootstrap/cache

RUN apt-get install -y supervisor
ADD ./supervisord/supervisord.conf	/etc/supervisor/supervisord.conf
ADD ./supervisord/conf.d/ 		/etc/supervisor/conf.d/

RUN echo '* * * * * php /app/artisan schedule:run' | crontab -

RUN apt-get install -y nano

RUN cp .env.example .env

RUN php artisan view:clear
RUN php artisan cache:clear
RUN php artisan config:clear
RUN php artisan config:cache
RUN composer dump-autoload

#CMD php-fpm -F --pid /opt/bitnami/php/tmp/php-fpm.pid -y /opt/bitnami/php/etc/php-fpm.conf
ENTRYPOINT ["/usr/bin/supervisord","-c", "/etc/supervisor/supervisord.conf"]

RUN artisan migrate:fresh --seed
RUN php artisan key:generate
RUN php artisan config:clear
RUN php artisan config:cache
