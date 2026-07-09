import type { FilterValue, SortOrder } from "antd/es/table/interface";
import type { Monster } from "../../types/App";
import type { TableProps } from "antd";

/**
 * 怪物表格组件属性
 */
interface MonsterTableProps {
  /**
   * 受控筛选状态
   */
  filteredInfo: Record<string, FilterValue | null>;
  /**
   * 怪物列表
   */
  monsters: Monster[];
  /**
   * 删除怪物回调
   * @param id 怪物 id
   */
  onDelete: (id: string) => void;
  /**
   * 编辑怪物回调
   * @param monster 怪物对象
   */
  onEdit: (monster: Monster) => void;
  /**
   * 表格变化回调
   */
  onTableChange: TableProps<Monster>["onChange"];
  /**
   * 受控排序状态
   */
  sortInfo: { columnKey: string; order: SortOrder } | null;
}

export type { MonsterTableProps };
