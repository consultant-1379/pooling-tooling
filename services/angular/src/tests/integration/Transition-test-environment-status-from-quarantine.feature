Feature: Test transitions for environments going from Quarantine

    I want to change the state of a test environment from Quarantine

    Scenario: Set the status from Quarantine to Standby
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Quarantine" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/test-environments/*" by clicking the button "Set Test Environment To Standby"
      And I check if the status of the test environment has changed to "Standby"
      And the additional info column should display "Set Standby by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Standby by"

    Scenario: Set the status from Quarantine to Available
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Quarantine" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/ui-functions/test-environment-from-quarantined-to-available/*" by clicking the button "Set Test Environment To Available"
      And I check if the status of the test environment has changed to "Available"
      And the additional info column should display "Set Available by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Available by"

    Scenario: Set the status from Quarantine to Reserved
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Quarantine" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/ui-functions/test-environment-from-quarantined-to-reserved/*" by clicking the button "Set Test Environment To Reserved"
      And I check if the status of the test environment has changed to "Reserved"
      And the additional info column should display "Set Reserved by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Reserved by"
