#!/usr/bin/env groovy

def bob = "bob/bob -r \${WORKSPACE}/cicd_files/jenkins/rulesets/sandbox_operations/CreateSandbox.yaml"

pipeline {
    agent {
        node {
            label SLAVE
        }
    }
    options {
        ansiColor('xterm')
    }
    environment {
        HELM_CHART_REPO_CREDS = credentials('SELI_ARTIFACTORY')
        HELM_CHART_REPO_USER = "${HELM_CHART_REPO_CREDS_USR}"
        HELM_CHART_REPO_KEY = "${HELM_CHART_REPO_CREDS_PSW}"
        TB_GERRIT_CREDS = credentials('TB_GERRIT_USER')
    }
    stages {
        stage('Cleaning Git Repo') {
            steps {
                sh 'git clean -xdff'
                sh 'git submodule sync'
                sh 'git submodule update --init --recursive'
            }
        }
        stage('Set Mongo Container Port in Express Code') {
            steps {
                sh "${bob} update-mongo-port-in-express-code"
            }
        }
        stage('Build Angular Sandbox Image') {
            steps {
                sh "${bob} set-angular-env-variables build-docker-image"
            }
        }
        stage('Publish Angular Sandbox Image') {
            steps {
                sh "${bob} publish-docker-image"
            }
        }
        stage('Build Express Sandbox Image') {
            steps {
                sh "${bob} set-express-env-variables build-docker-image"
            }
        }
        stage('Publish Express Sandbox Image') {
            steps {
                sh "${bob} publish-docker-image"
            }
        }
        stage('Build Swagger Sandbox Image') {
            when {
                expression {
                    env.DEPLOY_SWAGGER == "true"
                }
            }
            steps {
                sh "${bob} set-swagger-env-variables build-docker-image"
            }
        }
        stage('Publish Swagger Sandbox Image') {
            when {
                expression {
                    env.DEPLOY_SWAGGER == "true"
                }
            }
            steps {
                sh "${bob} publish-docker-image"
            }
        }
        stage('Delete Local Sandbox Images') {
            steps {
                sh "${bob} set-angular-env-variables delete-docker-image"
                sh "${bob} set-express-env-variables delete-docker-image"
                sh """
                if [["${env.DEPLOY_SWAGGER}" == "true"]]; then
                    sh "${bob} set-swagger-env-variables delete-docker-image"
                fi
                """
            }
        }
        stage('Install Kubeconfig') {
            steps {
                withCredentials([file(credentialsId: 'TB_OLAH023_SERVICE_ACCOUNT_KUBECONFIG', variable: 'KUBECONFIG')]) {
                    sh "install -vD -m 606 ${KUBECONFIG} ./.kube/config"
                }
            }
        }
        stage('Install PVC') {
            steps {
                sh "install -vD -m 600 \
                ${WORKSPACE}/cicd_files/jenkins/rulesets/sandbox_operations/MongoPvc.yaml ./data/MongoPvc.yaml"
            }
        }
        stage('Configure Sandbox Namespace') {
            steps {
                sh "${bob} configure-sandbox-namespace"
            }
        }
        stage('Create and Switch to Sandbox Context') {
            steps {
                sh "${bob} create-and-switch-to-sandbox-context"
            }
        }
        stage('Create Persistent Volume Claims') {
            steps {
                sh """
                if [[ "${env.DELETE_MONGO_DB}" == "true" ]]; then
                    ${bob} delete-pvcs
                fi
                """
                sh "${bob} create-pvcs"
            }
        }
        stage('Run Helm Install') {
            steps {
                sh "${bob} run-helm-install"
                sh """
                if [ "${env.DEPLOY_SWAGGER}" != "true" ]; then
                    ${bob} remove-swagger-pod
                fi
                """
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
