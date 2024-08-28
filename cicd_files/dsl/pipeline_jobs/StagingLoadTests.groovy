import common_classes.CommonSteps
import common_classes.CommonParameters
import common_classes.ExternalParameters

CommonSteps commonSteps = new CommonSteps()
CommonParameters commonParams = new CommonParameters()
ExternalParameters externalParams = new ExternalParameters()


def pipelineBeingGeneratedName = 'resource-pooling-tool_Staging_Load_Test'

pipelineJob(pipelineBeingGeneratedName) {
    description(commonSteps.defaultJobDescription(pipelineBeingGeneratedName,
        """The ${pipelineBeingGeneratedName} job performs load testing against RPT Staging.""",
        "cicd_files/dsl/pipeline_jobs/StagingLoadTests.groovy",
        "cicd_files/jenkins/files/pipeline_jobs/StagingLoadTests.Jenkinsfile"))
    parameters {
        stringParam(commonParams.slave())
        stringParam(externalParams.numberOfUser())
        stringParam(externalParams.duration())
    }

    disabled(false)
    keepDependencies(false)
    logRotator(commonSteps.defaultLogRotatorValues())

    triggers {
        cron('H 03 * * 2,4')
    }

    definition {
        cpsScm {
            scm {
                git {
                    branch('master')
                        remote {
                            url(commonParams.repoUrl())
                        }
                        extensions {
                            cleanBeforeCheckout()
                            localBranch 'master'
                        }
                }
            }
            scriptPath('cicd_files/jenkins/files/pipeline_jobs/StagingLoadTests.Jenkinsfile')
        }
    }
}
