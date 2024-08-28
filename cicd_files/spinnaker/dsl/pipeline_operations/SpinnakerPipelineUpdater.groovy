import common_classes.CommonSteps
import common_classes.CommonParameters

CommonSteps commonSteps = new CommonSteps()
CommonParameters commonParams = new CommonParameters()


def pipelineBeingGeneratedName = 'resource-pooling-tool_Spinnaker_Pipeline_Updater'

pipelineJob(pipelineBeingGeneratedName) {

    description(commonSteps.defaultJobDescription(pipelineBeingGeneratedName,
        """The ${pipelineBeingGeneratedName} job is used to regenerate the Spinnaker pipeline updater
        job (from DSL), and then run it (regenerating the Spinnaker pipeline based on json stored in the repo).""",
        "cicd_files/spinnaker/dsl/pipeline_operations/SpinnakerPipelineUpdater.groovy",
        "cicd_files/spinnaker/jenkins/files/pipeline_operations/SpinnakerPipelineUpdater.Jenkinsfile"))

    parameters {
        stringParam(commonParams.slave())
    }

    logRotator(commonSteps.defaultLogRotatorValues())

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
            scriptPath('cicd_files/spinnaker/jenkins/files/pipeline_operations/SpinnakerPipelineUpdater.Jenkinsfile')
        }
    }
}
