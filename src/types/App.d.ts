import type { MonsterType } from "../configs";

/**
 * 怪物接口
 */
export interface Monster {
  /**
   * 怪物id
   */
  id: string;
  /**
   * 怪物名称
   */
  name: string;
  /**
   * 怪物数量
   */
  count: number;
  /**
   * 怪物类型
   */
  type: MonsterType;
  /**
   * 是否在本世界
   */
  isInCurrentWorld: boolean;
  /**
   * 时间
   */
  time: number;
  /**
   * 用时
   */
  usedTime: number;
}

/**
 * 表单数据接口
 */
export interface FormValues {
  /**
   * 怪物名称
   */
  name: string;
  /**
   * 怪物数量（输入阶段为字符串）
   */
  count: string;
  /**
   * 怪物类型
   */
  type: MonsterType;
  /**
   * 是否在本世界
   */
  isInCurrentWorld: boolean;
  /**
   * 最终用时（隐藏字段）
   */
  usedTime?: number;
}
