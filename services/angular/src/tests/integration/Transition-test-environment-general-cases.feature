Feature: Test general transitions for environments such as failures etc

    Scenario: Change the status of the test environment from Available to Quarantine but it fails due to an express error
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Available" on the test-environments page
      And I mock the response from changing the status of the test environment to Quarantine but instead, I throw an error
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Unable to quarantine test environment Test. Failed with error"

    Scenario: Change the status of the test environment but it fails, as the test environment has been changed since the user made the request to change
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Available" on the test-environments page
      And I mock the response from changing the status of the test environment to Quarantine by changing the modifiedOn of the retrieved test environment
      Then a snackbar with the class ".custom-snackbar-class" appears which says "ERROR: Unable to quarantine test environment as the test environment has been updated since you opened page."
