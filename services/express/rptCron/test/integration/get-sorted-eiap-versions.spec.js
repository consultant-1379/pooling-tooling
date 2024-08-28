const { validate } = require('compare-versions');
const expect = require('expect');

const { getSortedEiapVersions } = require('../../use-cases');

describe('Integration Test: Get sorted EIAP versions use case', () => {
  it('should successfully get an array of valid semver versions', async () => {
    const sortedEiapVersions = await getSortedEiapVersions();

    sortedEiapVersions.forEach((version) => {
      const regexToMatchSemver = /\d+\.?-?/g;
      const isVersionValidSemver = validate(version);

      expect(version).toEqual(expect.stringMatching(regexToMatchSemver));
      expect(isVersionValidSemver).toBe(true);
    });
  });
});
