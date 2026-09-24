import type { NameMonsterMap } from "../../services/monsterHistoryService";

/**
 * 组件FormItems的属性
 */
export interface FormItemsProps {
  /**
   * 已运行的毫秒数
   */
  elapsedMs: number;
  /**
   * 计时器运行模式
   */
  mode: "idle" | "paused" | "running";
  /**
   * 名称到怪物属性的映射
   */
  nameMonsterMap: NameMonsterMap;
  /**
   * 取消当前计时且不记录
   */
  onCancelRecord: () => void;
  /**
   * 结束并记录确认回调
   */
  onConfirmRecord: () => void;
  /**
   * 不计用时直接插入记录
   */
  onInsertNoTimeRecord: () => Promise<void>;
  /**
   * 暂停计时回调
   */
  onPauseTimer: () => void;
  /**
   * 删除数量项回调
   * @param name 怪物名称
   * @param count 待删除的数量
   */
  onRemoveCount: (name: string, count: string) => Promise<void>;
  /**
   * 删除名称记录回调
   * @param name 怪物名称
   */
  onRemoveRecord: (name: string) => Promise<void>;
  /**
   * 继续计时回调
   */
  onResumeTimer: () => void;
  /**
   * 开始计时回调
   */
  onStartTimer: () => void;
  /**
   * 更新数量项回调
   * @param name 怪物名称
   * @param oldCount 原数量
   * @param newCount 新数量
   */
  onUpdateCount: (name: string, oldCount: string, newCount: string) => Promise<void>;
  /**
   * 更新名称记录回调
   * @param oldName 原名称
   * @param name 新名称
   * @param counts 新数量历史列表
   */
  onUpdateRecord: (oldName: string, name: string, counts: string[]) => Promise<void>;
}
