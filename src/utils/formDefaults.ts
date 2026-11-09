import type { FormDefaults, NameMonsterMap } from "../services/monsterHistoryService";
import type { MonsterType } from "../configs";

// #region 类型定义
/**
 * 级联取值结果
 */
interface CascadeValueResult {
  /**
   * 级联取值（无默认值与最近使用值时为空串）
   */
  value: string;
  /**
   * 值是否来自显式默认值（false 表示来自最近使用值）
   */
  fromDefault: boolean;
}
// #endregion

// #region 级联取值解析器
const
  /** 数量历史首位下标（即最近使用数量，下拉选项[0]） */
  LATEST_COUNT_INDEX = 0,
  /**
   * 解析指定类型的默认怪物名称（仅右键显式设置的默认值生效，
   * 与最近使用是两套独立概念；无默认值或默认值已悬空时返回空串）
   * @param type 怪物类型
   * @param nameByType 类型到默认名称的映射
   * @param nameMonsterMap 名称到怪物属性的映射（用于校验默认值是否悬空）
   * @returns 默认怪物名称，无有效默认值时为空串
   */
  resolveDefaultName = (
    type: MonsterType,
    nameByType: FormDefaults["nameByType"],
    nameMonsterMap: NameMonsterMap
  ): string => {
    const customName = nameByType[type];
    // 默认值需仍存在且类型匹配，历史删除后悬空则不生效
    if (typeof customName !== "undefined" && nameMonsterMap[customName]?.type === type) {
      return customName;
    }
    return "";
  },
  /**
   * 解析指定名称的默认怪物数量（仅右键显式设置的默认值生效，
   * 与最近使用是两套独立概念；无默认值时返回空串）
   * @param name 怪物名称
   * @param countByName 名称到默认数量的映射
   * @returns 默认怪物数量，无默认值时为空串
   */
  resolveDefaultCount = (
    name: string,
    countByName: FormDefaults["countByName"]
  ): string => countByName[name] ?? "",
  /**
   * 级联解析指定类型的怪物名称（d 切换后取值：优先 b 默认值，无 b 取 a 最近使用值）
   * @param type 怪物类型
   * @param nameByType 类型到默认名称的映射
   * @param nameMonsterMap 名称到怪物属性的映射（键序即最近使用顺序）
   * @returns 级联取值结果
   */
  resolveCascadeName = (
    type: MonsterType,
    nameByType: FormDefaults["nameByType"],
    nameMonsterMap: NameMonsterMap
  ): CascadeValueResult => {
    const
      defaultName = resolveDefaultName(type, nameByType, nameMonsterMap),
      // A 最近使用值：该类型在历史中的首个名称（无保存记录时为 undefined）
      latestName = Object.keys(nameMonsterMap).find(
        (name) => nameMonsterMap[name]?.type === type
      );
    if (defaultName !== "") {
      return { fromDefault: true, value: defaultName };
    }
    if (typeof latestName !== "undefined") {
      return { fromDefault: false, value: latestName };
    }
    return { fromDefault: false, value: "" };
  },
  /**
   * 级联解析指定名称的怪物数量（d 切换后取值：优先 b 默认值，无 b 取 a 最近使用值）
   * @param name 怪物名称
   * @param countByName 名称到默认数量的映射
   * @param nameMonsterMap 名称到怪物属性的映射（counts 存储序即最近使用顺序）
   * @returns 级联取值结果
   */
  resolveCascadeCount = (
    name: string,
    countByName: FormDefaults["countByName"],
    nameMonsterMap: NameMonsterMap
  ): CascadeValueResult => {
    const
      defaultCount = resolveDefaultCount(name, countByName),
      // A 最近使用值：该名称数量历史首位（无保存记录时为 undefined）
      latestCount = nameMonsterMap[name]?.counts[LATEST_COUNT_INDEX];
    if (defaultCount !== "") {
      return { fromDefault: true, value: defaultCount };
    }
    if (typeof latestCount !== "undefined") {
      return { fromDefault: false, value: latestCount };
    }
    return { fromDefault: false, value: "" };
  };

export { resolveCascadeCount, resolveCascadeName, resolveDefaultCount, resolveDefaultName };
export type { CascadeValueResult };
// #endregion
