Feature: Admin schedule CRUD

    I want to add, edit and remove a schedule

    Scenario: Adding a schedule successfully
      Given I open the page "/#/admin/schedules"
      When I type "test_schedule" as the schedule name
      And I click the ".add-schedule" button
      And I choose Off as the Schedule Enabled option
      And I choose "pool" as the Type Of Items To Schedule
      And I type "test" as the "spinnakerPipelineApplicationName"
      And I type "test" as the "spinnakerPipelineName"
      And I choose Off as the Retention Policy Enabled
      And I choose "auto-refresh" as the Schedule Type
      And I type "1 1 1 1 1" as the "cronSchedule"
      And I choose "Pool" as the pool
      And I choose "pso" as the Project Area
      And I click the ".confirm" button
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Schedule Added: test_schedule"

    Scenario: Adding a Schedule which already exists
      Given I open the page "/#/admin/schedules"
      When I type "test_schedule" as the schedule name
      And I click the ".add-schedule" button
      Then a mat dialog with the class ".mat-dialog-content" appears which says "Schedule test_schedule already exists in RPT"

    Scenario: Editing a schedule successfully
      Given I open the page "/#/admin/schedules"
      When I type "test_schedule" as the schedule name
      And I click the ".edit-schedule" button
      And I add "-edited" as the "spinnakerPipelineApplicationName"
      And I click the ".confirm" button
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Schedule Updated: test_schedule"

    Scenario: Editing a schedule which does not exist
      Given I open the page "/#/admin/schedules"
      When I type "sch_which_does_not_exist" as the schedule name
      And I click the ".edit-schedule" button
      Then a mat dialog with the class ".mat-dialog-content" appears which says "Schedule sch_which_does_not_exist does not exist in RPT"

    Scenario: Ensure removing a schedule that fails due to a server side error is handled correctly
      Given I open the page "/#/admin/schedules"
      When I type "test_schedule" as the schedule name
      And I click the ".remove-schedule" button
      And I type "test_schedule" to confirm
      And I click the button ".confirm-button" that mocks a "DELETE" rest call to "/api/schedules/*" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "Could not delete Schedule: Http failure response for"

   Scenario: Ensure removing a schedule that fails as it can not get information about the appropriate schedule is handled correctly
      Given I open the page "/#/admin/schedules"
      When I type "test_schedule" as the schedule name
      And I click the button ".remove-schedule" that mocks a "GET" rest call to "/api/schedules/name/*" with the error "A generic error message from express." where the second request fails
      Then a snackbar with the class ".error-snackbar-class" appears which says "An internal error has occurred and the schedule details could not be retrieved: Http failure response for"

    Scenario: Ensure failing to get available pools while editing a schedule is handled correctly
      Given I open the page "/#/admin/schedules"
      When I type "test_schedule_2" as the schedule name
      And I click the button ".add-schedule" that mocks a "GET" rest call to "/api/pools" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "Failed to retrieve available pools: Http failure response for"

    Scenario: Ensure failing to get schedule by name when editing a schedule is handled correctly
      Given I open the page "/#/admin/schedules"
      When I type "test_schedule" as the schedule name
      And I click the button ".edit-schedule" that mocks a "GET" rest call to "/api/schedules/name/*" with the error "A generic error message from express." where the second request fails
      Then a snackbar with the class ".error-snackbar-class" appears which says "An internal error has occurred and the schedule details could not be retrieved: Http failure response for"

    Scenario: Ensure failing to PATCH schedule is handled correctly
      Given I open the page "/#/admin/schedules"
      When I type "test_schedule" as the schedule name
      And I click the ".edit-schedule" button
      And I add "-edited" as the "spinnakerPipelineName"
      And I click the button ".confirm" that mocks a "PATCH" rest call to "/api/schedules/*" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "ERROR: Failed to edit the Schedule test_schedule: Http failure response for"

    Scenario: Removing a schedule successfully
      Given I open the page "/#/admin/schedules"
      When I type "test_schedule" as the schedule name
      And I click the ".remove-schedule" button
      And I type "test_schedule" to confirm
      And I click the ".confirm-button" button
      Then a snackbar with the class ".custom-snackbar-class" appears which says "Schedule deleted: test_schedule"

    Scenario: Ensure removing a schedule which does not exist is handled correctly
      Given I open the page "/#/admin/schedules"
      When I type "sch_which_does_not_exist" as the schedule name
      And I click the ".remove-schedule" button
      Then a mat dialog with the class ".mat-dialog-content" appears which says "Schedule sch_which_does_not_exist does not exist in RPT"

    Scenario: Ensure failing to post the pool to express when adding a schedule is handled correctly
      Given I open the page "/#/admin/schedules"
      When I type "test_sch" as the schedule name
      And I click the ".add-schedule" button
      And I choose Off as the Schedule Enabled option
      And I choose "pool" as the Type Of Items To Schedule
      And I type "test" as the "spinnakerPipelineApplicationName"
      And I type "test" as the "spinnakerPipelineName"
      And I choose Off as the Retention Policy Enabled
      And I choose "auto-refresh" as the Schedule Type
      And I type "1 1 1 1 1" as the "cronSchedule"
      And I choose "Pool" as the pool
      And I choose "pso" as the Project Area
      And I click the button ".confirm" that mocks a "POST" rest call to "/api/schedules/" with the error "A generic error message from express."
      Then a snackbar with the class ".error-snackbar-class" appears which says "ERROR: Failed to add the Schedule test_sch: Http failure response for"

    Scenario: Ensure editing a schedule which is updated while modal is open is handled correctly
      Given I open the page "/#/admin/schedules"
      When I type "test-sch-cypress" as the schedule name
      And I click the ".edit-schedule" button
      And an update event is detected for the schedule
      Then a snackbar with the class ".socket-snackbar-class" appears which says "Properties of Schedule test-sch-cypress have been updated since modal opened! Please try editing Schedule again.X"
      Then a mat dialog with the class ".mat-dialog-container" closes
