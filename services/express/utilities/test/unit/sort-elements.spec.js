const expect = require('expect');

const { compare } = require('compare-versions');
const { sortElements } = require('../..');

describe('Unit Test: (Utilities service) sort elements', () => {
  const comparator = function compareFunction(element1, element2) {
    return compare(element1, element2, '<=') ? 1 : -1;
  };
  it('the first element returned should be the latest version, given the correct comparator', () => {
    const fakeElements = ['0.0.0-1', '2.0.0-1234', '1.0.0-561'];

    const sortedFakeElements = sortElements(comparator, fakeElements);
    expect(sortedFakeElements[0]).toEqual('2.0.0-1234');
  });

  it('it sorts correctly when elements are semver versions', () => {
    const fakeElements = ['0.0.0-1', '2.0.0-1234', '2.0.0-239', '0.1.0-23', '1.2.0-1', '0.2.1-1307'];

    const sortedFakeElements = sortElements(comparator, fakeElements);
    expect(sortedFakeElements[1]).toBe('2.0.0-239');
    expect(sortedFakeElements[3]).toBe('0.2.1-1307');
    expect(sortedFakeElements[5]).toBe('0.0.0-1');
  });

  it('it handles an empty array', () => {
    const fakeElements = [];
    expect(() => sortElements(comparator, fakeElements)).toThrow('No elements passed, unable to sort');
  });

  it('it handles when no elements are passed in', () => {
    expect(() => sortElements(comparator)).toThrow('No elements passed, unable to sort');
  });

  it('it can sort different types of elements, using a different comparator', () => {
    const fakeElements = [
      { name: 'Brian', goals: 23 },
      { name: 'Kerry', goals: 45 },
      { name: 'Tommy', goals: 8 },
      { name: 'Sue', goals: 17 },
    ];
    const alternativeComparator = (a, b) => b.goals - a.goals;
    const sortedFakeElements = sortElements(alternativeComparator, fakeElements);
    expect(sortedFakeElements[0]).toEqual({ name: 'Kerry', goals: 45 });
  });
});
