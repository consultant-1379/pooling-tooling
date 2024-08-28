function buildPoolSchemas(z, paramsWithId) {
  const creatorDetailsSchema = z.object({
    name: z.string().max(65).optional(),
    area: z.string().max(65).optional(),
  });

  const patchablePoolSchema = z
    .object({
      id: paramsWithId.optional(),
      assignedTestEnvironmentIds: z.array(z.string()).optional(),
      poolName: z.string().min(1).max(100).optional(),
      creatorDetails: creatorDetailsSchema.optional(),
      additionalInfo: z.string().min(1).max(90).optional(),
      createdOn: z.string().optional(),
      modifiedOn: z.string().optional(),
    })
    .strict();

  return {
    patchablePoolSchema,
  };
}

module.exports = { buildPoolSchemas };
