import common_classes.CommonSteps
import common_classes.CommonParameters
import common_classes.ExternalParameters

CommonSteps commonSteps = new CommonSteps()
CommonParameters commonParams = new CommonParameters()
ExternalParameters externalParams = new ExternalParameters()


def pipelineBeingGeneratedName = 'resource-pooling-tool_Staging_Tests'

pipelineJob(pipelineBeingGeneratedName) {
    description(commonSteps.defaultJobDescription(pipelineBeingGeneratedName,
        """The ${pipelineBeingGeneratedName} job conducts the staging tests.
        This involves running a number of different tests against RPT staging environment.""",
        "cicd_files/dsl/pipeline_jobs/StagingTests.groovy",
        "cicd_files/jenkins/files/pipeline_jobs/StagingTests.Jenkinsfile"))
    keepDependencies(false)
    parameters {
        stringParam(commonParams.slave())
        stringParam(externalParams.numberOfUser())
        stringParam(externalParams.duration())
    }
    definition {
        cpsScm {
            scm {
                git {
                    branch('master')
                        remote {
                            name('gcn')
                            url(commonParams.repoUrl())
                        }
                        extensions {
                            cleanBeforeCheckout()
                            localBranch 'master'
                        }
                }
            }
            scriptPath('cicd_files/jenkins/files/pipeline_jobs/StagingTests.Jenkinsfile')
        }
    }
    quietPeriod(5)
    disabled(false)
}
