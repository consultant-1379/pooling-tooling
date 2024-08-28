import common_classes.CommonSteps
import common_classes.CommonParameters

CommonSteps commonSteps = new CommonSteps()
CommonParameters commonParams = new CommonParameters()

def pipelineBeingGeneratedName = 'resource-pooling-tool_Build_And_Publish'

pipelineJob(pipelineBeingGeneratedName) {
    description(commonSteps.defaultJobDescription(pipelineBeingGeneratedName,
        """The ${pipelineBeingGeneratedName} job packages the pooling tooling helm chart.
        It then publishes the package to the armdocker JFrog artifactory""",
        "cicd_files/dsl/pipeline_jobs/BuildAndPublish.groovy",
        "cicd_files/jenkins/files/pipeline_jobs/BuildAndPublish.Jenkinsfile"))
    keepDependencies(false)
    parameters {
        stringParam(commonParams.slave())
    }
    blockOn('''resource-pooling-tool_Pre_Code_Review
resource-pooling-tool_Pipeline_Updater''', {
        blockLevel('GLOBAL')
        scanQueueFor('DISABLED')
    })

    definition {
        cpsScm {
            scm {
                git {
                    remote {
                        name('gcn')
                        url(commonParams.repoUrl())
                    }
                    branch('master')
                }
            }
            scriptPath('cicd_files/jenkins/files/pipeline_jobs/BuildAndPublish.Jenkinsfile')
        }
    }

    quietPeriod(5)
    disabled(false)
}
