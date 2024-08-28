export class Schedule {
  id!: string;
  scheduleName!: string;
  scheduleEnabled!: boolean;
  typeOfItemsToSchedule!: string;
  refreshData = new RefreshData();
  retentionPolicyData = new RetentionPolicyData();
  scheduleOptions = new ScheduleOptions();
  modifiedOn!: string;
}

export class RefreshData {
  spinnakerPipelineApplicationName!: string;
  spinnakerPipelineName!: string;
  itemsToScheduleIds!: Array<string>;
}

export class RetentionPolicyData {
  retentionPolicyEnabled!: boolean;
  numOfStanbyEnvsToBeRetained!: number;
  numOfEiapReleaseForComparison!: number;
}

export class ScheduleOptions {
  scheduleType!: string;
  cronSchedule!: string;
  projectArea!: string;
}
