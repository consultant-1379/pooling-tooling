#!/usr/bin/env groovy

def bob = "bob/bob -r \${WORKSPACE}/cicd_files/jenkins/rulesets/StagingTests.yaml"

pipeline {
    agent {
        node {
            label SLAVE
        }
    }
    options {
        ansiColor('xterm')
    }
    stages {
        stage('Cleaning Git Repo') {
            steps {
                sh 'git clean -xdff'
                sh 'git submodule sync'
                sh 'git submodule update --init --recursive'
            }
        }
        stage('Running Functional Tests') {
            steps {
               sh "${bob} functional-test"
           }
        }
        stage('Running Non-Functional Tests') {
            steps {
               sh "${bob} non-functional-test"
           }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
