pipeline {
    agent {
        node {
            label SLAVE
        }
    }

    options {
        timestamps()
    }

    stages {
        stage('Set build name and description') {
            steps {
                script {
                    currentBuild.displayName = "Updating Spinnaker RPT pipeline on resourcepoolingtoolapp"
                }
            }
        }
        stage('Update Spinnaker pipeline') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'TB_FUNCTIONAL_USER', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                  echo 'Set up spin cli config file'
                  sh 'sh ${WORKSPACE}/cicd_files/jenkins/scripts/configure_spin_cli_config.sh \"${USER}\" \"${PASS}\"'
                  echo 'Rolling out spinnaker pipeline changes...'
                  sh 'docker run -v ${WORKSPACE}/spinnaker_files/config/spin_cli.config:/root/.spin/config:ro -v ${WORKSPACE}/spinnaker_files/pipelines/rpt_spinnaker_pipeline.json:/pipeline.json:ro --rm armdocker.rnd.ericsson.se/proj-adp-cicd-drop/spin spin pipeline save --file /pipeline.json'
                }
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
