Feature: Test transitions for environments going from Standby

    I want to change the state of a test environment from Standby

    Scenario: Set the status from Standby to Quarantine
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Standby" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/ui-functions/test-environment-from-standby-to-quarantine/*" by clicking the button "Set Test Environment To Quarantine"
      And I check if the status of the test environment has changed to "Quarantine"
      And the additional info column should display "Set Quarantine by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Quarantine by"

    Scenario: Set the status from Standby to Refreshing
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Standby" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/ui-functions/test-environment-from-standby-to-refreshing/*" by clicking the button "Set Test Environment To Refreshing"
      And I check if the status of the test environment has changed to "Refreshing"
      And the additional info column should display "Set Refreshing by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Refreshing by"

    Scenario: Set the status from Standby to Reserved
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Standby" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/ui-functions/test-environment-from-standby-to-reserved/*" by clicking the button "Set Test Environment To Reserved"
      And I check if the status of the test environment has changed to "Reserved"
      And the additional info column should display "Set Reserved by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Reserved by"

    Scenario: Set the status from Standby to Available
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Standby" on the test-environments page
      And I change the status of the test environment using the endpoint "/api/ui-functions/test-environment-from-standby-to-available/*" by clicking the button "Set Test Environment To Available"
      And I check if the status of the test environment has changed to "Available"
      And the additional info column should display "Set Available by cypressTest"
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Test Environment status set to Available by"
