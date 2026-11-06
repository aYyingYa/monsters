import type { MonsterType } from "../configs";
import localforage from "localforage";

// #region 类型定义
/**
 * 名称与怪物属性的绑定记录
 */
interface MonsterHistoryRecord {
  /**
   * 怪物类型
   */
  type: MonsterType;
  /**
   * 该怪物的数量选择历史（去重，最近使用在前）
   */
  counts: string[];
}

/**
 * 名称到怪物属性的映射（键序即最近使用顺序，最近使用的名称在前）
 */
type NameMonsterMap = Record<string, MonsterHistoryRecord>;

/**
 * 表单级联默认值配置
 */
interface FormDefaults {
  /**
   * 怪物名称到默认数量的映射
   */
  countByName: Record<string, string>;
  /**
   * 怪物类型到默认名称的映射
   */
  nameByType: Partial<Record<MonsterType, string>>;
}
// #endregion

// #region 常量与服务实现
const
  /** 历史存储实例名称 */
  HISTORY_DRIVER_NAME = "monsterHistory",
  /** 名称怪物映射存储键 */
  NAME_MONSTER_MAP_KEY = "nameMonsterMap",
  /** 表单级联默认值存储键 */
  FORM_DEFAULTS_KEY = "formDefaults",
  /** 历史存储实例 */
  storage = localforage.createInstance({
    description: "怪物名称与属性历史记录",
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
    name: HISTORY_DRIVER_NAME,
    storeName: "history",
    version: 1,
  }),
  /**
   * 加载名称怪物映射（旧版单数量结构的记录直接丢弃）
   * @returns 名称到怪物属性的映射对象
   */
  loadNameMonsterMap = async (): Promise<NameMonsterMap> => {
    const storedMap = await storage.getItem<NameMonsterMap>(NAME_MONSTER_MAP_KEY);
    if (storedMap === null) {
      return {};
    }
    // 旧版记录没有 counts 数组字段，过滤丢弃避免脏数据
    return Object.fromEntries(
      Object.entries(storedMap).filter(([, record]) => Array.isArray(record.counts)),
    );
  },
  /**
   * 保存名称怪物映射
   * @param nameMonsterMap 名称到怪物属性的映射对象
   */
  saveNameMonsterMap = async (nameMonsterMap: NameMonsterMap): Promise<void> => {
    await storage.setItem(NAME_MONSTER_MAP_KEY, nameMonsterMap);
  },
  /**
   * 加载表单级联默认值（无记录时返回空配置）
   * @returns 级联默认值配置
   */
  loadFormDefaults = async (): Promise<FormDefaults> => {
    const storedDefaults = await storage.getItem<FormDefaults>(FORM_DEFAULTS_KEY);
    if (storedDefaults === null) {
      return { countByName: {}, nameByType: {} };
    }
    return {
      countByName: storedDefaults.countByName ?? {},
      nameByType: storedDefaults.nameByType ?? {},
    };
  },
  /**
   * 保存表单级联默认值
   * @param formDefaults 级联默认值配置
   */
  saveFormDefaults = async (formDefaults: FormDefaults): Promise<void> => {
    await storage.setItem(FORM_DEFAULTS_KEY, formDefaults);
  };
// #endregion

export { loadFormDefaults, loadNameMonsterMap, saveFormDefaults, saveNameMonsterMap };
export type { FormDefaults, MonsterHistoryRecord, NameMonsterMap };
