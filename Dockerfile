# Step 1: Use a Node image to build the application
FROM node:16 AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source files to the container
COPY . .

# Build the application
RUN npm run build

# Step 2: Use a lightweight web server to serve the built application
FROM nginx:alpine

# Copy the built files from the previous stage to the NGINX public directory
COPY --from=build /app/build /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start NGINX server
CMD ["nginx", "-g", "daemon off;"]
