import type React from "react";

/**
 * 组件CountCard的属性
 */
export interface CountCardProps {
  /**
   * 标题
   */
  title: React.ReactNode;
  /**
   * 数量
   */
  count: number;
  /**
   * 数量上限
   */
  limit: number;
  /**
   * 单车数量
   */
  cell: number | false;
  /**
   * 在本世界的怪物名称列表
   */
  inCurrentWorldNames: string[];
  /**
   * 当前目标怪物名称
   */
  targetName: string;
}
