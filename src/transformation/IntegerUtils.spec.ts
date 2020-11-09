import { IntegerUtils } from './IntegerUtils';

describe('Test IntegerUtils', () => {
  test('invertBit', () => {
    expect(IntegerUtils.invertBit('0')).toBe('1');
  });
  test('binaryInvert', () => {
    expect(IntegerUtils.binaryInvert('0000')).toBe('1111');
  });
  test('binaryIncrement', () => {
    expect(IntegerUtils.binaryIncrement('0000')).toBe('0001');
  });
  test('binaryDecrement', () => {
    expect(IntegerUtils.binaryDecrement('0001')).toBe('0000');
  });
  test('binaryAbs starts with 1', () => {
    expect(IntegerUtils.binaryAbs('1111')).toBe('0001');
  });
  test('binaryAbs starts with 0', () => {
    expect(IntegerUtils.binaryAbs('0100')).toBe('0100');
  });
  test('to32Bits', () => {
    expect(IntegerUtils.to32Bits(25)).toBe('00000000000000000000000000011001');
  });
  test('to32Bits negative', () => {
    expect(IntegerUtils.to32Bits(-1)).toBe('11111111111111111111111111111111');
  });
  test('to64BitsIntegerString', () => {
    expect(IntegerUtils.to64BitsIntegerString(20, 10)).toBe('85899345930');
  });

  test('to64BitsIntegerString negative', () => {
    expect(IntegerUtils.to64BitsIntegerString(-1, 10)).toBe('-4294967286');
  });
});
