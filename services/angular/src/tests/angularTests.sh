#!/bin/sh

readonly DISPLAY_NUM=81
XVFB_PID=""

run_eslint_on_angular_files() {
    echo "*****************************************"
    echo "*       Angular : Running ESLINT        *"
    echo "*****************************************"
    echo -e "\n"
    echo "COMMAND: npm run lint"
    npm run lint
    if [ "$?" -ne 0 ]; then
        echo "===================================================="
        echo "ERROR : The ESLint for the angular files has errors "
        echo "===================================================="
        echo -e "\n"
        exit 1
    else
        echo "================================="
        echo "SUCCESS : No ESLint errors found "
        echo "================================="
        echo -e "\n"
    fi
}

run_stylelint_on_angular_files() {
    echo "*****************************************"
    echo "*       Angular : Running STYLELINT     *"
    echo "*****************************************"
    echo -e "\n"
    echo "COMMAND: npm run css-lint"
    npm run css-lint
    if [ "$?" -ne 0 ]; then
        echo "======================================================="
        echo "ERROR : The Stylelint for the angular files has errors "
        echo "======================================================="
        echo -e "\n"
        exit 1
    else
        echo "===================================="
        echo "SUCCESS : No Stylelint errors found "
        echo "===================================="
        echo -e "\n"
    fi
}

start_x_virtual_frame_buffer() {
    echo "Starting X Virtual Frame Buffer on display :${DISPLAY_NUM}..."
    Xvfb :${DISPLAY_NUM} -screen 0 1024x768x24 &
    XVFB_PID=$!
}

kill_x_virtual_frame_buffer_process_id() {
    if [[ -n "$XVFB_PID" ]]; then
        echo "Killing X Virtual Frame Buffer process with PID: $XVFB_PID"
        kill -9 $XVFB_PID
    fi
}

run_cypress_testcases() {
    log_info "Running Integration tests"
    start_x_virtual_frame_buffer
    trap kill_x_virtual_frame_buffer_process_id EXIT
    echo "COMMAND: DISPLAY=:${DISPLAY_NUM} npm run cy:run:dev:${DISPLAY_NUM} --env coverage=true"
    DISPLAY=:${DISPLAY_NUM} npm run cy:run:dev:${DISPLAY_NUM} --env coverage=true &
    CYPRESS_TEST_PID=$!
    wait $CYPRESS_TEST_PID
    CYPRESS_TEST_STATUS=$?
    trap - EXIT
    kill_x_virtual_frame_buffer_process_id
    if [ "$CYPRESS_TEST_STATUS" -ne 0 ]; then
        log_error "The angular integration tests have failed"
        return 1
    else
        log_success "All the angular integration tests have passed"
        return 0
    fi
}


########################
#     SCRIPT START     #
########################
run_eslint_on_angular_files
run_stylelint_on_angular_files
run_cypress_testcases
