import type { FormValues, Monster } from "../../types/App";
import type { FormInstance } from "antd/es/form";

/**
 * 组件MonsterCountSummary的属性
 */
export interface MonsterCountSummaryProps {
  /**
   * 小怪累计数量
   */
  defaultMonsterCount: number;
  /**
   * 精英怪累计数量
   */
  eliteMonsterCount: number;
  /**
   * 表单实例
   */
  form: FormInstance<FormValues>;
  /**
   * 怪物列表
   */
  monsters: Monster[];
}
