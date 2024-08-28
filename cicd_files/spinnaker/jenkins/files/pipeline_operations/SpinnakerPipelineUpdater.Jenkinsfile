def returnParametersForDsl() {
    return [SLAVE: env.SLAVE]
}

def getPipelineJobs() {
    def pipelineJobList = []

    pipelineJobList = pipelineJobList.plus('cicd_files/spinnaker/dsl/pipeline_jobs/SpinnakerPipelineJsonUpdater.groovy')

    return pipelineJobList.join('\n')
}

pipeline {
    agent {
        node {
            label SLAVE
        }
    }

    environment {
        DSL_CLASSPATH = 'cicd_files/dsl'
    }

    stages {
        stage ('Validate required parameters set') {
            when {
                expression {
                    env.SLAVE == null
                }
            }

            steps {
                error ('Required parameter(s) not set. Please provide a value for all required parameters')
            }
        }

        stage('Generate RPT Spinnaker Pipeline Jobs') {
            steps {
                jobDsl targets: getPipelineJobs(),
                    additionalParameters: returnParametersForDsl(),
                    additionalClasspath: env.DSL_CLASSPATH
            }
        }

        stage('Run spinnaker pipeline updater') {
            steps {
                script {
                    def resource_pooling_tool_Spinnaker_Pipeline_JSON_Updater = build(
                        job: "resource-pooling-tool_Spinnaker_Pipeline_JSON_Updater",
                        propagate: true,
                        wait: true,
                    )
                }
            }
        }

        stage ('Update RPT View') {
            steps {
                jobDsl targets: 'cicd_files/dsl/views/View.groovy'
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}
