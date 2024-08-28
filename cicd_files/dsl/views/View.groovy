sectionedView('Resource Pooling Tool CICD') {
    description("""<div style="padding:1em;border-radius:1em;text-align:center;background:#fbf6e1;box-shadow:0 0.1em 0.3em #525000">
        <b>Resource Pooling Tool</b><br>
       CICD Pipelines, Source Control Jobs as well as Staging jobs.<br><br>
        Team: <b>Thunderbee &#x26A1</b><br>
    </div>""")
    sections {
        listView() {
            name('RPT CICD Pipelines')
            jobs {
                name('resource-pooling-tool_Pre_Code_Review')
                name('resource-pooling-tool_Build_And_Publish')
                name('resource-pooling-tool_Staging_Tests')
                name('resource-pooling-tool_Staging_Load_Test')
            }
            columns setViewColumns()
        }
        listView() {
            name('RPT CICD Pipeline Source Control')
            jobs {
                name('resource-pooling-tool_Pipeline_Generator')
                name('resource-pooling-tool_Pipeline_Updater')
            }
            columns setViewColumns()
        }
        listView() {
            name('RPT Spinnaker Pipeline Source Control')
            jobs {
                name('resource-pooling-tool_Spinnaker_Pipeline_Generator')
                name('resource-pooling-tool_Spinnaker_Pipeline_JSON_Updater')
                name('resource-pooling-tool_Spinnaker_Pipeline_Updater')
            }
            columns setViewColumns()
        }
        listView() {
            name('RPT Sandbox Operations')
            jobs {
                name('resource-pooling-tool_Create_Sandbox')
            }
            columns setViewColumns()
        }
    }
}

static Object setViewColumns() {
    return {
        status()
        weather()
        name()
        lastSuccess()
        lastFailure()
        lastDuration()
        buildButton()
    }
}
