#!/bin/bash

NUMBER_OF_USER=${1}
DURATION=${2}

function run_nonfunctional_tests() {
    echo "*****************************************"
    echo "*      Running Non-Functional tests     *"
    echo "*****************************************"
    echo -e "\n"
    echo "time docker run --env TEST_HOST=rpt-staging.ews.gic.ericsson.se --rm -v ${PWD}/k6_tests:/non-functional_tests -i armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/grafana/k6 run -d ${DURATION} -u ${NUMBER_OF_USER} /non-functional_tests/rpt-non-functional-tests.js --insecure-skip-tls-verify"
    time docker run --env TEST_HOST=rpt-staging.ews.gic.ericsson.se --rm -v ${PWD}/k6_tests:/non-functional_tests -i armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/grafana/k6 run -d ${DURATION} -u ${NUMBER_OF_USER} /non-functional_tests/rpt-non-functional-tests.js --insecure-skip-tls-verify
    if [[ $? -ne 0 ]]; then
        echo "============================================"
        echo "ERROR : The Non-Functional tests have failed"
        echo "============================================"
        exit 1
    else
        echo "=================================================="
        echo "SUCCESS : All the Non-Functional tests have passed"
        echo "=================================================="
    fi
}

########################
#     SCRIPT START     #
########################
run_nonfunctional_tests
