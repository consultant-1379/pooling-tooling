#!/bin/bash

PROJECT_NAME=$1

function run_express_analysis() {
    echo "********************************************"
    echo "*        Running Express Analysis          *"
    echo "********************************************"
    echo -e "\n"
    echo "COMMAND: time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run express_sonar_scanner &&"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run express_sonar_scanner &&
    echo "COMMAND: time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run -u 7373585:16019 express_sonar_scanner /bin/sh tests/transferExpressAnalysisReport.sh"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run -u "7373585:16019" express_sonar_scanner /bin/sh tests/transferExpressAnalysisReport.sh
    if [[ $? -ne 0 ]]; then
        echo "======================================"
        echo "ERROR : The Express analysis has failed"
        echo "======================================"
        exit 1
    else
        echo "========================================="
        echo "SUCCESS : Express analysis was successful"
        echo "========================================="
    fi
}

########################
#     SCRIPT START     #
########################

run_express_analysis