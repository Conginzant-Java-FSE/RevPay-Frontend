pipeline {
    agent any

    environment {
        FRONTEND_EC2  = 'RevPay-Frontend-EC2'
        DEPLOY_DIR    = '/var/www/revpay'
        APP_NAME      = 'revpay'
    }

    tools {
        nodejs 'NodeJS-20'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Checking out Angular source...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing npm packages...'
                bat 'npm install'
            }
            post {
                success { echo 'Dependencies installed!' }
                failure { error 'npm install failed — stopping.' }
            }
        }

        stage('Build') {
            steps {
                echo 'Building Angular for production...'
                bat 'npm run build -- --configuration production'
            }
            post {
                success { echo 'Build successful!' }
                failure { error 'Build failed — stopping.' }
            }
        }

        stage('Deploy to EC2') {
            steps {
                echo 'Deploying to Frontend EC2...'
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: "${FRONTEND_EC2}",
                            verbose: true,
                            transfers: [

                                // Step 1: Clear old build
                                sshTransfer(
                                    sourceFiles: '',
                                    execCommand: '''
                                        echo "=== Clearing old build ===" &&
                                        rm -rf /var/www/revpay/* &&
                                        echo "Cleared!"
                                    '''
                                ),

                                // Step 2: Upload new build
                                sshTransfer(
                                    sourceFiles: 'dist/revpay/browser/**/*',
                                    removePrefix: 'dist/revpay/browser',
                                    remoteDirectory: '',
                                    execCommand: ''
                                ),

                                // Step 3: Restart nginx
                                sshTransfer(
                                    sourceFiles: '',
                                    execCommand: '''
                                        sudo systemctl restart nginx &&
                                        sudo systemctl is-active nginx &&
                                        echo "Frontend is LIVE!"
                                    '''
                                )
                            ]
                        )
                    ]
                )
            }
        }

        stage('Health Check') {
            steps {
                sshPublisher(
                    publishers: [
                        sshPublisherDesc(
                            configName: "${FRONTEND_EC2}",
                            verbose: true,
                            transfers: [
                                sshTransfer(
                                    sourceFiles: '',
                                    execCommand: 'sudo systemctl is-active nginx && echo "Nginx LIVE" || exit 1'
                                )
                            ]
                        )
                    ]
                )
            }
        }
    }

    post {
        success { echo 'FRONTEND DEPLOYMENT SUCCESSFUL!' }
        failure { echo 'FRONTEND PIPELINE FAILED!' }
        always  { cleanWs() }
    }
}