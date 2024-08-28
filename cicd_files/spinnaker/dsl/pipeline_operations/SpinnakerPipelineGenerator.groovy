import common_classes.CommonSteps
import common_classes.CommonParameters

CommonSteps commonSteps = new CommonSteps()
CommonParameters commonParams = new CommonParameters()


def pipelineBeingGeneratedName = 'resource-pooling-tool_Spinnaker_Pipeline_Generator'

pipelineJob(pipelineBeingGeneratedName) {

    description(commonSteps.defaultJobDescription(pipelineBeingGeneratedName,
        """The ${pipelineBeingGeneratedName} job is used for the initial generation of Spinnaker
        pipeline updater jobs""",
        "cicd_files/spinnaker/dsl/pipeline_operations/SpinnakerPipelineGenerator.groovy",
        "cicd_files/spinnaker/jenkins/files/pipeline_operations/SpinnakerPipelineGenerator.Jenkinsfile"
        ))

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
            scriptPath('cicd_files/spinnaker/jenkins/files/pipeline_operations/SpinnakerPipelineGenerator.Jenkinsfile')
        }
    }
}
