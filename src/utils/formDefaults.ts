import type { FormDefaults, NameMonsterMap } from "../services/monsterHistoryService";
import type { MonsterType } from "../configs";

// #region 级联默认值解析器
const
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
  ): string => countByName[name] ?? "";

export { resolveDefaultCount, resolveDefaultName };
// #endregion
