Single Stage Vs Multi Stage Build docker:

This is my single stage build Dockerfie:

# Fetching the latest node image on alpine linux
FROM node:16-alpine




# Setting up the work directory
WORKDIR /app


# Installing dependencies
COPY ./package*.json .


RUN npm install


# Copying all the files in our project
COPY . .
EXPOSE 3000
# Starting our application
CMD ["npm","start"]

Now, build the container and run it:
docker build --no-cache -t frontend_single_stage .
docker run -p 3000:3000 -d frontend_single_stage

If we go to http://localhost:3000/, we see the application is running:


Now, lets bring the container down and build a multi-stage docker.

Dockerfile:
# Stage 1: Build the React app
FROM node:16-alpine AS builder


# Set working directory
WORKDIR /app


# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./


# Install dependencies
RUN npm install


# Copy the rest of the application files
COPY . .


# Build the React application
RUN npm run build


# Stage 2: Serve the application with NGINX
FROM nginx:alpine


# Copy the build output from the builder stage to the NGINX HTML folder
COPY --from=builder /app/build /usr/share/nginx/html


# Expose port 80 for serving the application
EXPOSE 80


# Start NGINX when the container starts
CMD ["nginx", "-g", "daemon off;"]




Now lets build and run the container:

```
docker build --no-cache -t frontend_multi_stage .
docker run -p 80:80 -d frontend_multi_stage
```


Now lets compare the image sizes of both miltu stage and single stage builds:


As we can see, the multi stage build is significantly less than the single stage build.
