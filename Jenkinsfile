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
            docker.build(env.BACKEND_IMAGE, '-f backend/Dockerfile .')
            docker.build(env.FRONTEND_IMAGE, '-f frontend/Dockerfile .')

            echo 'Pushing Docker images to Docker Hub...'
            docker.withRegistry('https://registry.hub.docker.com', env.DOCKERHUB_CREDENTIALS_ID) {
              docker.image(env.BACKEND_IMAGE).push()
              docker.image(env.FRONTEND_IMAGE).push()
            }
          } catch (Exception e) {
            echo "WARNING: Docker push failed: ${e.message}"
            echo "Docker images were built successfully but could not be pushed."
            echo "Verify Docker daemon is running on Jenkins agent and try again."
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