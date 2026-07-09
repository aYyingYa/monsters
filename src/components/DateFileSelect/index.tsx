import { Select } from "antd";
import type { DateFileSelectProps } from "./type";
import React from "react";

/**
 * 日期文件选择下拉框
 * @param props 组件属性
 * @returns 日期选择控件
 */
const DateFileSelect: React.FC<DateFileSelectProps> = (props) => {
  // #region 解构属性
  const { activeDate, availableDates, onSelect } = props;
  // #endregion

  // #region 渲染
  return (
    <Select
      onChange={onSelect}
      options={availableDates.map((date) => ({ label: date, value: date }))}
      placeholder="选择日期文件"
      style={{ minWidth: "140px" }}
      value={activeDate}
    />
  );
  // #endregion
};

export default DateFileSelect;
