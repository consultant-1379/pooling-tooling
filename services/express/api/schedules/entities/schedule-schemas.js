function buildScheduleSchemas(z, paramsWithId, cronSchema) {
  const refreshDataSchema = z.object({
    spinnakerPipelineApplicationName: z.string().max(100).optional(),
    spinnakerPipelineName: z.string().max(100).optional(),
    itemsToScheduleIds: z.array(z.string()).optional(),
  });

  const retentionPolicyDataSchema = z.object({
    retentionPolicyEnabled: z.boolean().optional(),
    numOfStanbyEnvsToBeRetained: z
      .number()
      .min(0, {
        message:
          'Invalid input for numOfStanbyEnvsToBeRetained provided when making schedule. Must be a positive integer',
      })
      .optional(),
    numOfEiapReleaseForComparison: z
      .number()
      .min(0, {
        message:
          'Invalid input for numOfEiapReleaseForComparison provided when making schedule. Must be a positive integer',
      })
      .optional(),
  });

  const scheduleOptionsSchema = z.object({
    scheduleType: z.union([z.string(), z.array(z.string())]).optional(),
    cronSchedule: cronSchema.optional(),
    projectArea: z.union([z.string(), z.array(z.string())]).optional(),
  });

  const patchableScheduleSchema = z
    .object({
      id: paramsWithId.optional(),
      scheduleName: z.string().min(1).max(100).optional(),
      scheduleEnabled: z.boolean().optional(),
      typeOfItemsToSchedule: z.enum(['pool', 'test-environment']).optional(),
      refreshData: refreshDataSchema.optional(),
      retentionPolicyData: retentionPolicyDataSchema.optional(),
      scheduleOptions: scheduleOptionsSchema.optional(),
      createdOn: z.union([z.string().transform((str) => new Date(str)), z.date()]).optional(),
      modifiedOn: z.union([z.string().transform((str) => new Date(str)), z.date()]).optional(),
    })
    .strict();

  return {
    patchableScheduleSchema,
  };
}

module.exports = { buildScheduleSchemas };
