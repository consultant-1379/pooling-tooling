function makeCreateIndexes(dbOperator, logger) {
  return async function createIndexes() {
    const loggingTags = {
      service: 'Test Environment (controller)',
      action: 'createIndexes',
    };
    if (
      !(await dbOperator.createCollectionIndex(
        'testEnvironments',
        { name: 1 },
        { unique: true },
      ))
    ) {
      logger.error(loggingTags, 'Failed to Create Indexes');
      return;
    }
    logger.info(loggingTags, 'SUCCESS: Test Environment Indexes exist');
  };
}

module.exports = { makeCreateIndexes };
