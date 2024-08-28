Feature: Admin test environment CRUD

    I want to add, edit and remove a test environment

    Scenario: Adding a test environment successfully
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the ".add-environment" button
      And I choose test_pool as the pool
      And I type "test" for each form field in the "add" test environment form, then verify each field says "test"
      And I click the ".confirm" button
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment Added: test_env"

    Scenario: Adding a test environment which already exists
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the ".add-environment" button
      Then a mat dialog with the class ".mat-dialog-content" appears which says "Test Environment test_env already exists in RPT"

    Scenario: Editing a test environment successfully
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the ".edit-environment" button
      And I type "_edited" for each form field in the "edit" test environment form, then verify each field says "test_edited"
      And I click the ".confirm" button
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment Updated: test_env"

    Scenario: Editing a test environment which does not exist
      Given I open the page "/#/admin/test-environments"
      When I type "te_which_does_not_exist" as the test environment name
      And I click the ".edit-environment" button
      Then a mat dialog with the class ".mat-dialog-content" appears which says "Test Environment te_which_does_not_exist does not exist in RPT"

    Scenario: Ensure removing a test environment that fails due to a server side error is handled correctly
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the ".remove-environment" button
      And I type "test_env" to confirm
      And I click the button ".confirm-button" that mocks a "DELETE" rest call to "/api/test-environments/*" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "Could not delete Test Environment: Http failure response for"

    Scenario: Ensure removing a test environment that fails as it can not get information about the appropriate test environment is handled correctly
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the button ".remove-environment" that mocks a "GET" rest call to "/api/test-environments/name/*" with the error "A generic error message from express." where the second request fails
      Then a snackbar with the class ".error-snackbar-class" appears which says "An internal error has occurred and the test environment details could not be retrieved: Http failure response for"

    Scenario: Ensure failing to get available pools while editing a test environment is handled correctly
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the button ".edit-environment" that mocks a "GET" rest call to "/api/pools" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "Failed to retrieve available pools: Http failure response for"

    Scenario: Ensure failing to get test environment by name when editing a test environment is handled correctly
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the button ".edit-environment" that mocks a "GET" rest call to "/api/test-environments/name/*" with the error "A generic error message from express." where the second request fails
      Then a snackbar with the class ".error-snackbar-class" appears which says "An internal error has occurred and the test environment details could not be retrieved: Http failure response for"

    Scenario: Ensure failing to PATCH test environment is handled correctly
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the ".edit-environment" button
      And I type "_edited" for each form field in the "edit" test environment form, then verify each field says "test_edited_edited"
      And I click the button ".confirm" that mocks a "PATCH" rest call to "/api/test-environments/*" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "ERROR: Failed to edit the Test Environment test_env: Http failure response for"

    Scenario: Removing a test environment successfully
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the ".remove-environment" button
      And I type "test_env" to confirm
      And I click the ".confirm-button" button
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment deleted: test_env"

    Scenario: Ensure removing a test environment which does not exist is handled correctly
      Given I open the page "/#/admin/test-environments"
      When I type "te_which_does_not_exist" as the test environment name
      And I click the ".remove-environment" button
      Then a mat dialog with the class ".mat-dialog-content" appears which says "Test Environment te_which_does_not_exist does not exist in RPT"

    Scenario: Ensure failing to get available pools when adding a test environment is handled correctly
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the button ".add-environment" that mocks a "GET" rest call to "/api/pools" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "Failed to retrieve available pools: Http failure response for"

    Scenario: Ensure failing to post the pool to express when adding a test environment is handled correctly
      Given I open the page "/#/admin/test-environments"
      When I type "test_env" as the test environment name
      And I click the ".add-environment" button
      And I choose test_pool as the pool
      And I type "test" for each form field in the "add" test environment form, then verify each field says "test"
      And I click the button ".confirm" that mocks a "POST" rest call to "/api/test-environments/" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "ERROR: Failed to add the Test Environment test_env: Http failure response for"

    Scenario: Ensure editing a test environment which is updated while modal is open is handled correctly
      Given I open the page "/#/admin/test-environments"
      When I type "test-env-cypress" as the test environment name
      And I click the ".edit-environment" button
      And an update event is detected for the environment
      Then a snackbar with the class ".socket-snackbar-class" appears which says "Properties of Test Environment test-env-cypress have been updated since modal opened! Please try editing Test Environment again.X"
      Then a mat dialog with the class ".mat-dialog-container" closes
