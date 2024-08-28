import common_classes.CommonSteps
import common_classes.CommonParameters

CommonSteps commonSteps = new CommonSteps()
CommonParameters commonParams = new CommonParameters()

def pipelineBeingGeneratedName = 'resource-pooling-tool_Create_Sandbox'

pipelineJob(pipelineBeingGeneratedName) {
    description(commonSteps.defaultJobDescription(pipelineBeingGeneratedName,
        """The ${pipelineBeingGeneratedName} job Creates a Sandbox.
            <br/> Job documentation can be found at <a
            href='https://confluence-oss.seli.wh.rnd.internal.ericsson.com/x/AhutGw'>
            Kubernetes Sandboxing</a>""",
        'cicd_files/dsl/sandbox_operations/CreateSandbox.groovy',
        'cicd_files/jenkins/files/sandbox_operations/CreateSandbox.Jenkinsfile'))
    parameters {
        stringParam(commonParams.slave())
        stringParam(commonParams.jiraId())
        choiceParam(commonParams.namespace())
        stringParam(commonParams.refspec())
        booleanParam('DEPLOY_SWAGGER', false, 'Check to enable deployment of Swagger.')
        booleanParam('DELETE_MONGO_DB', true, 'Check to delete mongo db in sandbox.')
    }

    logRotator(commonSteps.defaultLogRotatorValues())

    disabled(false)
    keepDependencies(false)

    definition {
        cpsScm {
            scm {
                git {
                    branch('master')
                        remote {
                            name('gcn')
                            url(commonParams.repoUrl())
                            refspec('\${REFSPEC}')
                        }
                        extensions {
                            choosingStrategy {
                                gerritTrigger()
                            }
                        }
                }
            }
            scriptPath('cicd_files/jenkins/files/sandbox_operations/CreateSandbox.Jenkinsfile')
        }
    }
}
