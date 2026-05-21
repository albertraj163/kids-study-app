pipeline {
    agent any

    environment {
        NODE_ENV = 'test'
        BACKEND_DIR = 'backend'
        COMPOSE_SCRIPT = './scripts/compose.sh'
    }

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '30'))
    }

    stages {
        stage('Checkout') {
            steps {
                script { env.LAST_STAGE = 'Checkout' }
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                script { env.LAST_STAGE = 'Install dependencies' }
                dir(env.BACKEND_DIR) {
                    sh 'npm ci'
                }
            }
        }

        stage('Lint') {
            steps {
                script { env.LAST_STAGE = 'Lint' }
                dir(env.BACKEND_DIR) {
                    sh 'npm run lint'
                }
            }
        }

        stage('Unit tests') {
            steps {
                script { env.LAST_STAGE = 'Unit tests' }
                dir(env.BACKEND_DIR) {
                    sh 'npm test'
                }
            }
        }

        stage('Build Docker images') {
            steps {
                script { env.LAST_STAGE = 'Build Docker images' }
                sh 'docker build -t kids-study-backend:latest ./backend'
                sh 'docker build -t kids-study-frontend:latest ./frontend'
            }
        }

        stage('Deploy') {
            when {
                anyOf {
                    branch 'main'
                    branch 'master'
                }
            }
            steps {
                script { env.LAST_STAGE = 'Deploy' }
                sh 'chmod +x scripts/compose.sh scripts/local-ci.sh || true'
                sh "${env.COMPOSE_SCRIPT} up -d --build"
            }
        }
    }

    post {
        success {
            echo "Build #${env.BUILD_NUMBER} succeeded in ${currentBuild.durationString.replace(' and counting', '')}"
        }
        failure {
            echo "Build #${env.BUILD_NUMBER} FAILED at stage: ${env.LAST_STAGE ?: 'Unknown'}"
        }
        always {
            cleanWs(deleteDirs: true, patterns: [[pattern: '**', type: 'INCLUDE']])
        }
    }
}
