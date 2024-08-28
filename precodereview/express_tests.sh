#!/bin/bash

PROJECT_NAME=$1

function run_express_tests() {
    echo "*****************************************"
    echo "*        Running Express tests          *"
    echo "*****************************************"
    echo -e "\n"
    echo "COMMAND: time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run express_client /bin/sh tests/expressTests.sh --force-recreate"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run express_client /bin/sh tests/expressTests.sh --force-recreate
    if [[ $? -ne 0 ]]; then
        echo "====================================="
        echo "ERROR : The Express tests have failed"
        echo "====================================="
        exit 1
    else
        echo "==========================================="
        echo "SUCCESS : All the Express tests have passed"
        echo "==========================================="
    fi
}

########################
#     SCRIPT START     #
########################

run_express_tests