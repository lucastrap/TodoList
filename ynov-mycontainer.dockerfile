
FROM ubuntu:latest

RUN apt-get update && apt-get install -y \
  nginx \
  mariadb-server \
  mariadb-client \
  && apt-get clean

COPY nginx.conf /etc/nginx/nginx.conf
COPY html/ /var/www/html/

EXPOSE 80 3306

RUN echo "#!/bin/bash\n\
service mysql start && \
service nginx start && \
tail -f /var/log/nginx/access.log" > /start.sh && chmod +x /start.sh

CMD ["/start.sh"]
