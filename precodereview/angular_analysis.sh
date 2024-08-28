#!/bin/bash

PROJECT_NAME=$1

function run_angular_analysis() {
    echo "********************************************"
    echo "*        Running Angular Analysis          *"
    echo "********************************************"
    echo -e "\n"
    echo "COMMAND: time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run angular_sonar_scanner /bin/sh src/tests/regenerateCodeCoverageReport.sh &&"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run angular_sonar_scanner /bin/sh src/tests/regenerateCodeCoverageReport.sh &&
    echo "COMMAND: time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run angular_sonar_scanner &&"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run angular_sonar_scanner &&
    echo "COMMAND: time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run -u 7373585:16019 angular_sonar_scanner /bin/sh src/tests/transferAngularAnalysisReport.sh"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml run -u "7373585:16019" angular_sonar_scanner /bin/sh src/tests/transferAngularAnalysisReport.sh
    if [[ $? -ne 0 ]]; then
        echo "======================================"
        echo "ERROR : The Angular analysis has failed"
        echo "======================================"
        exit 1
    else
        echo "========================================="
        echo "SUCCESS : Angular analysis was successful"
        echo "========================================="
    fi
}

########################
#     SCRIPT START     #
########################

run_angular_analysis
