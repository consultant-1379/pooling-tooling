const expect = require('expect');

const { makeFlattenObject } = require('../../flatten-object');

const flattenObject = makeFlattenObject();

describe('Unit Test: (Utilities service) Flatten Object', () => {
  it('flattens a simple object', () => {
    const input = { foo: 'x', bar: 'y' };
    const result = flattenObject(input);
    expect(result).toEqual({ foo: 'x', bar: 'y' });
  });

  it('flattens a simple object with parent key', () => {
    const input = { foo: 'x', bar: 'y' };
    const result = flattenObject(input, 'foobar');
    expect(result).toEqual({ 'foobar.foo': 'x', 'foobar.bar': 'y' });
  });

  it('flattens a nested object', () => {
    const input = { foo: 'x', bar: { baz: 'y' } };
    const result = flattenObject(input);
    expect(result).toEqual({ 'bar.baz': 'y', foo: 'x' });
  });

  it('uses a custom separator', () => {
    const input = { foo: { bar: { baz: 'x' } } };
    const result = flattenObject(input, '', '_');
    expect(result).toEqual({ foo_bar_baz: 'x' });
  });

  it('works with a specified parent key', () => {
    const input = { baz: 'x' };
    const result = flattenObject(input, 'foo');
    expect(result).toEqual({ 'foo.baz': 'x' });
  });

  it('does not modify arrays', () => {
    const input = { foo: ['x', 'y', 'z'] };
    const result = flattenObject(input);
    expect(result).toEqual({ foo: ['x', 'y', 'z'] });
  });
});
