pipeline {
  agent any

  environment {
    REVISION = "1.0.${env.BUILD_ID}"
    DOCKER_IMAGE = ""
  }

  stages {

    stage('Docker Build - Imagem') {
      agent any
      steps {
        sh 'docker build -t ${DOCKER_IMAGE}:${REVISION} .'
        sh 'docker tag ${DOCKER_IMAGE}:${REVISION} ${DOCKER_IMAGE}:latest '
      }
    }
    stage('Docker Push - DockerHub') {
      agent any
      steps {
        withCredentials(bindings: [usernamePassword(credentialsId: 'dockerhub', passwordVariable: 'dockerHubPassword', usernameVariable: 'dockerHubUser')]) {
          sh "docker login -u ${env.dockerHubUser} -p ${env.dockerHubPassword}"
          sh 'docker push ${DOCKER_IMAGE}:${REVISION}'
          sh 'docker push ${DOCKER_IMAGE}:latest'
        }

      }
    }
  }

}
