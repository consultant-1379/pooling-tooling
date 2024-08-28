export interface TestEnvironment {
  id: string;
  name: string;
  status: string;
  properties: [{
    product: string;
    platformType: string;
    version: string;
  }];
  pipelineStage: string;
  requestId: string;
  additionalInfo: string;
  comments: string;
}
