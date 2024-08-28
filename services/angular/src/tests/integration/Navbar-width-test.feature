Feature: Navbar width display testschedule

  I want to test if the Navbar is being displayed correctly at different widths

  Scenario: Hamburger menu is not visable >= 992 px
    Given I open the page "/#/"
    When the screen width is 993 pixels
    Then I check if the ".navbar-expand-lg .navbar-toggler" display is none

  Scenario: Hamburger menu is visable < 992 px
    Given I open the page "/#/"
    When the screen width is 991 pixels
    Then I check if the ".navbar-expand-lg" display is visable

  Scenario: Version and Username is not visable on navbar when screen width <= 767 px
    Given I open the page "/#/"
    When the screen width is 767 pixels
    Then I check if the ".information-item" display is none

  Scenario: Version and Username is visable on navbar when screen width >= 767 px
    Given I open the page "/#/"
    When the screen width is 768 pixels
    Then I check if the ".information-item" display is visable
