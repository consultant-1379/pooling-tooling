Feature: Test transitions for environments going from Refreshing

    Scenario: Set the status from Refreshing to Standby
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Refreshing" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/test-environments/*" by clicking the button "Set Test Environment To Standby"
      And I check if the status of the test environment has changed to "Standby"
      And the additional info column should display "Set Standby by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Standby by"
