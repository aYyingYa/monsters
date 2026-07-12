import { useEffect, useState } from "react";
import type { MonsterType } from "../configs";
import { loadNameMonsterMap, saveNameMonsterMap } from "../services/monsterHistoryService";

// #region 类型定义
/**
 * 怪物属性绑定记录
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
 * 怪物历史 Hook 返回结果
 */
interface UseMonsterHistoryResult {
  /**
   * 去重后的历史数量选项
   */
  countHistory: string[];
  /**
   * 名称到怪物属性的映射
   */
  nameMonsterMap: Record<string, MonsterHistoryRecord>;
  /**
   * 去重后的历史名称选项
   */
  nameHistory: string[];
  /**
   * 保存名称与怪物属性的绑定关系
   * @param name 怪物名称
   * @param type 怪物类型
   * @param count 怪物数量
   */
  saveMonsterHistory: (name: string, type: MonsterType, count: string) => Promise<void>;
}
// #endregion

// #region Hook 实现
/**
 * 怪物名称与属性历史记录 Hook
 * @returns 历史记录状态与操作
 */
const useMonsterHistory = (): UseMonsterHistoryResult => {
  // #region 状态、计算属性与保存
  const
    [nameMonsterMap, setNameMonsterMap] = useState<Record<string, MonsterHistoryRecord>>({}),
    nameHistory = Object.keys(nameMonsterMap),
    countHistory = [...new Set(Object.values(nameMonsterMap).map((record) => record.count))].sort(),
    /**
     * 保存名称与怪物属性的绑定关系
     * @param name 怪物名称
     * @param type 怪物类型
     * @param count 怪物数量
     */
    saveMonsterHistory = async (name: string, type: MonsterType, count: string): Promise<void> => {
      const nextMap = { ...nameMonsterMap, [name]: { count, type } };
      setNameMonsterMap(nextMap);
      await saveNameMonsterMap(nextMap);
    };
  // #endregion

  // #region 初始化加载
  useEffect(() => {
    let isCancelled = false;
    (async (): Promise<void> => {
      const loadedMap = await loadNameMonsterMap();
      if (!isCancelled) {
        setNameMonsterMap(loadedMap);
      }
    })().catch(() => {
      // 加载失败时保持空状态，避免页面崩溃
    });
    return (): void => {
      isCancelled = true;
    };
  }, []);
  // #endregion

  return {
    countHistory,
    nameHistory,
    nameMonsterMap,
    saveMonsterHistory,
  };
};
// #endregion

export default useMonsterHistory;
export type { UseMonsterHistoryResult };
