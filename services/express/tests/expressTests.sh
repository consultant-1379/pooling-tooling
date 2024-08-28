#!/bin/sh

run_eslint_on_express_files() {
    echo "*****************************************"
    echo "*       Express : Running ESLINT        *"
    echo "*****************************************"
    echo -e "\n"
    echo "COMMAND: npm run lint"
    npm run lint
    if [ "$?" -ne 0 ]; then
        echo "============================================================"
        echo "ERROR : The ESLint for the changed express files has errors."
        echo "============================================================"
        echo -e "\n"
        exit 1
    else
        echo "================================"
        echo "SUCCESS : No ESLint errors found"
        echo "================================"
        echo -e "\n"
    fi
}

run_unit_testcases() {
    npm run cover:unit > unit_test_output.txt &
    unit_test_process_id="$!"
}

run_integration_testcases() {
    npm run cover:integration > integration_test_output.txt &
    integration_test_process_id="$!"
}

run_contract_testcases() {
    npm run test-contract > contract_test_output.txt &
    contract_test_process_id="$!"
}

print_unit_and_integration_and_contract_output() {
    echo "======== Unit Tests ========"
    cat unit_test_output.txt
    echo -e "\n"
    echo "======== Integration Tests ========"
    cat integration_test_output.txt
    echo -e "\n"
    echo "======== Contract Tests ========"
    cat contract_test_output.txt
    echo -e "\n"
}

check_unit_or_integration_or_contract_exit_code() {
    type_of_test="${1}"
    test_exit_code=${2}
    if [[ ${test_exit_code} -ne 0 ]]; then
        echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        echo "ERROR : The express ${type_of_test} tests have failed "
        echo "++++++++++++++++++++++++++++++++++++++++++++++++++++++"
        exit 1
    else
        echo "==========================================================="
        echo "SUCCESS : All the express ${type_of_test} tests have passed"
        echo "==========================================================="
    fi
    echo -e "\n"
}


run_unit_and_integration_and_contract_testcases_with_coverage() {
    echo "*******************************************************************"
    echo "*     Express : Running Unit, Integration and Contract tests      *"
    echo "*******************************************************************"
    echo -e "\n"
    run_unit_testcases
    wait ${unit_test_process_id} || unit_test_exit_code=$?
    run_integration_testcases
    wait ${integration_test_process_id} || integration_test_exit_code=$?
    npm run cover:merge
    rm -rf .nyc_output/*
    cp coverage.json .nyc_output
    npm run cover:report
    run_contract_testcases
    wait ${contract_test_process_id} || contract_test_exit_code=$?
    print_unit_and_integration_and_contract_output
    check_unit_or_integration_or_contract_exit_code "unit" ${unit_test_exit_code}
    check_unit_or_integration_or_contract_exit_code "integration" ${integration_test_exit_code}
    check_unit_or_integration_or_contract_exit_code "contract" ${contract_test_exit_code}
}

execute_test_cleanup() {
    echo "==========================================================================="
    echo "Cleaning up output files created as part of unit/integration/contract tests"
    echo "==========================================================================="
    rm -rf unit_test_output.txt
    rm -rf integration_test_output.txt
    rm -rf contract_test_output.txt
    echo -e "\n"
}

########################
#     SCRIPT START     #
########################
run_eslint_on_express_files
run_unit_and_integration_and_contract_testcases_with_coverage
execute_test_cleanup
