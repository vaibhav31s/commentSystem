FROM nginx
COPY default.conf /etc/nginx/conf.d/default.cconf
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf /etc/nginx/conf.d/nginx.conf