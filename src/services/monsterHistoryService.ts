import type { MonsterType } from "../configs";
import localforage from "localforage";

// #region 类型定义
/**
 * 名称与怪物属性的绑定记录
 */
interface MonsterHistoryRecord {
  /**
   * 怪物数量
   */
  count: string;
  /**
   * 怪物类型
   */
  type: MonsterType;
}

/**
 * 名称到怪物属性的映射
 */
type NameMonsterMap = Record<string, MonsterHistoryRecord>;
// #endregion

// #region 常量与服务实现
const
  /** 历史存储实例名称 */
  HISTORY_DRIVER_NAME = "monsterHistory",
  /** 名称怪物映射存储键 */
  NAME_MONSTER_MAP_KEY = "nameMonsterMap",
  /** 历史存储实例 */
  storage = localforage.createInstance({
    description: "怪物名称与属性历史记录",
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
    name: HISTORY_DRIVER_NAME,
    storeName: "history",
    version: 1,
  }),
  /**
   * 加载名称怪物映射
   * @returns 名称到怪物属性的映射对象
   */
  loadNameMonsterMap = async (): Promise<NameMonsterMap> => {
    const nameMonsterMap = await storage.getItem<NameMonsterMap>(NAME_MONSTER_MAP_KEY);
    return nameMonsterMap ?? {};
  },
  /**
   * 保存名称怪物映射
   * @param nameMonsterMap 名称到怪物属性的映射对象
   */
  saveNameMonsterMap = async (nameMonsterMap: NameMonsterMap): Promise<void> => {
    await storage.setItem(NAME_MONSTER_MAP_KEY, nameMonsterMap);
  };
// #endregion

export { loadNameMonsterMap, saveNameMonsterMap };
export type { MonsterHistoryRecord, NameMonsterMap };
