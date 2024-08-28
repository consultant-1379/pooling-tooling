Feature: Navbar version test

  Scenario: Check if UI version matches version in VERSION file
    Given I get the version from VERSION file
    Then I get the version from Navbar
    Then I compare both versions against each other
