import localforage from "localforage";

// #region 常量与服务实现
const
  /** 历史存储实例名称 */
  HISTORY_DRIVER_NAME = "monsterHistory",
  /** 名称数量映射存储键 */
  NAME_COUNT_MAP_KEY = "nameCountMap",
  /** 历史存储实例 */
  storage = localforage.createInstance({
    description: "怪物名称与数量历史记录",
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
    name: HISTORY_DRIVER_NAME,
    storeName: "history",
    version: 1,
  }),
  /**
   * 加载名称数量映射
   * @returns 名称到数量的映射对象
   */
  loadNameCountMap = async (): Promise<Record<string, string>> => {
    const nameCountMap = await storage.getItem<Record<string, string>>(NAME_COUNT_MAP_KEY);
    return nameCountMap ?? {};
  },
  /**
   * 保存名称数量映射
   * @param nameCountMap 名称到数量的映射对象
   */
  saveNameCountMap = async (nameCountMap: Record<string, string>): Promise<void> => {
    await storage.setItem(NAME_COUNT_MAP_KEY, nameCountMap);
  };
// #endregion

export { loadNameCountMap, saveNameCountMap };
