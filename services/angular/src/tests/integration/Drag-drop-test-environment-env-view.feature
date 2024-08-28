Feature: Drag and drop test environments from the test environment view

    Scenario: drag and drop first element to second in environments view
      Given I open the page "/#/test-environments"
      When I drag the the first element down 50 pixels in the table
      Then I expect the environment to be at index 1 in the list of envs and at index 0 in the list of Pools
      And I expect the environment to be at index 0 in the list of envs and at index 1 in the list of Pools

    Scenario: drag and drop first element to first in environments view
      Given I open the page "/#/test-environments"
      When I drag the the first element down 0 pixels in the table
      Then I expect the environment to be at index 0 in the list of envs and at index 0 in the list of Pools
      And I expect the environment to be at index 1 in the list of envs and at index 1 in the list of Pools
