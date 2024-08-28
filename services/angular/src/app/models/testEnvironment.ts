export class TestEnvironment {
  id!: string;
  name!: string;
  status!: string;
  pools!: Array<string>;
  properties = new Properties();
  pipelineStage!: string;
  additionalInfo!: string;
  comments!: string;
  modifiedOn!: string;
  priorityInfo: PriorityInfo | undefined;// Allow express to populate missing properties
}

export class Properties {
  product!: string;
  platformType!: string;
  version!: string;
  ccdVersion!: string;
}

export class PriorityInfo {
  viewIndices!: { [poolName: string]: number };
}
