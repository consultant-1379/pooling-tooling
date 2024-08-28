#!/bin/bash

PROJECT_NAME=$1

function run_angular_tests() {
    echo "*****************************************"
    echo "*        Running Angular tests          *"
    echo "*****************************************"
    echo -e "\n"

    echo "COMMAND: time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run angular_client /bin/sh src/tests/angularTests.sh --force-recreate"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run angular_client /bin/sh src/tests/angularTests.sh --force-recreate

    if [[ $? -ne 0 ]]; then
        echo "====================================="
        echo "ERROR : The Angular tests have failed"
        echo "====================================="
        exit 1
    fi

    echo "COMMAND: time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run -u 7373585:16019 angular_client /bin/sh src/tests/transferAngularTestReport.sh"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run -u "7373585:16019" angular_client /bin/sh src/tests/transferAngularTestReport.sh

    if [[ $? -ne 0 ]]; then
        echo "====================================="
        echo "ERROR : The Angular tests have failed"
        echo "====================================="
        exit 1
    else
        echo "==========================================="
        echo "SUCCESS : All the Angular tests have passed"
        echo "==========================================="
    fi
}

########################
#     SCRIPT START     #
########################

run_angular_tests
