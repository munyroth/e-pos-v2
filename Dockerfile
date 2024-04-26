FROM nginx:1.25.5
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY /build .
ENTRYPOINT ["nginx", "-g", "daemon off;"]
