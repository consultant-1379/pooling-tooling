const expect = require('expect');

const { makeCreateQueryToSearchAvailableTestEnvironments } = require('../../use-cases/create-query-to-search-available-test-environments');

describe('Unit Test: (Pool service) Search pool for available test environments use case', () => {
  it('tests the searching of a pool for available test environments using multiple properties', () => {
    const createQueryToSearchAvailableTestEnvironments = makeCreateQueryToSearchAvailableTestEnvironments({
      findBySearchQuery: (finalQuery) => finalQuery,
    });

    const actualMongoQuery = createQueryToSearchAvailableTestEnvironments(
      {
        id: ['297', '306'],
        status: 'Available',
      },
    );

    const expectedMongoQuery = {
      $and: [
        { status: 'Available' },
      ],
      $or: [
        { id: '297' },
        { id: '306' },
      ],
    };

    expect(actualMongoQuery).toEqual(expectedMongoQuery);
  });

  it('tests that we dont find any pools', () => {
    const createQueryToSearchAvailableTestEnvironments = makeCreateQueryToSearchAvailableTestEnvironments({
      findBySearchQuery: (finalQuery) => finalQuery,
    });
    expect(() => createQueryToSearchAvailableTestEnvironments({})).toThrow('You must specify a search query.');
  });
});
