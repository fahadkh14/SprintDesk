
pipeline {

    agent any

    options {
        timestamps()
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '10'))
    }

    environment {
        DOCKERHUB = credentials('dockerhub-creds')

        MYSQL_ROOT_PASSWORD =
            credentials('sprintdesk-mysql-root-password')

        MYSQL_PASSWORD =
            credentials('sprintdesk-mysql-password')

        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out SprintDesk source code'

                checkout scm

                sh '''
                    echo "Branch: $BRANCH_NAME"
                    git log -1 --oneline
                    ls -la
                '''
            }
        }

        stage('Validate Backend') {
            steps {
                echo 'Checking backend JavaScript syntax'

                sh '''
                    docker run --rm \
                    -u "$(id -u):$(id -g)" \
                    -v "$WORKSPACE/backend:/app" \
                    -w /app \
                    node:22-alpine \
                    sh -c 'npm ci --omit=dev &&
                    find src -type f -name "*.js" \
                    -print0 | xargs -0 -r -n1 node --check'
                '''
            }
        }

        stage('Build Docker Images') {
            steps {
                echo 'Building SprintDesk images'

                sh '''
                    docker build --pull \
                    -t "$DOCKERHUB_USR/sprintdesk-backend:$IMAGE_TAG" \
                    -t "$DOCKERHUB_USR/sprintdesk-backend:latest" \
                    ./backend

                    docker build --pull \
                    -t "$DOCKERHUB_USR/sprintdesk-frontend:$IMAGE_TAG" \
                    -t "$DOCKERHUB_USR/sprintdesk-frontend:latest" \
                    ./frontend
                '''
            }
        }

        stage('Trivy Security Scan') {
            steps {
                echo 'Scanning Docker images'

                sh '''
                    trivy image \
                    --scanners vuln \
                    --severity CRITICAL \
                    --ignore-unfixed \
                    --exit-code 1 \
                    "$DOCKERHUB_USR/sprintdesk-backend:$IMAGE_TAG"

                    trivy image \
                    --scanners vuln \
                    --severity CRITICAL \
                    --ignore-unfixed \
                    --exit-code 1 \
                    "$DOCKERHUB_USR/sprintdesk-frontend:$IMAGE_TAG"
                '''
            }
        }

        stage('Push to Docker Hub') {
            steps {
                echo 'Pushing images to Docker Hub'

                sh '''
                    echo "$DOCKERHUB_PSW" | \
                    docker login \
                    -u "$DOCKERHUB_USR" \
                    --password-stdin

                    docker push \
                    "$DOCKERHUB_USR/sprintdesk-backend:$IMAGE_TAG"

                    docker push \
                    "$DOCKERHUB_USR/sprintdesk-backend:latest"

                    docker push \
                    "$DOCKERHUB_USR/sprintdesk-frontend:$IMAGE_TAG"

                    docker push \
                    "$DOCKERHUB_USR/sprintdesk-frontend:latest"
                '''
            }
        }

        stage('Deploy SprintDesk') {
            steps {
                echo 'Deploying SprintDesk using Docker Compose'

                script {
                    withEnv([
                        "DOCKERHUB_USERNAME=${env.DOCKERHUB_USR}",
                        "IMAGE_TAG=${env.IMAGE_TAG}"
                    ]) {
                        sh '''
                            docker compose up -d \
                            --no-build \
                            --pull always

                            echo "Waiting for application health..."

                            for i in $(seq 1 30); do

                                if curl -fsS \
                                http://127.0.0.1:5761/health \
                                >/dev/null && \
                                curl -fsS \
                                http://127.0.0.1:8092/ \
                                >/dev/null; then

                                    echo "SprintDesk is healthy!"
                                    exit 0
                                fi

                                echo "Waiting... attempt $i"
                                sleep 5
                            done

                            echo "Application health check failed"

                            docker compose ps
                            docker compose logs --tail=100

                            exit 1
                        '''
                    }
                }
            }
        }
    }

    post {
        success {
            echo 'SprintDesk CI/CD pipeline completed successfully!'
        }

        failure {
            echo 'SprintDesk CI/CD pipeline failed. Check console output.'
        }

        always {
            sh 'docker logout || true'
        }
    }
}
