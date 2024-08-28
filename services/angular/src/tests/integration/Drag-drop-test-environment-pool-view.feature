Feature: Drag and drop test environments from the pool view

    Scenario: drag and drop first element to second in pools view
      Given I open the page "/#/pools/Pool"
      When I drag the the first element down 50 pixels in the table
      Then I expect the environment to be at index 0 in the list of envs and at index 1 in the list of Pools
      And I expect the environment to be at index 1 in the list of envs and at index 0 in the list of Pools

    Scenario: drag and drop single element in pool view
      Given I open the page "/#/pools/Another_Pool"
      When I drag the the first element down 50 pixels in the table
      Then I check to see if element position has changed in Another_Pool pools view

    Scenario: drag and drop first element to first in pools view
      Given I open the page "/#/pools/Pool"
      When I drag the the first element down 0 pixels in the table
      Then I expect the environment to be at index 0 in the list of envs and at index 0 in the list of Pools
      And I expect the environment to be at index 1 in the list of envs and at index 1 in the list of Pools
