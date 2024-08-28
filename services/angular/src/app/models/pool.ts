export class Pool {
  id!: string;
  assignedTestEnvironmentIds!: Array<string>;
  poolName!: string;
  creatorDetails = new CreatorDetails();
  additionalInfo!: string;
}

export class CreatorDetails {
  name!: string;
  area!: string;
}
