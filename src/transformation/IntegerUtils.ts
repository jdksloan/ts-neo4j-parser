export class IntegerUtils {
  public static invertBit(bit: string) {
    return bit === '0' ? '1' : '0';
  }

  public static binaryInvert(binaryString: string) {
    return binaryString.split('').map(IntegerUtils.invertBit).join('');
  }

  public static binaryIncrement(binaryString: string) {
    const idx = binaryString.lastIndexOf('0');
    return binaryString.substring(0, idx) + '1' + IntegerUtils.binaryInvert(binaryString.substring(idx + 1));
  }

  public static binaryDecrement(binaryString: string) {
    const idx = binaryString.lastIndexOf('1');
    return binaryString.substring(0, idx) + IntegerUtils.binaryInvert(binaryString.substring(idx));
  }

  public static binaryAbs(binaryString: string) {
    if (binaryString[0] === '1') {
      return IntegerUtils.binaryInvert(IntegerUtils.binaryDecrement(binaryString));
    }
    return binaryString;
  }

  public static to32Bits(val: number) {
    let binaryString = val.toString(2);
    if (binaryString[0] === '-') {
      binaryString =
        new Array(33 - (binaryString.length - 1)).join('1') + IntegerUtils.binaryInvert(binaryString.substr(1));
      return IntegerUtils.binaryIncrement(binaryString);
    }
    return new Array(33 - binaryString.length).join('0') + binaryString;
  }

  public static to64BitsIntegerString(high: number, low: number) {
    let fullBinaryNumber = IntegerUtils.to32Bits(high) + IntegerUtils.to32Bits(low);
    const isNegative = fullBinaryNumber[0] === '1';

    fullBinaryNumber = IntegerUtils.binaryAbs(fullBinaryNumber);

    let result = '';

    while (fullBinaryNumber.length > 0) {
      let remainingToConvert = '';
      let resultDigit = 0;
      for (const char of fullBinaryNumber) {
        const currentValue = Number(char) + resultDigit * 2;
        const remainingDigitToConvert = Math.floor(currentValue / 10);
        resultDigit = currentValue % 10;
        if (remainingToConvert.length || remainingDigitToConvert) {
          remainingToConvert += remainingDigitToConvert;
        }
      }
      fullBinaryNumber = remainingToConvert;
      result = resultDigit + result;
    }
    return (isNegative ? '-' : '') + result;
  }
}
