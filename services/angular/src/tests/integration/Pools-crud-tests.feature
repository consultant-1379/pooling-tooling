Feature: Admin pool CRUD

    Scenario: Adding a pool
      Given I open the page "/#/admin/pools"
      When I type "test_pool" as the pool name
      And I click the ".add-pool" button
      And I choose App staging as the creator area
      Then I click the ".confirm" button

    Scenario: Adding a pool which already exists
      Given I open the page "/#/admin/pools"
      When I type "test_pool" as the pool name
      And I click the ".add-pool" button
      Then a mat dialog with the class ".mat-dialog-content" appears which says "Pool test_pool already exists in RPT"

    Scenario: Ensure removing a pool that fails due to a server side error is handled correctly
      Given I open the page "/#/admin/pools"
      When I type "test_pool" as the pool name
      And I click the ".remove-pool" button
      And I type test_pool to confirm
      And I click the button ".confirm-button" that mocks a "DELETE" rest call to "/api/pools/*" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "Could not delete Pool: Http failure response for"
    Scenario: Ensure removing a pool that fails due to the server side error of test environments being attached to the pool is handled correctly
      Given I open the page "/#/admin/pools"
      When I type "test_pool" as the pool name
      And I click the ".remove-pool" button
      And I type test_pool to confirm
      And I click the button ".confirm-button" that mocks a "DELETE" rest call to "/api/pools/*" with the error "test environments attached to pool"
      Then a snackbar with the class ".error-snackbar-class" appears which says "Could not delete Pool as test environments are attached. Please reallocate these test environments to another pool and try again: Http failure response for"

    Scenario: Ensure removing a pool that fails as it can not get information about the appropriate pool is handled correctly
      Given I open the page "/#/admin/pools"
      When I type "test_pool" as the pool name
      And I click the button ".remove-pool" that mocks a "GET" rest call to "/api/pools/name/*" with the error "A generic error message from express." where the second request fails
      Then a snackbar with the class ".error-snackbar-class" appears which says "An internal error has occurred and the pool details could not be retrieved: Http failure response for"

    Scenario: Removing a pool
      Given I open the page "/#/admin/pools"
      When I type "test_pool" as the pool name
      And I click the ".remove-pool" button
      And I type test_pool to confirm
      Then I click the ".confirm-button" button

    Scenario: Removing a pool which does not exist
      Given I open the page "/#/admin/pools"
      When I type "pool_which_does_not_exist" as the pool name
      And I click the ".remove-pool" button
      Then a mat dialog with the class ".mat-dialog-content" appears which says "Pool pool_which_does_not_exist does not exist in RPT"

    Scenario: Ensure adding a pool that fails due to a server side error is handled correctly
      Given I open the page "/#/admin/pools"
      When I type "test_pool" as the pool name
      And I click the ".add-pool" button
      And I choose App staging as the creator area
      And I click the button ".confirm" that mocks a "POST" rest call to "/api/pools" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "ERROR: Failed to add the Pool test_pool: Http failure response for"
