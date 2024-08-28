const expect = require('expect');

const { makeFakeSchedule } = require('../../../../__test__/fixtures/schedule.spec.js');
const { makeSchedule } = require('../../entities');

describe('Unit Test: (Schedule service) Schedule entity', () => {
  it('must create a schedule successfully', () => {
    const fakeSchedule = makeFakeSchedule();

    const createdSchedule = makeSchedule(fakeSchedule);
    expect(createdSchedule.getId()).toBe(fakeSchedule.id);
    expect(createdSchedule.getScheduleName()).toBe(fakeSchedule.scheduleName);
    expect(createdSchedule.getScheduleEnabled()).toBe(fakeSchedule.scheduleEnabled);
    expect(createdSchedule.getTypeOfItemsToSchedule()).toBe(fakeSchedule.typeOfItemsToSchedule);
    expect(createdSchedule.getRefreshData()).toBe(fakeSchedule.refreshData);
    expect(createdSchedule.getRetentionPolicyData()).toBe(fakeSchedule.retentionPolicyData);
    expect(createdSchedule.getScheduleOptions()).toBe(fakeSchedule.scheduleOptions);
    expect(createdSchedule.getCreatedOn()).toBeDefined();
    expect(createdSchedule.getModifiedOn()).toBeDefined();
  });

  it('must not create a schedule with an invalid ID', () => {
    const scheduleInvalidId = makeFakeSchedule({ id: 'invalid' });
    expect(() => makeSchedule(scheduleInvalidId)).toThrow('Schedule entity must have a valid id.');
    const scheduleNoId = makeFakeSchedule({ id: null });
    expect(() => makeSchedule(scheduleNoId)).toThrow('Schedule entity must have a valid id.');
  });

  it('must not create a schedule if any of the required properties are blank', () => {
    const expectedErrorMessage = 'When making a schedule, not every required parameter was provided.';
    const fakeScheduleNoScheduleName = makeFakeSchedule({ scheduleName: '' });
    expect(() => makeSchedule(fakeScheduleNoScheduleName)).toThrow(expectedErrorMessage);

    const fakeScheduleNoScheduleEnabled = makeFakeSchedule({ scheduleEnabled: '' });
    expect(() => makeSchedule(fakeScheduleNoScheduleEnabled)).toThrow(expectedErrorMessage);

    const fakeScheduleNoTypeOfItemsToSchedule = makeFakeSchedule({ typeOfItemsToSchedule: '' });
    expect(() => makeSchedule(fakeScheduleNoTypeOfItemsToSchedule)).toThrow(expectedErrorMessage);

    const fakeScheduleNoRefreshData = makeFakeSchedule({ refreshData: '' });
    expect(() => makeSchedule(fakeScheduleNoRefreshData)).toThrow(expectedErrorMessage);

    const fakeScheduleNoRetentionPolicyData = makeFakeSchedule({ retentionPolicyData: '' });
    expect(() => makeSchedule(fakeScheduleNoRetentionPolicyData)).toThrow(expectedErrorMessage);

    const fakeScheduleNoScheduleOptions = makeFakeSchedule({ scheduleOptions: '' });
    expect(() => makeSchedule(fakeScheduleNoScheduleOptions)).toThrow(expectedErrorMessage);
  });

  it('should only accept valid scheduleEnabled in the scheduleEnabled parameter', () => {
    const invalidTypeOfItemToSchedule = 'NOT_VALID';
    const fakeScheduleNoIds = makeFakeSchedule({ scheduleEnabled: invalidTypeOfItemToSchedule });
    expect(() => makeSchedule(fakeScheduleNoIds)).toThrow(
      'Invalid scheduleEnabled value provided when making schedule, please enter a boolean.',
    );
  });

  it('should only accept valid typeOfItemToSchedule in the typeOfItemToSchedule parameter', () => {
    const invalidTypeOfItemToSchedule = 'NOT_VALID';
    const fakeScheduleNoIds = makeFakeSchedule({ typeOfItemsToSchedule: invalidTypeOfItemToSchedule });
    expect(() => makeSchedule(fakeScheduleNoIds)).toThrow(
      `Invalid typeOfItemsToSchedule ${invalidTypeOfItemToSchedule} provided when making schedule.`,
    );
  });

  it('should ensure the scheduleOptions parameter is of the correct form', () => {
    const scheduleWithScheduleOptionsAsList = makeFakeSchedule({ scheduleOptions: [] });
    expect(() => makeSchedule(scheduleWithScheduleOptionsAsList)).toThrow('Invalid scheduleOptions provided when making schedule.');

    const scheduleWithNoScheduleTypeInScheduleOptions = makeFakeSchedule({
      scheduleOptions: {
        cronSchedule: '0 3 * * *',
        projectArea: 'release',
      },
    });
    expect(() => makeSchedule(scheduleWithNoScheduleTypeInScheduleOptions)).toThrow('Invalid scheduleOptions provided when making schedule.');

    const scheduleWithNoCronScheduleInScheduleOptions = makeFakeSchedule({
      scheduleOptions: {
        scheduleType: 'Auto-refresh',
        projectArea: 'release',
      },
    });
    expect(() => makeSchedule(scheduleWithNoCronScheduleInScheduleOptions)).toThrow('Invalid scheduleOptions provided when making schedule.');

    const scheduleWithNoProjectAreaInScheduleOptions = makeFakeSchedule({
      scheduleOptions: { cronSchedule: '0 3 * * *' },
      scheduleType: 'Auto-refresh',
    });
    expect(() => makeSchedule(scheduleWithNoProjectAreaInScheduleOptions)).toThrow('Invalid scheduleOptions provided when making schedule.');

    const scheduleWithIncorrectCronScheduleFormat = makeFakeSchedule({
      scheduleOptions: {
        cronSchedule: '10:00',
        scheduleType: 'Auto-refresh',
        projectArea: 'release',
      },
    });
    expect(() => makeSchedule(scheduleWithIncorrectCronScheduleFormat)).toThrow('The cronSchedule parameter passed into scheduleOptions must be in a valid crontab format.');

    const scheduleWithCorrectScheduleOptions = makeFakeSchedule({
      scheduleOptions: {
        cronSchedule: '0 3 * * *',
        scheduleType: 'Auto-refresh',
        projectArea: 'release',
      },
    });
    expect(() => makeSchedule(scheduleWithCorrectScheduleOptions)).not.toThrow();
  });

  it('should ensure the refreshDate parameter is of the correct form', () => {
    const scheduleWithRefreshDataAsList = makeFakeSchedule({ refreshData: [] });
    expect(() => makeSchedule(scheduleWithRefreshDataAsList)).toThrow('Invalid refreshData provided when making schedule.');

    const scheduleWithNoSpinnakerPipelineApplicationNAme = makeFakeSchedule({
      refreshData: {
        spinnakerPipelineName: 'testPipelineName',
        itemsToScheduleIds: ['clb3oiofu0000s8hmbiam2umn'],
      },
    });
    expect(() => makeSchedule(scheduleWithNoSpinnakerPipelineApplicationNAme)).toThrow('Invalid refreshData provided when making schedule.');

    const scheduleWithNoSpinnakerPipelineName = makeFakeSchedule({
      refreshData: {
        spinnakerPipelineApplicationName: 'testSpinnakerPipelineApplicationName',
        itemsToScheduleIds: ['clb3oiofu0000s8hmbiam2umn'],
      },
    });
    expect(() => makeSchedule(scheduleWithNoSpinnakerPipelineName)).toThrow('Invalid refreshData provided when making schedule.');

    const scheduleWithNoItemsToScheduleIds = makeFakeSchedule({
      refreshData: {
        spinnakerPipelineName: 'testPipelineName',
        spinnakerPipelineApplicationName: 'testSpinnakerPipelineApplicationName',
      },
    });
    expect(() => makeSchedule(scheduleWithNoItemsToScheduleIds)).toThrow('Invalid refreshData provided when making schedule.');
  });

  it('should only accept valid mongo IDs in the refreshData.itemsToScheduleIds parameter', () => {
    const invalidItemsToScheduleIds = 'NOT_A_VALID_ID!';
    const fakeScheduleNoIds = makeFakeSchedule({
      refreshData: {
        spinnakerPipelineApplicationName: '',
        spinnakerPipelineName: '',
        itemsToScheduleIds: [invalidItemsToScheduleIds],
      },
    });
    expect(() => makeSchedule(fakeScheduleNoIds)).toThrow(
      `Invalid ID ${invalidItemsToScheduleIds} provided in refreshData.itemsToScheduleIds. Please ensure all IDs are valid.`,
    );
  });

  it('should only accept valid input in the retentionPolicyData parameter', () => {
    const invalidTypeOfItemToSchedule = 'NOT_VALID';
    const fakeScheduleNoIds = makeFakeSchedule({ retentionPolicyData: { retentionPolicyEnabled: invalidTypeOfItemToSchedule } });
    expect(() => makeSchedule(fakeScheduleNoIds)).toThrow(
      'Invalid retentionPolicyData provided when making schedule.',
    );
  });

  it('should require numOfStanbyEnvsToBeRetained & numOfEiapReleaseForComparison if retentionPolicyData parameter is true', () => {
    const scheduleWithNoNumOfStandbyEnvsToBeRetained = makeFakeSchedule({
      retentionPolicyData: {
        retentionPolicyEnabled: true,
        numOfEiapReleaseForComparison: 2,
      },
    });
    expect(() => makeSchedule(scheduleWithNoNumOfStandbyEnvsToBeRetained)).toThrow(
      'Invalid input. numOfStanbyEnvsToBeRetained & numOfEiapReleaseForComparison required when retentionPolicyEnabled is true',
    );

    const scheduleWithNoNumOfEiapReleaseForComparison = makeFakeSchedule({
      retentionPolicyData: {
        retentionPolicyEnabled: true,
        numOfStanbyEnvsToBeRetained: 2,
      },
    });
    expect(() => makeSchedule(scheduleWithNoNumOfEiapReleaseForComparison)).toThrow(
      'Invalid input. numOfStanbyEnvsToBeRetained & numOfEiapReleaseForComparison required when retentionPolicyEnabled is true',
    );
  });

  it('should require numOfStanbyEnvsToBeRetained & numOfEiapReleaseForComparison to be a number & >= 1', () => {
    const scheduleWithNumOfEiapReleaseForComparisonLessThan = makeFakeSchedule({
      retentionPolicyData: {
        retentionPolicyEnabled: true,
        numOfStanbyEnvsToBeRetained: 2,
        numOfEiapReleaseForComparison: 0,
      },
    });
    expect(() => makeSchedule(scheduleWithNumOfEiapReleaseForComparisonLessThan)).toThrow(
      'Invalid input for numOfEiapReleaseForComparison provided when making schedule. Must be a positive integer',
    );

    const scheduleWithNumOfEiapReleaseForComparisonNotANumber = makeFakeSchedule({
      retentionPolicyData: {
        retentionPolicyEnabled: true,
        numOfStanbyEnvsToBeRetained: 2,
        numOfEiapReleaseForComparison: 'NOT_VALID',
      },
    });
    expect(() => makeSchedule(scheduleWithNumOfEiapReleaseForComparisonNotANumber)).toThrow(
      'Invalid input for numOfEiapReleaseForComparison provided when making schedule. Must be a positive integer',
    );

    const scheduleWithNumOfStandbyEnvsToBeRetainedLessThan = makeFakeSchedule({
      retentionPolicyData: {
        retentionPolicyEnabled: true,
        numOfStanbyEnvsToBeRetained: 0,
        numOfEiapReleaseForComparison: 2,
      },
    });
    expect(() => makeSchedule(scheduleWithNumOfStandbyEnvsToBeRetainedLessThan)).toThrow(
      'Invalid input for numOfStanbyEnvsToBeRetained provided when making schedule. Must be a positive integer',
    );

    const scheduleWithNumOfStandbyEnvsToBeRetainedNotANumber = makeFakeSchedule({
      retentionPolicyData: {
        retentionPolicyEnabled: true,
        numOfStanbyEnvsToBeRetained: 'NOT_VALID',
        numOfEiapReleaseForComparison: 2,
      },
    });
    expect(() => makeSchedule(scheduleWithNumOfStandbyEnvsToBeRetainedNotANumber)).toThrow(
      'Invalid input for numOfStanbyEnvsToBeRetained provided when making schedule. Must be a positive integer',
    );
  });
});
