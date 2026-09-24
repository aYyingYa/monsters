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
  /**
   * 更新名称记录（支持改名与数量列表整体替换，类型沿用原记录）
   * @param oldName 原名称
   * @param name 新名称
   * @param counts 新数量历史列表
   */
  updateMonsterRecord: (oldName: string, name: string, counts: string[]) => Promise<void>;
  /**
   * 删除名称记录（连带其数量历史）
   * @param name 怪物名称
   */
  removeMonsterRecord: (name: string) => Promise<void>;
  /**
   * 更新指定名称的某个数量项（替换后整体去重，保持原顺序）
   * @param name 怪物名称
   * @param oldCount 原数量
   * @param newCount 新数量
   */
  updateCount: (name: string, oldCount: string, newCount: string) => Promise<void>;
  /**
   * 删除指定名称的某个数量项
   * @param name 怪物名称
   * @param count 待删除的数量
   */
  removeCount: (name: string, count: string) => Promise<void>;
}
// #endregion

// #region 纯函数工具与 Hook 实现
const
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
   * 替换数量历史中的指定项并整体去重（保持原顺序）
   * @param counts 原数量历史
   * @param oldCount 原数量
   * @param newCount 新数量
   * @returns 去重后的数量历史
   */
  replaceCount = (counts: string[], oldCount: string, newCount: string): string[] => [
    ...new Set(
      counts.map((historyCount) => {
        if (historyCount === oldCount) {
          return newCount;
        }
        return historyCount;
      }),
    ),
  ],
  /**
   * 剔除映射中的指定键（不可变方式，替代动态 delete）
   * @param map 原映射
   * @param name 待剔除的名称
   * @returns 剔除后的新映射
   */
  omitRecord = (map: NameMonsterMap, name: string): NameMonsterMap =>
    Object.fromEntries(Object.entries(map).filter(([key]) => key !== name)),
  /**
   * 怪物名称与属性历史记录 Hook
   * @returns 历史记录状态与操作
   */
  useMonsterHistory = (): UseMonsterHistoryResult => {
    // #region 状态与保存
    const
      [nameMonsterMap, setNameMonsterMap] = useState<NameMonsterMap>({}),
      /**
       * 应用映射变更：更新状态并持久化
       * @param nextMap 新的名称怪物映射
       */
      applyNextMap = async (nextMap: NameMonsterMap): Promise<void> => {
        setNameMonsterMap(nextMap);
        await saveNameMonsterMap(nextMap);
      },
      /**
       * 保存名称与怪物属性的绑定关系
       * @param name 怪物名称
       * @param type 怪物类型
       * @param count 怪物数量
       */
      saveMonsterHistory = async (name: string, type: MonsterType, count: string): Promise<void> => {
        await applyNextMap({
          ...nameMonsterMap,
          [name]: { counts: mergeCounts(nameMonsterMap[name], count), type },
        });
      },
      /**
       * 更新名称记录（支持改名与数量列表整体替换，类型沿用原记录）
       * @param oldName 原名称
       * @param name 新名称
       * @param counts 新数量历史列表
       */
      updateMonsterRecord = async (oldName: string, name: string, counts: string[]): Promise<void> => {
        const
          existingRecord = nameMonsterMap[oldName],
          // 先剔除旧键：改名时移除原记录，未改名时同名键稍后整体覆盖，无需特判
          nextMap: NameMonsterMap = omitRecord(nameMonsterMap, oldName);
        // 原记录不存在时不做任何事，提前捕获异常数据
        if (typeof existingRecord === "undefined") {
          return;
        }
        nextMap[name] = { counts, type: existingRecord.type };
        await applyNextMap(nextMap);
      },
      /**
       * 删除名称记录（连带其数量历史）
       * @param name 怪物名称
       */
      removeMonsterRecord = async (name: string): Promise<void> => {
        await applyNextMap(omitRecord(nameMonsterMap, name));
      },
      /**
       * 更新指定名称的某个数量项（替换后整体去重，保持原顺序）
       * @param name 怪物名称
       * @param oldCount 原数量
       * @param newCount 新数量
       */
      updateCount = async (name: string, oldCount: string, newCount: string): Promise<void> => {
        const existingRecord = nameMonsterMap[name];
        // 原记录不存在时不做任何事，提前捕获异常数据
        if (typeof existingRecord === "undefined") {
          return;
        }
        await applyNextMap({
          ...nameMonsterMap,
          [name]: { counts: replaceCount(existingRecord.counts, oldCount, newCount), type: existingRecord.type },
        });
      },
      /**
       * 删除指定名称的某个数量项
       * @param name 怪物名称
       * @param count 待删除的数量
       */
      removeCount = async (name: string, count: string): Promise<void> => {
        const existingRecord = nameMonsterMap[name];
        // 原记录不存在时不做任何事，提前捕获异常数据
        if (typeof existingRecord === "undefined") {
          return;
        }
        await applyNextMap({
          ...nameMonsterMap,
          [name]: {
            counts: existingRecord.counts.filter((historyCount) => historyCount !== count),
            type: existingRecord.type,
          },
        });
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
      removeCount,
      removeMonsterRecord,
      saveMonsterHistory,
      updateCount,
      updateMonsterRecord,
    };
  };
// #endregion

export default useMonsterHistory;
export type { UseMonsterHistoryResult };
