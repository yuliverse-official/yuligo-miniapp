/**
 * 小数转换成整数
 * @param num 
 * @returns 整数，及对应倍数
 */
export function decimalToInteger(num: number) {
    if (Number.isInteger(num)) {
      return { value: num, mul: 1 };
    }
  
    const decimalStr = num.toString();
    const decimalPlaces = decimalStr.split('.')[1].length;
    const mul = Math.pow(10, decimalPlaces);
    const value = Math.round(num * mul); // 转为整数
    
    return { value, mul };
}