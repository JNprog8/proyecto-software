FROM php:8.2-apache

# Habilitar mod_rewrite para URLs amigables
RUN a2enmod rewrite

# Permitir directivas .htaccess en /var/www/html
RUN sed -ri -e 's!AllowOverride None!AllowOverride All!g' /etc/apache2/apache2.conf

# Instalar extensiones de PHP necesarias para bases de datos
RUN docker-php-ext-install mysqli pdo pdo_mysql