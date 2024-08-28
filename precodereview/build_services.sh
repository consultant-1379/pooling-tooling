#!/bin/bash

PROJECT_NAME=$1

function build_services() {
    echo "************************************"
    echo "*        Building Services         *"
    echo "************************************"
    echo "COMMAND: time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml build"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml build
    if [[ $? -ne 0 ]]; then
        echo "====================================="
        echo "ERROR : Docker Images failed to build"
        echo "====================================="
        exit 1
    fi
    echo "COMMAND: time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml up -d --force-recreate"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml up -d --force-recreate
    if [[ $? -ne 0 ]]; then
        echo "======================================="
        echo "ERROR : Docker Services failed to start"
        echo "======================================="
        exit 1
    fi
}

########################
#     SCRIPT START     #
########################

build_services
