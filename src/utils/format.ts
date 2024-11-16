// 示例方法，没有实际意义
export function trim(str: string) {
  return str.trim();
}

/**
 * toFixed (无进制)
 * @param {*} number 需要改变的数字
 * @param {*} tofixNum 保留位数
 */
export function toFixedWithMode(number: number, tofixNum: number) {
  const numberString = number.toString();
  const isPointNum = numberString?.indexOf(".") > -1;
  let returnNum = "";
  if (!isPointNum) {
    // 非小数
    let endNum = "";
    for (let i = 0; i < tofixNum; i++) endNum += 0;
    returnNum = numberString + "." + endNum;
  } else {
    // 含小数
    const d = numberString.split(".")[0];
    const p = numberString.split(".")[1];
    if (p.length >= tofixNum) {
      returnNum = d + "." + p.slice(0, tofixNum);
    } else {
      let endNum = "";
      for (let i = p.length; i < tofixNum; i++) endNum += 0;
      returnNum = d + "." + p + endNum;
    }
  }
  return parseFloat(Number(returnNum).toFixed(10));
}

/**
 * 数字格式化
 */
export function NumberFormat(val: number, fixNumber: number = 2) {
  const num = 1000;
  let sizesValue = "";
  /**
   * 判断取哪个单位
   */
  if (val < 1000) {
    // 如果小于1000则直接返回
    sizesValue = "";
    return parseFloat(Number(Number(val).toFixed(fixNumber)).toFixed(10));
  } else if (val >= 1000 && val < 999999) {
    sizesValue = "K";
  } else if (val > 999999 && val < 999999999) {
    sizesValue = "M";
  } else if (val > 999999999) {
    sizesValue = "B";
  }
  /**
   * 大于一万则运行下方计算
   */
  const i = Math.floor(Math.log(val) / Math.log(num));

  let sizes: any = val / Math.pow(num, i);

  sizes = parseFloat(Number(Number(sizes).toFixed(fixNumber)).toFixed(10));
  sizes = sizes + sizesValue;
  return sizes;
}
export const separateTonAddress = (address: string, tofixNum: number = 4) => {
  return `${address.slice(0, tofixNum)}...${address.slice(-tofixNum)}`;
};

export const calculateUsdtAmount = (usdCents: number) => BigInt(usdCents * 1000000);

export const calculateUsdFromUsdt = (usdtAmount: bigint) => Number(usdtAmount) / 1000000;

export const calculateFromTon = (tonAmount: bigint) => Number(tonAmount) / 1000000000;

export const caculateToTon = (tonAmount: number) => BigInt(tonAmount * 1000000000);

/**
 * 生成指定范围内的随机整数
 * @param {number} min - 最小值（包含）
 * @param {number} max - 最大值（包含）
 * @returns {number} - 随机整数
 */
export function getRandomInt(min: number, max: number) {
  if (min > max) {
      throw new Error("最小值不能大于最大值");
  }
  // Math.random() 生成 [0, 1) 的随机数
  // Math.floor 向下取整，以确保返回整数
  return Math.floor(Math.random() * (max - min + 1)) + min;
}