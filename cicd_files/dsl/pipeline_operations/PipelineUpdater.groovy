import common_classes.CommonSteps
import common_classes.CommonParameters

CommonSteps commonSteps = new CommonSteps()
CommonParameters commonParams = new CommonParameters()

def pipelineBeingGeneratedName = 'resource-pooling-tool_Pipeline_Updater'

pipelineJob(pipelineBeingGeneratedName) {
    description(commonSteps.defaultJobDescription(pipelineBeingGeneratedName,
        """The ${pipelineBeingGeneratedName} job is used to update an already generated RPT CICD pipeline
based on the changes to the master branch on gerrit.""",
        "cicd_files/dsl/pipeline_operations/PipelineUpdater.groovy",
        "cicd_files/jenkins/files/pipeline_operations/PipelineUpdater.Jenkinsfile"))
    parameters {
        stringParam(commonParams.slave())
    }

    logRotator(commonSteps.defaultLogRotatorValues())

    triggers {
        gerrit {
            project(commonParams.repo(), 'master')
            events {
                changeMerged()
            }
        }
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
            scriptPath('cicd_files/jenkins/files/pipeline_operations/PipelineUpdater.Jenkinsfile')
        }
    }
}
