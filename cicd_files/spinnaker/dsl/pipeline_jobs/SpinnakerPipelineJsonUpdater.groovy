import common_classes.CommonSteps
import common_classes.CommonParameters

CommonSteps commonSteps = new CommonSteps()
CommonParameters commonParams = new CommonParameters()


def pipelineBeingGeneratedName = 'resource-pooling-tool_Spinnaker_Pipeline_JSON_Updater'

pipelineJob(pipelineBeingGeneratedName) {

    description(commonSteps.defaultJobDescription(pipelineBeingGeneratedName,
        """The ${pipelineBeingGeneratedName} job is used to regenerate an existing RPT Spinnaker
        pipeline, based on json stored in the repo.""",
        "cicd_files/spinnaker/dsl/pipeline_jobs/SpinnakerPipelineJsonUpdater.groovy",
        "cicd_files/spinnaker/jenkins/files/pipeline_jobs/SpinnakerPipelineJsonUpdater.Jenkinsfile"))

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
            scriptPath('cicd_files/spinnaker/jenkins/files/pipeline_jobs/SpinnakerPipelineJsonUpdater.Jenkinsfile')
        }
    }
}
