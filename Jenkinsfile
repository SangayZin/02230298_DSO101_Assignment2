pipeline {
  agent any

  tools {
    nodejs 'NodeJS'
  }

  environment {
    FRONTEND_DIR = 'frontend'
    BACKEND_DIR = 'backend'
    // Replace DOCKERHUB_USERNAME with your Docker Hub username
    DOCKERHUB_USERNAME = 'sangay298'
    FRONTEND_IMAGE = "${DOCKERHUB_USERNAME}/fe-todo:latest"
    BACKEND_IMAGE = "${DOCKERHUB_USERNAME}/be-todo:latest"
    DOCKERHUB_CREDENTIALS_ID = 'docker-hub-creds'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install Dependencies') {
      parallel {
        stage('Frontend') {
          steps {
            dir(env.FRONTEND_DIR) {
              sh 'npm install'
            }
          }
        }

        stage('Backend') {
          steps {
            dir(env.BACKEND_DIR) {
              sh 'npm install'
              sh 'npm rebuild'
            }
          }
        }
      }
    }

    stage('Test') {
      steps {
        dir(env.BACKEND_DIR) {
          sh 'npm test'
        }
      }

      post {
        always {
          junit allowEmptyResults: true, testResults: 'backend/test-results/junit.xml'
        }
      }
    }

    stage('Build') {
      steps {
        dir(env.FRONTEND_DIR) {
          sh 'npm run build'
        }
      }
    }

    stage('Deploy') {
      steps {
        script {
          try {
            echo 'Building Docker images...'
            sh "docker build -f backend/Dockerfile -t ${env.BACKEND_IMAGE} ."
            sh "docker build -f frontend/Dockerfile -t ${env.FRONTEND_IMAGE} ."
            
            echo 'Logging in to Docker Hub...'
            withCredentials([usernamePassword(credentialsId: env.DOCKERHUB_CREDENTIALS_ID, usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
              sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
            }
            
            echo 'Pushing Docker images to Docker Hub...'
            sh "docker push ${env.BACKEND_IMAGE}"
            sh "docker push ${env.FRONTEND_IMAGE}"
            
            echo 'Docker images pushed successfully!'
          } catch (Exception e) {
            echo "WARNING: Docker operation failed: ${e.message}"
            echo "Continuing with pipeline..."
          }
        }
      }
    }
  }

  post {
    success {
      echo 'Pipeline completed successfully.'
    }

    always {
      archiveArtifacts allowEmptyArchive: true, artifacts: 'backend/test-results/junit.xml'
    }
  }
}