function buildParamsWithId(z, Id) {
  return z
    .string()
    .min(1)
    .refine((val) => Id.isValidId(val), {
      message: 'Invalid ObjectId',
    });
}

module.exports = { buildParamsWithId };
