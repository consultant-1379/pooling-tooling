def returnParametersForDsl() {
    return [SLAVE: env.SLAVE]
}

def getPipelineJobs() {
    def pipelineJobList = []

    pipelineJobList = pipelineJobList.plus('cicd_files/dsl/pipeline_jobs/BuildAndPublish.groovy')
    pipelineJobList = pipelineJobList.plus('cicd_files/dsl/pipeline_jobs/PreCodeReview.groovy')
    pipelineJobList = pipelineJobList.plus('cicd_files/dsl/pipeline_jobs/StagingLoadTests.groovy')
    pipelineJobList = pipelineJobList.plus('cicd_files/dsl/pipeline_jobs/StagingTests.groovy')

    pipelineJobList = pipelineJobList.plus('cicd_files/dsl/pipeline_operations/PipelineUpdater.groovy')

    pipelineJobList = pipelineJobList.plus('cicd_files/dsl/sandbox_operations/CreateSandbox.groovy')

    return pipelineJobList.join('\n')
}

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
        DSL_CLASSPATH = 'cicd_files/dsl'
    }

    stages {
        stage('Validate required parameters set') {
            when {
                expression {
                    env.SLAVE == null
                }
            }

            steps {
                error('Required parameter(s) not set. Please provide a value for all required parameters')
            }
        }

        stage ('Generate RPT pipeline jobs') {
            steps {
                jobDsl targets: getPipelineJobs(),
                additionalParameters: returnParametersForDsl(),
                additionalClasspath: env.DSL_CLASSPATH
            }
        }

        stage ('Update RPT List View') {
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
