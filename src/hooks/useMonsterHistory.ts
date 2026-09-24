import { useEffect, useState } from "react";
import type { MonsterType } from "../configs";
import {
  type MonsterHistoryRecord,
  type NameMonsterMap,
  loadNameMonsterMap,
  saveNameMonsterMap,
} from "../services/monsterHistoryService";

// #region 类型定义
/**
 * 怪物历史 Hook 返回结果
 */
interface UseMonsterHistoryResult {
  /**
   * 名称到怪物属性的映射
   */
  nameMonsterMap: NameMonsterMap;
  /**
   * 保存名称与怪物属性的绑定关系（数量历史去重合并，最近使用在前）
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
  // #region 状态、合并工具与保存
  const
    [nameMonsterMap, setNameMonsterMap] = useState<NameMonsterMap>({}),
    /**
     * 合并数量历史：本次数量提到最前，并去掉旧值中的重复项
     * @param existingRecord 已有的绑定记录
     * @param count 本次保存的数量
     * @returns 去重后的数量历史
     */
    mergeCounts = (existingRecord: MonsterHistoryRecord | undefined, count: string): string[] => {
      if (typeof existingRecord === "undefined") {
        return [count];
      }
      return [count, ...existingRecord.counts.filter((historyCount) => historyCount !== count)];
    },
    /**
     * 保存名称与怪物属性的绑定关系
     * @param name 怪物名称
     * @param type 怪物类型
     * @param count 怪物数量
     */
    saveMonsterHistory = async (name: string, type: MonsterType, count: string): Promise<void> => {
      const nextMap: NameMonsterMap = {
        ...nameMonsterMap,
        [name]: { counts: mergeCounts(nameMonsterMap[name], count), type },
      };
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
    nameMonsterMap,
    saveMonsterHistory,
  };
};
// #endregion

export default useMonsterHistory;
export type { UseMonsterHistoryResult };
