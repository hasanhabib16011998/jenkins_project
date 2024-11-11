Single Stage Vs Multi Stage Build docker:

This is my single stage build Dockerfie:

```
# Fetching the latest node image on alpine linux
FROM node:16-alpine
WORKDIR /app
COPY ./package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","start"]

```

Now, build the container and run it:

```
docker build --no-cache -t frontend_single_stage .
docker run -p 3000:3000 -d frontend_single_stage
```

If we go to http://localhost:3000/, we see the application is running:


Now, lets bring the container down and build a multi-stage docker.

Dockerfile:

```
FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


FROM nginx:alpine
COPY --from=builder /app/build /usr/share/nginx/html
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

```

Now lets build and run the container:

```
docker build --no-cache -t frontend_multi_stage .
docker run -p 80:80 -d frontend_multi_stage
```


Now lets compare the image sizes of both milti-stage and single stage builds:


As we can see, the multi stage build is significantly less than the single stage build.
hey!