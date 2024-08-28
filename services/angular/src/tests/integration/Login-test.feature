Feature: Login Test

    I want to login successfully

    Scenario: Login to RPT successfully
      Given I open the page "/#/login"
      When I type "cypress_test_username" into signum input
      And I type "cypress_test_password" into password input
      And I click the ".login-button" button
      Then I should redirect to the home page
      Then a span with the class username should show "cypressTest" in navbar

    Scenario: Logout of RPT successfully
      And I click the ".logout-button" button
      Then I should redirect to the login page

    Scenario: Login to RPT unsuccessfully
      When I type "incorrect_test_username" into signum input
      And I type "incorrect_test_password" into password input
      And I click the ".login-button" button
      Then a span with the class kc-feedback-text appears which says 'Invalid signum or password.'
