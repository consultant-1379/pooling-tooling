Feature: Help docs display test

  I want to test if the help docs are being displayed correctly

  Scenario Outline: Help docs is displayed correctly
    Given I open <page>
    Then I see the help docs header
    Examples:
      | page |
      | /#/help-docs |
      | /#/help-docs/test-environments |
      | /#/help-docs/pools |
      | /#/help-docs/schedules |
      | /#/help-docs/test-environments-administration |
      | /#/help-docs/pools-administration |
      | /#/help-docs/schedules-administration |

  Scenario Outline: Navigating to the different help docs pages
    Given I am on the main help docs page
    When I click the button with ID <button_id>
    Then I should see the help doc with href <href>
    Examples:
      | button_id | href |
      | test-environments-tile | /test-environments |
      | pool-tile | /pools |
      | schedule-tile | /schedules |
      | test-environments-administration-tile | /test-environments-administration |
      | pools-administration-tile | /pools-administration |
      | schedules-administration-tile | /schedules-administration |

  Scenario: Check go to top button scrolls the Y coordinate of window to 0 pixels when clicked
    Given I am on the main help docs page
    Then I check if the "#go-to-top-button" button is not visible
    When I scroll down to 145 px
    Then I check if the "#go-to-top-button" button is visible
    When I click the button with an id of go-to-top-button
    Then I should return to the top of the page