FROM bitnami/php-fpm:7.2

RUN apt-get update
RUN apt-get install -y cron unzip curl software-properties-common

#Install back-end
COPY ./laravel /app
WORKDIR /app
RUN composer install --no-interaction --classmap-authoritative

#Install front-end
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash -
RUN apt-get install -y nodejs
RUN apt-get install -y build-essential libpng-dev
RUN npm install -D imagemin-pngquant@5.0.1
RUN npm run prod

#Install supervisord
RUN apt-get install -y supervisor 
ADD ./supervisord/supervisord.conf	/etc/supervisor/supervisord.conf
ADD ./supervisord/conf.d/ 		/etc/supervisor/conf.d/

#Install ngingx
RUN apt-get install -y nginx
COPY ./nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./nginx/laravel.nginx /etc/nginx/conf.d/vhost.conf

RUN echo '* * * * * php /app/artisan schedule:run' | crontab -

#Debugging
#RUN apt-get install -y nano net-tools

#CMD php-fpm -F --pid /opt/bitnami/php/tmp/php-fpm.pid -y /opt/bitnami/php/etc/php-fpm.conf
ENTRYPOINT ["/usr/bin/supervisord","-c", "/etc/supervisor/supervisord.conf"]