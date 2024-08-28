Feature: Tests the functions of test environments comments

    Scenario: Once I click editTextArea button, things change
      Given I open the page "/#/test-environments"
      When I click the edit comments button
      And I type "test text" into the comments input
      Then I ensure the test environment in the database has the comments of "test text"

    Scenario: Once I click undo button, things change
      Given I open the page "/#/test-environments"
      When I click the edit comments button
      And I type "test text" into the comments input
      And I click the confirm button to save the comments
      When I click the edit comments button
      And I type "test text second" into the comments input
      And I click the undo changes to comments
      Then I ensure the comments was not updated and is instead reverted to "test text"

    Scenario: Once I click undo button, things change
      Given I open the page "/#/test-environments"
      When I click the edit comments button
      And I type a multi-line string into the input
      And I click the confirm button to save the comments
      Then I ensure the height of the comments is "lessThan" 26
      When I click the resize text area button
      Then I ensure the height of the comments is "greaterThan" 80
      When I click the button to downsize the expanded text area
      Then I ensure the height of the comments is "lessThan" 26

    Scenario: Once I click undo button, things change
      Given I open the page "/#/test-environments"
      When I check if the test environment status is set to "Available" on the test-environments page
      And I click the edit comments button
      And I type "test text" into the comments input
      And I click the confirm button to save the comments
      And I change the status of the test environment using the endpoint "/api/ui-functions/test-environment-from-available-to-reserved/*" by clicking the button "Set Test Environment To Reserved"
      And I check if the status of the test environment has changed to "Reserved"
      And the comments column should display "test text"
