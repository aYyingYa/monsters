/**
 * 组件FormItems的属性
 */
export interface FormItemsProps {
  /**
   * 历史数量选项
   */
  countHistory: string[];
  /**
   * 已运行的毫秒数
   */
  elapsedMs: number;
  /**
   * 计时器运行模式
   */
  mode: "idle" | "paused" | "running";
  /**
   * 历史名称选项
   */
  nameHistory: string[];
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
   * 选择历史名称回调
   * @param name 选中的名称
   */
  onNameSelect: (name: string) => void;
  /**
   * 暂停计时回调
   */
  onPauseTimer: () => void;
  /**
   * 继续计时回调
   */
  onResumeTimer: () => void;
  /**
   * 开始计时回调
   */
  onStartTimer: () => void;
}
