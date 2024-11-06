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
