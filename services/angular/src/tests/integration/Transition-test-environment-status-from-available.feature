Feature: Test transitions for environments going from Available

    Scenario: Set the status from Available to Reserved
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Available" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/ui-functions/test-environment-from-available-to-reserved/*" by clicking the button "Set Test Environment To Reserved"
      And I check if the status of the test environment has changed to "Reserved"
      And the additional info column should display "Set Reserved by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Reserved by"

    Scenario: Set the status from Available to Quarantine
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Available" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/test-environments/*" by clicking the button "Set Test Environment To Quarantine"
      And I check if the status of the test environment has changed to "Quarantine"
      And the additional info column should display "Set Quarantine by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Quarantine by"

    Scenario: Set the status from Available to Standby
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Available" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/test-environments/*" by clicking the button "Set Test Environment To Standby"
      And I check if the status of the test environment has changed to "Standby"
      And the additional info column should display "Set Standby by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Standby by"
