import dayjs from "dayjs";
import { useEffect, useState } from "react";
import createLocalForageMonsterService from "../services/localForageMonsterService";
import type { Monster } from "../types/App";

// #region 类型定义
/**
 * 怪物存储 Hook 返回结果
 */
interface UseMonsterStorageResult {
  /**
   * 当前选中的日期
   */
  activeDate: string;
  /**
   * 可选的日期文件列表
   */
  availableDates: string[];
  /**
   * 当前日期对应的怪物列表
   */
  monsters: Monster[];
  /**
   * 保存怪物列表到当前日期
   * @param nextMonsters 怪物列表
   */
  saveMonsters: (nextMonsters: Monster[]) => Promise<void>;
  /**
   * 切换到指定日期文件
   * @param date 目标日期
   */
  selectDate: (date: string) => Promise<void>;
}
// #endregion

// #region Hook 实现
/**
 * 怪物本地存储 Hook
 * @returns 存储状态与操作函数
 */
const useMonsterStorage = (): UseMonsterStorageResult => {
  // #region 状态与工具函数
  const
    /**
     * 游戏日期切换小时数（怪物每天凌晨4点刷新）
     */
    GAME_DATE_ROLL_HOUR = 4,
    /**
     * 获取以凌晨4点为基准的游戏日期字符串
     * @returns 格式为 YYYY-MM-DD 的日期
     */
    getTodayDateString = (): string => dayjs().subtract(GAME_DATE_ROLL_HOUR, "hour").format("YYYY-MM-DD"),
    storageService = createLocalForageMonsterService(),
    today = getTodayDateString(),
    [activeDate, setActiveDate] = useState(today),
    [monsterMap, setMonsterMap] = useState<Map<string, Monster[]>>(new Map()),
    availableDates = [...monsterMap.keys()].sort(),
    monsters = monsterMap.get(activeDate) ?? [],
    saveMonsters = async (nextMonsters: Monster[]): Promise<void> => {
      setMonsterMap((prev) => {
        const next = new Map(prev);
        next.set(activeDate, nextMonsters);
        return next;
      });
      await storageService.saveByDate(activeDate, nextMonsters);
    },
    selectDate = async (date: string): Promise<void> => {
      setActiveDate(date);
      setMonsterMap((prev) => {
        if (prev.has(date)) {
          return prev;
        }
        const next = new Map(prev);
        next.set(date, []);
        return next;
      });
      const monstersOfDate = await storageService.loadByDate(date);
      setMonsterMap((prev) => {
        if (prev.get(date) === monstersOfDate) {
          return prev;
        }
        const next = new Map(prev);
        next.set(date, monstersOfDate);
        return next;
      });
    };

  // #region 初始化：从持久化存储异步加载所有日期文件
  useEffect(() => {
    let isCancelled = false;
    (async (): Promise<void> => {
      const
        dates = await storageService.listDates(),
        initialMap = new Map<string, Monster[]>();
      if (!dates.includes(today)) {
        await storageService.ensureDate(today);
        dates.push(today);
      }
      await Promise.all(
        dates.map(async (date) => {
          const monstersOfDate = await storageService.loadByDate(date);
          initialMap.set(date, monstersOfDate);
        })
      );
      if (!isCancelled) {
        setMonsterMap(initialMap);
      }
    })().catch(() => {
      // 初始化失败时保持空状态，避免页面崩溃
    });
    return (): void => {
      isCancelled = true;
    };
  }, [storageService, today]);
  // #endregion

  return {
    activeDate,
    availableDates,
    monsters,
    saveMonsters,
    selectDate,
  };
};
// #endregion

export default useMonsterStorage;
export type { UseMonsterStorageResult };
