#!/usr/bin/env groovy

def bob = "bob/bob -r \${WORKSPACE}/cicd_files/jenkins/rulesets/PreCodeReview.yaml"

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
        TB_FUNC_USER_CREDS = credentials('TB_RPT_AUTH')
        TB_FUNCTIONAL_USER = "${TB_FUNC_USER_CREDS_USR}"
        TB_FUNCTIONAL_USER_PASSWORD = "${TB_FUNC_USER_CREDS_PSW}"
        TB_ARM_USER_CREDS = credentials('TB_RPT_AUTH_ARM_SELI')
        TB_ARM_USER = "${TB_ARM_USER_CREDS_USR}"
        TB_ARM_USER_PASSWORD = "${TB_ARM_USER_CREDS_PSW}"
    }
    stages {
        stage('Cleaning Git Repo') {
            steps {
                sh 'git clean -xdff'
                sh 'git submodule sync'
                sh 'git submodule update --init --recursive'
            }
        }
        stage('Build RPT Services') {
            steps {
                sh "${bob} clean-up"
                sh "${bob} set-env-variables"
                sh "${bob} build-services"
            }
        }
        stage('Running Express Tests') {
            steps {
                sh "${bob} express-test"
            }
        }
       stage('Express SonarQube Analysis') {
            environment {
                SONARQUBE_TOKEN = credentials('TB_SONAR_NEW')
            }
            steps {
                withSonarQubeEnv('SonarQubeNew') {
                    sh "${bob} express-analysis"
                }
            }
       }
       stage('Express SonarQube Quality Gate') {
            options {
                retry(5)
            }
            steps {
                timeout(time: 30, unit: 'SECONDS') {
                    script {
                        if (waitForQualityGate().status != "OK") {
                            currentBuild.result = "FAILURE"
                        } else {
                            currentBuild.result = "SUCCESS"
                        }
                        sleep(5)
                    }
                }
            }
       }
       stage('Running Angular Tests') {
            steps {
               sh "${bob} angular-test"
           }
       }
       stage('Angular SonarQube Analysis') {
           environment {
               SONARQUBE_TOKEN = credentials('TB_SONAR_NEW')
           }
           steps {
               withSonarQubeEnv('SonarQubeNew') {
                   sh "${bob} angular-analysis"
               }
           }
        }
        stage('Angular SonarQube Quality Gate') {
           options {
                retry(5)
            }
            steps {
                timeout(time: 30, unit: 'SECONDS') {
                    script {
                        if (waitForQualityGate().status != "OK") {
                            currentBuild.result = "FAILURE"
                        } else {
                            currentBuild.result = "SUCCESS"
                        }
                        sleep(5)
                    }
                }
            }
        }
        stage('Running Functional Tests') {
            steps {
               sh "${bob} functional-test"
           }
       }
    }
    post {
        always {
            sh "${bob} clean-up"
            cleanWs()
        }
    }
}
