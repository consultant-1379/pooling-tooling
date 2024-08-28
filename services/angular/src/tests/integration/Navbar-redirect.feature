Feature: Navbar redirect test

  Scenario: 'Resource Pooling Tool' navbar link
    Given I click Resource Pooling Tool navbar link
    Then I should redirect to the URL "/#/"

  Scenario: 'Environments' navbar link
    Given I click the "test-environments" navbar link
    Then I should redirect to the URL "/#/test-environments"

  Scenario: 'Schedules' navbar link
    Given I click the "schedules" navbar link
    Then I should redirect to the URL "/#/schedules"

  Scenario: 'Admin Environments' navbar link
    Given I click the "admin/test-environments/" navbar link
    Then I should redirect to the URL "/#/admin/test-environments"

  Scenario: 'Admin Pools' navbar link
    Given I click the "admin/pools/" navbar link
    Then I should redirect to the URL "/#/admin/pools"

  Scenario: 'Admin Schedules' navbar link
    Given I click the "admin/schedules/" navbar link
    Then I should redirect to the URL "/#/admin/schedules"

  Scenario: 'Helps Docs' navbar link
    Given I click the "help-docs/" navbar link
    Then I should redirect to the URL "/#/help-docs"
