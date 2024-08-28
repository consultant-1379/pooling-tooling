Feature: Test transitions for environments going from Reserved

    Scenario: Set the status from Reserved to Available
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Reserved" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/ui-functions/test-environment-from-reserved-to-available/*" by clicking the button "Set Test Environment To Available"
      And I check if the status of the test environment has changed to "Available"
      And the additional info column should display "Set Available by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Available by"

    Scenario: Set the status from Reserved to Quarantine
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Reserved" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/ui-functions/test-environment-from-reserved-to-quarantined/*" by clicking the button "Set Test Environment To Quarantine"
      And I check if the status of the test environment has changed to "Quarantine"
      And the additional info column should display "Set Quarantine by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Quarantine by"

    Scenario: Set the status from Reserved to Standby
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Reserved" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/test-environments/*" by clicking the button "Set Test Environment To Standby"
      And I check if the status of the test environment has changed to "Standby"
      And the additional info column should display "Set Standby by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Standby by"
