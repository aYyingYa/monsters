import type { Monster } from "../types/App";

// #region 类型定义
/**
 * 按日期存储的怪物文件
 */
export interface MonsterFile {
  /**
   * 日期，格式 YYYY-MM-DD
   */
  date: string;
  /**
   * 当日怪物记录
   */
  monsters: Monster[];
}

/**
 * 怪物存储服务接口
 */
export interface MonsterStorageService {
  /**
   * 删除指定日期的文件
   * @param date 日期
   */
  deleteByDate: (date: string) => Promise<void>;
  /**
   * 获取所有已存在的日期列表
   * @returns 日期数组
   */
  listDates: () => Promise<string[]>;
  /**
   * 读取某日期记录
   * @param date 日期
   * @returns 怪物数组
   */
  loadByDate: (date: string) => Promise<Monster[]>;
  /**
   * 保存某日期记录
   * @param date 日期
   * @param monsters 怪物数组
   */
  saveByDate: (date: string, monsters: Monster[]) => Promise<void>;
  /**
   * 确保指定日期在索引中存在（不存在时创建空记录）
   * @param date 日期
   */
  ensureDate: (date: string) => Promise<void>;
}
// #endregion
