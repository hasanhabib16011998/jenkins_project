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

This will install docker and jenkins while creating the instance. Now, we wait for a few while and after the instance is created, we can browse the jenkins server in this URL: http://[your instance's public IP]:8080

We will see the initial page of Jenkins server. Now, we need the administrative password of Jenkins. To do that, we connect to the instance through SSH and copy the password in this directory:

```
sudo cat /var/lib/jenkins/secrets/initialAdminPassword
```

We copy the password from here to jenkins initial page and paste it. Then we are successfully logged in . After that, we install the suggested plugins for jenkins. After completion, we create a admin user for our jenkins server.

We also need to add the user 'jenkins' to docker group. To do that:
```
sudo vi /etc/group
```
Then add jenkins to docker group and restart the jenkins server.

```
sudo systemctl restart jenkins
```

# Setup DockerHub

Now, go to dockerhub and generate an access token. Access permission should be 'read and write'.
After generating token, store it securely somewhere. Now, we need to create a credential in your Jenkins server so that we dont have to use this token directly in your codes. Its a bad practice to hard-code credentials into pipeline configuration. Instead, we can use jenkins credentials to manage login information safely into jenkins server. To do that, go to Dashboard>Manage Jenkins>Credentials>System>Global credentials (unrestricted)

Then add the credentials using the username as your dockerhub username and the password as the token provided by DockerHub. Then click 'create'.

# Setup Github webhook

Now, lets configure the pipeline so that when a new commit is pushed to repository, it will automatically build the pipeline.Go to this link for better understanding: https://plugins.jenkins.io/github/


Go to your github repo, go to settings and then select 'add webhook'.In the payload URL, add the url in this format: $JENKINS_BASE_URL/github-webhook/
example: http://65.2.189.39:8080/github-webhook/

content-type: application/x-www-form-encoded
in 'which events would you like to trigger this webhook' field, click 'send me everything'. Now create the webhook.

Now, when a new code is pushed to git repository, it triggers the webhook and sends the information in $JENKINS_BASE_URL/github-webhook/ this url.


# Create pipeline_1

In dashboard, click on 'new item' and then name it 'pipeline_1' and select type as 'pipeline'


### Set up credentials for dockerhub
Then go to pipeline's configuration. We need to create the pipeline syntax for logging in the dockerhub using the credentials we set earlier. Go to pipeline syntax and select sample step as 'withCredentials:Bind Credentials to variables'. Then set username variable as username and password variable as password. In credentials field, select the credentials we created earlier. Now if we click 'Generate pipeline script' we 



### Pipeline-1 Code

Paste this code to pipeline script:

```
pipeline {
    agent any

    environment {
        REPO_URL = 'https://github.com/hasanhabib16011998/jenkins_project' // Git repository URL
        TIMESTAMP = sh(script: 'date +%Y%m%d%H%M%S', returnStdout: true).trim() // Get current date and time
        IMAGE_TAG = "${TIMESTAMP}"
        DOCKERHUB_USER = 'hasanhabib16011998'
        FRONTEND_APP = "jenkins-project"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/${FRONTEND_APP}"
    }

    stages {
        stage('Checkout Code') {
            steps {
                echo 'Hello'
                git branch: 'dev', url: "${REPO_URL}"
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${FRONTEND_IMAGE}:${IMAGE_TAG} -f ./Dockerfile .'
                echo "Docker images tagged with BUILD_NUMBER, latest, and TIMESTAMP: ${TIMESTAMP}"
            }
        }

        stage('Docker login+push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'password', usernameVariable: 'username')]) {
                    sh "echo ${password} | docker login -u ${username} --password-stdin"
                }

                sh 'docker push ${FRONTEND_IMAGE}:${IMAGE_TAG}'
                sh 'docker logout'
                echo "Docker images pushed with tags BUILD_NUMBER, latest, and TIMESTAMP: ${TIMESTAMP}"
            }
        }

        stage('Trigger pipeline_2') {
            steps {
                build job: 'pipeline_2', parameters: [string(name: 'IMAGE_TAG', value: "${IMAGE_TAG}")]
            }
        }

        stage('Cleanup Workspace') {
            steps {
                script{
                    cleanWs()
                }   
            }
        }

        stage("DELETE OLD IMAGES"){
            steps{
                    sh 'docker rmi ${FRONTEND_IMAGE}:${IMAGE_TAG}'
            }
        }


    }
}

```

### Hook trigger

In addition, we need to setup our pipeline so that when github triggers the webhook on 'git push' event, our pipeline triggers automatically. To do that, in pipeline's configuration, go to 'Build triggers' and enable 'GitHub hook trigger for GitScm polling'.


# Create pipeline_2

In this pipeline, we will get the image tag from pipeline 1 and notify via Google Chat that our pipeline run was successful or not.

### Google Chat plugin

Go to this URL for better understanding: https://support.google.com/chat/answer/9632691?hl=en&co=GENIE.Platform%3DAndroid

Download the plugin: https://storage.googleapis.com/jenkins-bot-production.appspot.com/plugin/1.0/google-hangouts-chat-notifier.hpi

In your jenkins dashboard, go to Manage jenkins> plugins and go to advanced settings. In the 'Deploy' section, upload the downloaded file.

Now, create a workspace in google chat. Go to the workspace and on the workspaces name, we find a dropdown menu. In this menu, we click apps and integration> add apps.

From the list, we select jenkins app.We will get a token instantly. We take this token and create another credential in jenkins.

### pipeline_2 configuration

Now, we go to dashboard, create another pipeline named 'pipeline_2'. Now we paste this code in the pipeline_2 script:

```
pipeline {
    agent any

    parameters {
        string(name: 'IMAGE_TAG', defaultValue: '', description: 'Docker image tag passed from the triggering pipeline')
    }

    environment {
        DOCKERHUB_USER = 'hasanhabib16011998'
        FRONTEND_APP = "jenkins-project"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/${FRONTEND_APP}"
    }

    stages {
        stage('Use Docker Image') {
            steps {
                echo "Using Docker image: ${FRONTEND_IMAGE}:${IMAGE_TAG}"
            }
        }
    }

    post {
        success {
            emailext body: "Hi, the pipeline 2 has been built successfully. ${FRONTEND_IMAGE}:${IMAGE_TAG} has been pushed to DockerHub.", subject: 'Pipeline_2 Build Success', to: 'jinaj50765@opposir.com'
            withCredentials([string(credentialsId: 'GChat', variable: 'token')]) {
            hangoutsNotify(
            message: "PIPELINE: $env.JOB_NAME has completed SUCCESSFULLY.<br>IMAGE TAG: ${FRONTEND_IMAGE}:${IMAGE_TAG}",
            token: env.token
            )
            }

        }
        failure {
            emailext body: "Hi, the pipeline 2 build has failed. Please check the Jenkins logs for more details.", subject: 'Pipeline_2 Build Failure', to: 'jinaj50765@opposir.com'
        }
    }
}

```

# Testing

Now, our setup is complete. This is what the 2 pipeline will do:

* pipeline_1
	* triggered on git push 
	* it fetches source code from github (public repo)
	* build docker file without using any cache
	* tag with current date-time
	* push to dockerhub
	* credentials are passed as secret variables
	* uses env variable as much as possible
	* then trigger the pipeline 2 and passes the image tag as parameter
	* deletes all the caches and images of the machine (clean machine)
* pipeline 2 
	* gets the image tag form the pipeline 1
	* notifies us on google chat that image:tag has been pushed 
