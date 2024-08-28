package common_classes

class CommonParameters {

    static List slave(String defaultValue='GridEngine') {
        return ['SLAVE', defaultValue, 'Slave to run the job against.']
    }

    static String repo() {
        return 'OSS/com.ericsson.oss.ci/pooling-tooling'
    }

    static String repoUrl() {
        return '\${GERRIT_MIRROR}/' + repo()
    }

    static List namespace() {
        return ['NAMESPACE',
                ['sandbox-1', 'sandbox-2',
                'sandbox-3', 'sandbox-4',
                'sandbox-5', 'sandbox-6',
                'sandbox-7', 'sandbox-8'],
                 'Namespace you want to deploy to. Also used as sandbox hostname I.e. (NAMESPACE).olah023.rnd.gic.ericsson.se.']
    }

    static List refspec(String defaultValue='HEAD:refs/for/master') {
        return ['REFSPEC', defaultValue,
            'Can be used to fetch changes from branch (refs/heads/master) or commit (refs/changes/95/156395/1) | 95 - last 2 digits of Gerrit commit number | 156395 - is Gerrit commit number | 1 - patch number of gerrit commit']
    }
    static List jiraId() {
        return ['JIRA_ID', '', 'Jira Ticket ID, e.g. IDUN-12345.']
    }

}
