Feature: Property view test

  I want to test if the view button on the 'Properties' column work

  Scenario: Test environment has all properties
    Given I click the 'view' button on 1 element
    Then I check if table head has correct colour
    Then I check if all columns have data

  Scenario: Test environment is missing 'From State' property
    Given I click the 'view' button on 2 element
    Then I check if table head has correct colour
    Then I check if all columns have data except 'From State'
