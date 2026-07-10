import {
  CURRENT_WORLD_NO,
  CURRENT_WORLD_YES,
  EMPTY_NAME_LIST_TEXT,
  MONSTER_TYPE_OPTIONS,
  TABLE_INDEX_OFFSET,
  TIME_FORMAT,
} from "./const";
import type { ColumnsType } from "antd/es/table";
import type { SortOrder } from "antd/es/table/interface";
import type { Monster } from "../types/App";
import { Button, Popconfirm, Space, Tag } from "antd";
import dayjs from "dayjs";
import { formatElapsedTime } from "../utils/calc";

// #region 类型定义
/**
 * 创建列配置选项
 */
interface CreateColumnsOptions {
  /**
   * 排序状态
   */
  sortInfo: { columnKey: string; order: SortOrder } | null;
}
// #endregion

// #region 私有常量与工具函数
const
  /**
   * 是否在本世界筛选选项
   */
  CURRENT_WORLD_FILTER_OPTIONS = [
    { text: CURRENT_WORLD_YES, value: CURRENT_WORLD_YES },
    { text: CURRENT_WORLD_NO, value: CURRENT_WORLD_NO },
  ],
  /**
   * 怪物类型筛选选项
   */
  MONSTER_TYPE_FILTER_OPTIONS = MONSTER_TYPE_OPTIONS.map((option) => ({
    text: option.label,
    value: option.value,
  })),
  /**
   * 计算当前列的排序状态
   * @param columnKey 列标识
   * @param sortInfo 排序状态
   * @returns 排序顺序
   */
  resolveSortOrder = (columnKey: string, sortInfo: CreateColumnsOptions["sortInfo"]): SortOrder => {
    if (sortInfo && sortInfo.columnKey === columnKey) {
      return sortInfo.order;
    }
    return null;
  },
  /**
   * 创建怪物表格列配置
   * @param onEdit 编辑回调
   * @param onDelete 删除回调
   * @param options 受控筛选排序选项
   * @returns 表格列配置
   */
  createColumns = (
  onEdit: (monster: Monster) => void,
  onDelete: (id: string) => void,
  options: CreateColumnsOptions
): ColumnsType<Monster> => {
  const { sortInfo } = options;
  return [
    {
      dataIndex: "index",
      key: "index",
      render: (___, __, index: number) => index + TABLE_INDEX_OFFSET,
      title: "序号",
    },
    {
      dataIndex: "name",
      key: "name",
      title: "怪物名称",
    },
    {
      dataIndex: "count",
      key: "count",
      render: (count: number | undefined) => {
        if (count) {
          return `${count.toString()}只`;
        }
        return EMPTY_NAME_LIST_TEXT;
      },
      title: "怪物数量",
    },
    {
      dataIndex: "type",
      filters: MONSTER_TYPE_FILTER_OPTIONS,
      key: "type",
      onFilter: (value, record) => record.type === value,
      title: "怪物类型",
    },
    {
      dataIndex: "isInCurrentWorld",
      filters: CURRENT_WORLD_FILTER_OPTIONS,
      key: "isInCurrentWorld",
      onFilter: (value, record) => record.isInCurrentWorld === (value === CURRENT_WORLD_YES),
      render: (isInCurrentWorld: boolean | undefined) => {
        if (isInCurrentWorld) {
          return <Tag color="green">{CURRENT_WORLD_YES}</Tag>;
        }
        return <Tag color="red">{CURRENT_WORLD_NO}</Tag>;
      },
      title: "是否在本世界",
    },
    {
      dataIndex: "time",
      key: "time",
      render: (time?: number) => {
        if (time) {
          return dayjs(time).format(TIME_FORMAT);
        }
        return EMPTY_NAME_LIST_TEXT;
      },
      sortOrder: resolveSortOrder("time", sortInfo),
      sorter: (first, second) => first.time - second.time,
      title: "时间(时:分:秒)",
    },
    {
      dataIndex: "usedTime",
      key: "usedTime",
      render: (usedTime?: number) => {
        if (typeof usedTime !== "undefined") {
          return formatElapsedTime(usedTime);
        }
        return EMPTY_NAME_LIST_TEXT;
      },
      title: "用时(时:分:秒:分秒)",
    },
    {
      key: "action",
      render: (_recordValue: unknown, record: Monster) => (
        <Space size="middle">
          <Button onClick={(): void => onEdit(record)} type="link">
            编辑
          </Button>
          <Popconfirm
            cancelText="取消"
            okText="删除"
            okType="danger"
            onConfirm={(): void => onDelete(record.id)}
            title="确认删除？"
          >
            <Button danger type="link">
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
      title: "操作",
    },
  ];
};
// #endregion

export default createColumns;
export { createColumns };
export type { CreateColumnsOptions };
