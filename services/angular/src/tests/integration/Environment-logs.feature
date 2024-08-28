Feature: Environment Logs

  I want to test if the Environment Logs button works

  Scenario: Check if Environment Logs button works
    Given I open the page "/#/test-environments"
    Then I click the Environment Logs button, it redirects to a new page