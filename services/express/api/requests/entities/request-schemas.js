function buildRequestSchemas(z, paramsWithId) {
  const requestorDetailsSchema = z.object({
    name: z.string().max(65).optional(),
    area: z.string().max(65).optional(),
    executionId: z.string().max(65).optional(),
  });

  const patchableRequestSchema = z
    .object({
      id: paramsWithId.optional(),
      testEnvironmentId: z.string().max(100).optional(),
      poolName: z.string().min(1).max(100).optional(),
      requestorDetails: requestorDetailsSchema.optional(),
      additionalInfo: z.string().min(1).max(90).optional(),
      status: z.string().optional(),
      requestTimeout: z
        .number()
        .min(60000, {
          message: 'The timeout can not be less than a minute.',
        })
        .optional(),
      createdOn: z.string().optional(),
      modifiedOn: z.string().optional(),
      lastReservedAt: z.string().optional(),
    })
    .strict();

  return {
    patchableRequestSchema,
  };
}

module.exports = { buildRequestSchemas };
