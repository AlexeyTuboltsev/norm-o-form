import { controlDigitIsValid, generateGln13CheckDigit } from './utils';

describe('gets a parent id from current id', () => {
  test('example 1', () => {
    const result = generateGln13CheckDigit('629104150021');
    expect(result).toEqual(3);
  });

  test('example 2', () => {
    const result = generateGln13CheckDigit('400763000011');
    expect(result).toEqual(6);
  });

  test('example 3', () => {
    const result = generateGln13CheckDigit('300763000011');
    expect(result).not.toEqual(6);
  });

  test('controlDigitIsValid', () => {
    const result = controlDigitIsValid('4007630000116');
    expect(result).toBeTruthy();
  });
});
