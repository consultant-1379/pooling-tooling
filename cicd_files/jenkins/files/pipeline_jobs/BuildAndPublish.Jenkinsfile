#!/usr/bin/env groovy

def bob = "bob/bob -r \${WORKSPACE}/cicd_files/jenkins/rulesets/BuildAndPublish.yaml"

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
        WORKING_DIR = sh(
            script: "pwd",
            returnStdout: true
        ).trim()
    }
    stages {
        stage('Cleaning Git Repo') {
            steps {
                sh 'git clean -xdff'
                sh 'git submodule sync'
                sh 'git submodule update --init --recursive'
            }
        }
        stage('Bump Version') {
            steps {
                sh "${bob} set-version-env-variable bump-service-version"
                script {
                    env.IMAGE_VERSION = readFile('artifact.properties').trim()
                }
                replaceVersion()
            }
        }
        stage('Build Angular Service') {
            steps {
                sh "${bob} set-angular-env-variables build-docker-image"
            }
        }
        stage('Publish Angular Service') {
            steps {
                sh "${bob} publish-docker-image clean-up-docker-image"
            }
        }
        stage('Build Express Service') {
            steps {
                sh "${bob} set-express-env-variables build-docker-image"
            }
        }
        stage('Publish Express Service') {
            steps {
                sh "${bob} publish-docker-image clean-up-docker-image"
            }
        }
        stage('Build Swagger Service') {
            steps {
                sh "${bob} set-swagger-env-variables build-docker-image"
            }
        }
        stage('Publish Swagger Service') {
            steps {
                sh "${bob} publish-docker-image clean-up-docker-image"
            }
        }
        stage('Build NGINX Service') {
            steps {
                sh "${bob} set-nginx-env-variables build-docker-image"
            }
        }
        stage('Publish NGINX Service') {
            steps {
                sh "${bob} publish-docker-image clean-up-docker-image"
            }
        }
        stage('Add changes to Version file of Pooling Tooling Tool') {
            steps {
                sh "${bob} add-changes-to-version-file"
            }
        }
        stage('Push up changes to version file') {
            steps {
                sh "${bob} push-changes-to-version-file"
            }
        }
        stage('Archive artifact properties file') {
            steps {
                archiveArtifacts artifacts: 'artifact.properties', onlyIfSuccessful: true
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}

void replaceVersion() {
    String newVersion = env.IMAGE_VERSION
    List<String> files = [
        'services/angular/package.json',
        'services/express/package.json',
        'services/swagger/package.json',
        'services/swagger/pooling-tooling.yaml',
    ]
    def currentDirectory = env.WORKING_DIR
    files.each { file ->
        String path = "${currentDirectory}/${file}"
        def content = new File(path).getText()
        def updatedContent
        if (file.endsWith('.json')) {
            updatedContent = content.replaceFirst(/"version": ".*"/, "\"version\": \"$newVersion\"")
        } else if (file.endsWith('.yaml')) {
            updatedContent = content.replaceFirst(/version: '.*'/, "version: '$newVersion'")
        }
        new File(path).setText(updatedContent)
    }
}