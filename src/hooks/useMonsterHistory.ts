import { useEffect, useState } from "react";
import { loadNameCountMap, saveNameCountMap } from "../services/monsterHistoryService";

// #region 类型定义
/**
 * 怪物历史 Hook 返回结果
 */
interface UseMonsterHistoryResult {
  /**
   * 去重后的历史数量选项
   */
  countHistory: string[];
  /**
   * 名称到数量的映射
   */
  nameCountMap: Record<string, string>;
  /**
   * 去重后的历史名称选项
   */
  nameHistory: string[];
  /**
   * 保存名称与数量的绑定关系
   * @param name 怪物名称
   * @param count 怪物数量
   */
  saveNameCount: (name: string, count: string) => Promise<void>;
}
// #endregion

// #region Hook 实现
/**
 * 怪物名称与数量历史记录 Hook
 * @returns 历史记录状态与操作
 */
const useMonsterHistory = (): UseMonsterHistoryResult => {
  // #region 状态、计算属性与保存
  const
    [nameCountMap, setNameCountMap] = useState<Record<string, string>>({}),
    nameHistory = Object.keys(nameCountMap),
    countHistory = [...new Set(Object.values(nameCountMap))].sort(),
    /**
     * 保存名称与数量的绑定关系
     * @param name 怪物名称
     * @param count 怪物数量
     */
    saveNameCount = async (name: string, count: string): Promise<void> => {
      const nextMap = { ...nameCountMap, [name]: count };
      setNameCountMap(nextMap);
      await saveNameCountMap(nextMap);
    };
  // #endregion

  // #region 初始化加载
  useEffect(() => {
    let isCancelled = false;
    (async (): Promise<void> => {
      const loadedMap = await loadNameCountMap();
      if (!isCancelled) {
        setNameCountMap(loadedMap);
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
    nameCountMap,
    nameHistory,
    saveNameCount,
  };
};
// #endregion

export default useMonsterHistory;
export type { UseMonsterHistoryResult };
