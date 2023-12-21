# FROM node:16-bullseye as user_builder
# WORKDIR /app
# COPY . .
# RUN apt-get update --fix-missing && \
#     apt install -y npm && \
#     npm i -g yarn && \
#     yarn i && \
#     yarn build


# FROM nginx
# RUN rm -rf /var/www/html/*
# COPY --from=user_builder /app/build /var/www/html
# COPY nginx.conf /etc/nginx/nginx.conf

FROM nginx 
RUN rm -rf /var/www/html/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY build/* /var/www/html