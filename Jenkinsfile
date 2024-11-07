pipeline {
    agent any
    environment {
        IMAGE_TAG = "${BUILD_NUMBER}"
        DOCKERHUB_USER = 'hasanhabib16011998'
        FRONTEND_APP = "jenkins_project_frontend"
        FRONTEND_IMAGE = "${DOCKERHUB_USER}/${FRONTEND_APP}"
    }

    stages {
        stage('cleanup Workspace') {
            steps {
                script{
                    cleanWs()
                }   
            }
        }

        stage('Checkout') {
            steps {
                git 'https://github.com/hasanhabib16011998/jenkins_project'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build --no-cache -t ${FRONTEND_IMAGE}:${BUILD_NUMBER} -t ${FRONTEND_IMAGE}:latest -f ./Dockerfile ./frontend'
                echo "ALL IMAGES BUILT"
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'PASSWORD', usernameVariable: 'USER_NAME')]) {
                    sh 'docker login -u $USER_NAME -p $PASSWORD'
                    sh 'docker push ${FRONTEND_IMAGE}:${BUILD_NUMBER}'
                    sh 'docker push ${FRONTEND_IMAGE}:latest'
                    sh 'docker push ${BACKEND_IMAGE}:${BUILD_NUMBER}'
                    sh 'docker push ${BACKEND_IMAGE}:latest'
                    echo "ALL IMAGES PUSHED"
                    sh 'docker logout'
                        }
                }
        }

        stage("DELETE OLD IMAGES"){
            steps{
                    sh 'docker rmi ${FRONTEND_IMAGE}:${BUILD_NUMBER}'
                    sh 'docker rmi ${FRONTEND_IMAGE}:latest'
                    sh 'docker rmi ${BACKEND_IMAGE}:${BUILD_NUMBER}'
                    sh 'docker rmi ${BACKEND_IMAGE}:latest'
            }
        }

        stage('UPDATE K8s DEPLOYMENT FILE') {
             steps {
                 sh 'cat ./k8s/client-deployment.yml'
                sh "sed -i 's/${FRONTEND_APP}.*/${FRONTEND_APP}:${IMAGE_TAG}/g' ./k8s/client-deployment.yml"
                sh "sed -i 's/${BACKEND_APP}.*/${BACKEND_APP}:${IMAGE_TAG}/g' ./k8s/server-deployment.yml"
                sh 'cat ./k8s/client-deployment.yml'
                sh 'cat ./k8s/server-deployment.yml'
                 }
             }

        stage("PUSH THE CHANGED TAGGED FILE TO GIT MAS"){
            steps{
                sh 'git config --global user.email jackakif@gmail.com'
                sh 'git config --global user.name aakkiiff'
                sh 'git add ./k8s/client-deployment.yml'
                sh 'git add ./k8s/server-deployment.yml'
                sh 'git commit -m "updated tag to ${IMAGE_TAG}"'

                withCredentials([usernamePassword(credentialsId: 'github', passwordVariable: 'pass', usernameVariable: 'uname')]) {
                    sh 'git push https://$uname:$pass@github.com/aakkiiff/Goals-project_config.git master'
                    }
                }
        }
            
     }
}