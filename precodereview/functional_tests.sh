#!/bin/bash

TEST_HOST=$1

function run_functional_tests() {
    echo "*****************************************"
    echo "*       Running Functional tests        *"
    echo "*****************************************"
    echo -e "\n"
    echo "time docker run --env TEST_HOST=${TEST_HOST} --rm -v ${PWD}/k6_tests:/functional_tests --network=\"host\" -i armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/grafana/k6 run /functional_tests/rpt-functional-tests.js --insecure-skip-tls-verify"
    time docker run --env TEST_HOST=${TEST_HOST} --rm -v ${PWD}/k6_tests:/functional_tests --network="host" -i armdocker.rnd.ericsson.se/dockerhub-ericsson-remote/grafana/k6 run /functional_tests/rpt-functional-tests.js --insecure-skip-tls-verify
    if [[ $? -ne 0 ]]; then
        echo "========================================"
        echo "ERROR : The Functional tests have failed"
        echo "========================================"
        exit 1
    else
        echo "=============================================="
        echo "SUCCESS : All the Functional tests have passed"
        echo "=============================================="
    fi
}

########################
#     SCRIPT START     #
########################

run_functional_tests