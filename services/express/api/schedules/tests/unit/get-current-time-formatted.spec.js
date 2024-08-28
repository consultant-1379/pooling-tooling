const expect = require('expect');

const { makeGetCurrentTimeFormatted } = require('../../use-cases/get-current-time-formatted');

describe('Unit Test: (Schedule service) Get current time formatted use case', () => {
  it('should always return time in the form HH:MM', () => {
    const getCurrentTimeFormatted = makeGetCurrentTimeFormatted();
    const currentTimeFormatted = getCurrentTimeFormatted();
    const expectedTimeRegex = /^\d{2}:\d{2}$/;
    expect(currentTimeFormatted).toMatch(expectedTimeRegex);
  });
});
