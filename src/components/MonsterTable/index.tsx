import { Table } from "antd";
import { SCROLL_X, createColumns } from "../../configs";
import type { MonsterTableProps } from "./type";
import React, { useMemo } from "react";

/**
 * 怪物记录表格（带编辑删除操作列、受控筛选排序）
 * @param props 组件属性
 * @returns 表格控件
 */
const MonsterTable: React.FC<MonsterTableProps> = (props) => {
  // #region 解构属性与列配置缓存
  const
    {
      filteredInfo,
      monsters,
      onDelete,
      onEdit,
      onTableChange,
      sortInfo,
    } = props,
    /**
     * 缓存表格列配置，避免每次渲染重新创建导致筛选弹窗状态异常
     */
    columns = useMemo(
      () => createColumns(onEdit, onDelete, { filteredInfo, sortInfo }),
      [filteredInfo, onDelete, onEdit, sortInfo]
    );
  // #endregion

  // #region 渲染
  return (
    <Table
      columns={columns}
      dataSource={monsters}
      onChange={onTableChange}
      pagination={{
        showPrevNextJumpers: true,
        showQuickJumper: true,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
        total: monsters.length,
      }}
      rowKey={(record) => record.id}
      style={{ borderRadius: "8px" }}
      scroll={{ [SCROLL_X]: 'max-content' }}
    />
  );
  // #endregion
};

export default MonsterTable;
