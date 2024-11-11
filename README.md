# Single Stage Vs Multi Stage Build docker:

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

```
docker images

```
We can see a significant reduction in size of the single stage build an multi stage build containers. In this case, the single stage build was **574 MB** and the multi stage build was **51.4 MB** only!


# Creating Jenkins Server

At first, we create a EC2 instance in AWS. While creating the instance, we go to advance details> userdata section, and paste this code:

```
#!/bin/bash 
sudo apt update -y 
sudo apt install openjdk-17-jre -y 
curl -fsSL https://pkg.jenkins.io/debian/jenkins.io-2023.key | sudo tee /usr/share/keyrings/jenkins-keyring.asc > /dev/null 
echo deb [signed-by=/usr/share/keyrings/jenkins-keyring.asc] https://pkg.jenkins.io/debian binary/ | sudo tee /etc/apt/sources.list.d/jenkins.list > /dev/null sudo 
apt-get update -y 
sudo apt-get install jenkins -y

# Add Docker's official GPG key:
sudo apt-get update -y
sudo apt-get install ca-certificates curl -y
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update -y

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin -y

```

