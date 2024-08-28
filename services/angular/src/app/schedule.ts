export interface Schedule {
  id: string;
  scheduleName: string;
  typeOfItemsToSchedule: string;
  scheduleEnabled: boolean;
  refreshData: [{
    spinnakerPipelineApplicationName: string;
    spinnakerPipelineName: string;
  }];
  retentionPolicyData: [{
    retentionPolicyEnabled: boolean;
    numOfStanbyEnvsToBeRetained: number;
    numOfEiapReleaseForComparison: number;
  }];
  scheduleOptions: [{
    scheduleType: string;
    cronSchedule: string;
    projectArea: string;
  }];
}
