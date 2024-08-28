Feature: Landing page display test

  I want to test if the landing page is being displayed correctly

  Scenario: Accordion is being displayed correctly
    Given I open the page "/#/"
    Then I check if the ".accordion-item-body" display is none
    When I click the ".accordion-item-header" element
    Then I check if the ".accordion-item-body" display is visable

  Scenario: Expansion panel is being displayed correctly
    Given I open the page "/#/"
    Then I check if the ".accordion-item-body" display is none
    When I click the ".accordion-item-header" element
    Then I check if the ".accordion-item-body" display is visable
    When I click the "mat-expansion-panel" element
    Then I check if the "mat-expansion-panel" is expanded
    When I click the "mat-expansion-panel-header" element
    Then I check if the "mat-expansion-panel" is collapsed

  Scenario: Expansion buttons are responsive to screen size > 767 px
    Given I open the page "/#/"
    When the screen width is 768 pixels
    Then I check if the ".accordion-item-body" display is none
    When I click the ".accordion-item-header" element
    Then I check if the ".accordion-item-body" display is visable
    Then I check if the ".expansion-action-buttons" div is visible

  Scenario: Expansion buttons are responsive to screen size <= 767 px
    Given I open the page "/#/"
    When the screen width is 767 pixels
    Then I check if the ".accordion-item-body" display is none
    When I click the ".accordion-item-header" element
    Then I check if the ".accordion-item-body" display is visable
    Then I check if the ".expansion-action-buttons" div is not visible

  Scenario: 'Help Docs' support link
    Given I click the "help-docs/" link
    Then I should redirect to the URL "/#/help-docs"

  Scenario: The correct Title is displayed depending on the node environment
    Given I open the page "/#/"
    Then I see the correct header text
