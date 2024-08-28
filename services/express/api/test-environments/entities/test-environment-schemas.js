function buildTestEnvironmentSchemas(z, paramsWithId) {
  const additionalPropertiesSchema = z.object({
    product: z.string().min(1).max(65).optional(),
    platformType: z.string().min(1).max(65).optional(),
    version: z.string().min(1).max(65).optional(),
    ccdVersion: z.string().min(1).max(65).optional(),
  }).passthrough();

  const testEnvironmentStatusSchema = z.enum([
    'Available',
    'Reserved',
    'Quarantine',
    'Standby',
    'Refreshing',
  ]);

  const viewIndicesSchema = z.record(z.number());

  const priorityInfoSchema = z.object({
    viewIndices: viewIndicesSchema,
  });

  const patchableTestEnvironmentSchema = z
    .object({
      name: z.string().optional(),
      status: testEnvironmentStatusSchema.optional(),
      requestId: z.string().optional(),
      pools: z.array(z.string()).optional(),
      properties: additionalPropertiesSchema.optional(),
      stage: z.string().optional(),
      additionalInfo: z.string().optional(),
      comments: z.string().optional(),
      priorityInfo: priorityInfoSchema.optional(),
      id: paramsWithId.optional(),
      createdOn: z.union([z.string().transform((str) => new Date(str)), z.date()]).optional(),
      modifiedOn: z.union([z.string().transform((str) => new Date(str)), z.date()]).optional(),
    }).strict();

  return {
    patchableTestEnvironmentSchema,
  };
}

module.exports = { buildTestEnvironmentSchemas };
