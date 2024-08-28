Feature: Footer display test

  I want to test if the footer is being displayed correctly

  Scenario Outline: Footer is displayed correctly
    Given I open <page>
    Then I check if the footer has correct background colour
    Then I check if the footer has a height of 48px
    Then I check if the footer contains the text Developed and Maintained by: Team Thunderbee
  Examples:
      | page |
      | / |
      | /#/test-environments |
      | /#/admin/test-environments |
      | /#/admin/pools |
      | /#/help-docs |
