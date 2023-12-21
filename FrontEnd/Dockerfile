FROM node:16-bullseye as user_builder
WORKDIR /app
COPY . .
RUN apt-get update --fix-missing && \
    apt install -y npm && \
    npm i && \
    npm run build


FROM nginx
RUN rm -rf /var/www/html/*
COPY --from=user_builder /app/build /var/www/html
COPY nginx.conf /etc/nginx/nginx.conf
