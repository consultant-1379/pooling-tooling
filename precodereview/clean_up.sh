#!/bin/bash

PROJECT_NAME=$1
SLEEP_DURATION=5

function compose_down_project() {
    echo "INFO: Shutting down docker-compose project..."
    echo "COMMAND: time docker-compose -p ${PROJECT_NAME} -f docker-compose-precodereview.yml down --remove-orphans -v"
    time docker-compose -p "${PROJECT_NAME}" -f docker-compose-precodereview.yml down --remove-orphans -v
}

function remove_containers() {
    local containers=$(docker ps -a --format "{{.ID}} {{.Names}}" | grep "${PROJECT_NAME}_")
    echo "INFO: Removing containers [$containers]"
    if [[ -n "$containers" ]]; then
        echo "COMMAND: time docker rm -f $(echo $containers | awk '{print $1}')"
        time docker rm -f $(echo $containers | awk '{print $1}')
    fi
}

function remove_images() {
    echo "INFO: Removing images..."
    for attempt in {1..3}
    do
        echo "INFO: Attempt $attempt to remove images..."
        IMAGE_IDS=$(docker images | grep "${PROJECT_NAME}_" | awk '{print $3}')
        if [[ -n "$IMAGE_IDS" ]]; then
            echo "COMMAND: time docker rmi -f $IMAGE_IDS"
            if time docker rmi -f $IMAGE_IDS; then
                echo "INFO: Images removed successfully."
                break
            else
                echo "WARNING: Failed to remove images. Retrying in $SLEEP_DURATION seconds..."
                sleep $SLEEP_DURATION
            fi
        else
            echo "INFO: No images to remove."
            break
        fi
    done
}

function remove_volumes() {
    local volumes=$(docker volume ls -q | grep "${PROJECT_NAME}_")
    echo "INFO: Removing volumes [$volumes]"
    if [[ -n "$volumes" ]]; then
        echo "COMMAND: time docker volume rm $volumes"
        time docker volume rm $volumes
    fi
}

function remove_networks() {
    local networks=$(docker network ls -q | grep "${PROJECT_NAME}_")
    echo "INFO: Removing networks [$networks]"
    if [[ -n "$networks" ]]; then
        echo "COMMAND: time docker network rm $networks"
        time docker network rm $networks
    fi
}


function verify_cleanup() {
    echo "Verifying cleanup..."
    local warn_flag=0

    if docker ps -a --format "{{.Names}}" | grep -q "${PROJECT_NAME}_"; then
        echo "WARNING: Some containers related to "${PROJECT_NAME}" are still running."
        warn_flag=1
    fi

    if docker images | grep -q "${PROJECT_NAME}_"; then
        echo "WARNING: Some images related to "${PROJECT_NAME}" are still present."
        warn_flag=1
    fi

    if docker volume ls -q | grep -q "${PROJECT_NAME}_"; then
        echo "WARNING: Some volumes related to "${PROJECT_NAME}" are still present."
        warn_flag=1
    fi

    if docker network ls -q | grep -q "${PROJECT_NAME}_"; then
        echo "WARNING: Some networks related to "${PROJECT_NAME}" are still present."
        warn_flag=1
    fi

    echo "Verification complete."
    return $warn_flag
}


########################
#     SCRIPT START     #
########################

function clean_up() {
    echo "INFO: Starting the clean-up process..."
    echo "INFO: Running verify_cleanup to log any containers, images. volumes, or networks are present before the clean up is run"
    verify_cleanup || true
    echo "INFO: Running compose_down_project..."
    compose_down_project
    echo "INFO: Running remove_containers..."
    remove_containers
    echo "INFO: Running remove_images..."
    remove_images
    echo "INFO: Running remove_volumes..."
    remove_volumes
    echo "INFO: Running remove_networks..."
    remove_networks
    echo "INFO: Running verify_cleanup..."
    if verify_cleanup; then
        echo "======================================="
        echo "SUCCESS : Clean up complete"
        echo "======================================="
    else
        echo "======================================="
        echo "ERROR : Clean up failed"
        echo "======================================="
        exit 1
    fi
}


########################
#     SCRIPT START     #
########################

clean_up
