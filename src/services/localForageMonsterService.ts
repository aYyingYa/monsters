import localforage from "localforage";
import type { Monster } from "../types/App";
import type { MonsterStorageService } from "./storageService";

// #region 常量、配置与存储服务实现
const
  /** LocalForage 实例名称 */
  DRIVER_NAME = "monsterFiles",
  /** 日期索引键 */
  DATES_INDEX_KEY = "dates",
  /** 空怪物列表长度阈值 */
  EMPTY_MONSTERS_COUNT = 0,
  /**
   * 构建日期对应的 localForage 键
   * @param date 日期字符串
   * @returns 存储键
   */
  buildDateKey = (date: string): string => `file:${date}`,
  /** LocalForage 存储实例 */
  storage = localforage.createInstance({
    description: "怪物计数按日期持久化存储",
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
    name: DRIVER_NAME,
    storeName: "files",
    version: 1,
  }),
  /**
   * 从日期索引中移除指定日期
   * @param date 日期字符串
   */
  removeDateFromIndex = async (date: string): Promise<void> => {
    const
      storedDates = await storage.getItem<string[]>(DATES_INDEX_KEY),
      nextDates = (storedDates ?? []).filter((storedDate) => storedDate !== date);
    await storage.setItem(DATES_INDEX_KEY, nextDates);
  },
  /**
   * 将指定日期加入索引并排序
   * @param date 日期字符串
   */
  addDateToIndex = async (date: string): Promise<void> => {
    const
      storedDates = await storage.getItem<string[]>(DATES_INDEX_KEY),
      datesSet = new Set(storedDates ?? []);
    datesSet.add(date);
    await storage.setItem(DATES_INDEX_KEY, [...datesSet].sort());
  },
  /**
   * 基于 localForage 的怪物存储服务
   * @returns 存储服务实例
   */
  createLocalForageMonsterService = (): MonsterStorageService => ({
    deleteByDate: async (date: string): Promise<void> => {
      await removeDateFromIndex(date);
      await storage.removeItem(buildDateKey(date));
    },
    ensureDate: async (date: string): Promise<void> => {
      const storedDates = await storage.getItem<string[]>(DATES_INDEX_KEY) ?? [];
      if (storedDates.includes(date)) {
        return;
      }
      await storage.setItem(buildDateKey(date), []);
      await addDateToIndex(date);
    },
    listDates: async (): Promise<string[]> => {
      const storedDates = await storage.getItem<string[]>(DATES_INDEX_KEY);
      return storedDates ?? [];
    },
    loadByDate: async (date: string): Promise<Monster[]> => {
      const monsters = await storage.getItem<Monster[]>(buildDateKey(date));
      return monsters ?? [];
    },
    saveByDate: async (date: string, monsters: Monster[]): Promise<void> => {
      if (monsters.length === EMPTY_MONSTERS_COUNT) {
        await removeDateFromIndex(date);
        await storage.removeItem(buildDateKey(date));
        return;
      }
      await storage.setItem(buildDateKey(date), monsters);
      await addDateToIndex(date);
    },
  });
// #endregion

export default createLocalForageMonsterService;
