import moment from "moment";
moment.locale("zh-cn");

/**
 * 时间格式转换
 * @param time
 * @param dateFormat
 */
export function getTime(time: string | number | Date, dateFormat = "YYYY-MM-DD HH:mm:ss", isUseUtc = false) {
  if (
    new Date(time).getTime() === 0 ||
    time === "1970-01-01T08:00:01+08:00" ||
    time === "0001-01-01T00:00:00Z"
  ) {
    return "";
  }
  if(!isUseUtc){
    return moment(time).format(dateFormat);
  } else {
    return moment(time).utc().format(dateFormat);
  };
}

export function isToday(timestamp: number) {
  // 当前日期
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startOfDay = today.getTime();

  // 下一天的0点，也就是今天的结束时间
  const endOfDay = startOfDay + 24 * 60 * 60 * 1000 - 1;

  // 判断给定的时间戳是否在今天范围内
  return timestamp >= startOfDay && timestamp <= endOfDay;
}

/**
 * 获取当前日期所在周的周日的日期，并根据指定格式返回 (基于 UTC)
 * @param {string} format - 指定日期的格式，支持 'yyyy', 'mm', 'dd' 作为占位符
 * @returns {string} - 返回指定格式的周日日期（基于 UTC 时间）
 */
export function getSundayOfThisWeekUTC(format = 'yyyy-mm-dd') {
  const today = new Date();
  const dayOfWeek = today.getUTCDay(); // 获取今天是周几，0 表示周日 (UTC)
  const sunday = new Date(today); // 复制当前日期

  // 计算距离周日的天数，并调整日期 (UTC)
  const diff = 7 - dayOfWeek;
  sunday.setUTCDate(today.getUTCDate() + diff);

  const year = sunday.getUTCFullYear();
  const month = String(sunday.getUTCMonth() + 1).padStart(2, '0'); // 月份从 0 开始
  const day = String(sunday.getUTCDate()).padStart(2, '0');

  // 定义替换占位符的映射
  const replacements: any = {
      yyyy: year,
      mm: month,
      dd: day,
  };

  // 动态替换格式中的占位符
  return format.replace(/yyyy|mm|dd/gi, matched => replacements[matched]);
}