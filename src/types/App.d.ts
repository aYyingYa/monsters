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
 * 呱唧地账号记录
 */
export interface AccountRecord {
  /**
   * 记录id
   */
  id: string;
  /**
   * 游戏uid（9位数字）
   */
  uid: string;
  /**
   * 账号名
   */
  accountName: string;
  /**
   * 账号（手机号或邮箱，展示时需脱敏）
   */
  account: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 额外信息（选填）
   */
  extraInfo?: string;
}

/**
 * 呱唧地账号表单数据
 */
export interface AccountFormValues {
  /**
   * 游戏uid（9位数字）
   */
  uid: string;
  /**
   * 账号名
   */
  accountName: string;
  /**
   * 账号（手机号或邮箱）
   */
  account: string;
  /**
   * 密码
   */
  password: string;
  /**
   * 额外信息（选填）
   */
  extraInfo?: string;
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
