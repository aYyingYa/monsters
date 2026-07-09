import {
  MILLISECONDS_PER_SECOND,
  MINUTES_PER_HOUR,
  SECONDS_PER_MINUTE,
  TIMER_FRACTION_DIGITS,
  TIME_PAD_LENGTH,
  TIME_PAD_STRING,
  TIME_SEPARATOR,
  ZERO,
} from "../configs";
import type { Monster } from "../types/App";

export const
  /**
   * 将毫秒时长格式化为 时:分:秒:毫秒
   * @param elapsedMs 毫秒时长
   * @returns 格式化后的时间字符串
   */
  formatElapsedTime = (elapsedMs: number): string => {
    const fractional = elapsedMs % MILLISECONDS_PER_SECOND,
     parts = [
      Math.floor(elapsedMs / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE / MINUTES_PER_HOUR),
      Math.floor((elapsedMs / MILLISECONDS_PER_SECOND / SECONDS_PER_MINUTE) % MINUTES_PER_HOUR),
      Math.floor((elapsedMs / MILLISECONDS_PER_SECOND) % SECONDS_PER_MINUTE),
    ].map((value) => value.toString().padStart(TIME_PAD_LENGTH, TIME_PAD_STRING));

    return [...parts, fractional.toString().padStart(TIMER_FRACTION_DIGITS, TIME_PAD_STRING)]
      .join(TIME_SEPARATOR);
  },
  /**
   * 按怪物类型累计数量
   * @param monsters 怪物列表
   * @param type 怪物类型
   * @returns 累计数量
   */
  reduceMonsterCount = (monsters: Monster[], type: Monster["type"]): number => (
    monsters.reduce((prev, cur) => {
      if (cur.type === type) {
        return prev + (cur.count || ZERO);
      }
      return prev;
    }, ZERO)
  );
