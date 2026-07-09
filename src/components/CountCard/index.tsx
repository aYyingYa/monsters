import {
  COUNT_CARD_MARGIN_BOTTOM,
  COUNT_CARD_NOT_IN_WORLD_PREFIX,
  COUNT_CARD_NO_CELL_CAR_TEXT,
  COUNT_CARD_NO_CELL_PREFIX,
  COUNT_CARD_NO_CELL_SUFFIX,
  EMPTY_NAME_LIST_TEXT,
  NAME_LIST_SEPARATOR,
  ZERO,
} from "../../configs";
import { Card, Col, Divider, Row } from "antd";
import type { CountCardProps } from "./type";
import React from "react";

// #region 私有函数与统计卡片
const
  /**
   * 计算车数预估文案
   * @param targetName 目标怪物名称
   * @param remaining 剩余数量
   * @param cell 单车数量
   * @returns 车数文案
   */
  buildCarText = (targetName: string, remaining: number, cell: number | false): string => {
    if (cell && cell > ZERO) {
      return `打${targetName}还需${Math.ceil(remaining / cell)}车`;
    }
    return COUNT_CARD_NO_CELL_CAR_TEXT;
  },
  /**
   * 怪物统计卡片
   * @param props 组件属性
   * @returns 统计卡片控件
   */
  CountCard: React.FC<CountCardProps> = (props) => {
    // #region 解构属性与计算展示文案
    const
      {
        cell = false,
        count,
        inCurrentWorldNames,
        limit,
        targetName,
        title,
      } = props,
      remaining = Math.max(limit - count, ZERO),
      carText = buildCarText(targetName, remaining, cell),
      remainingText = `${COUNT_CARD_NO_CELL_PREFIX}${remaining}${COUNT_CARD_NO_CELL_SUFFIX}`,
      nameListDisplay = inCurrentWorldNames.join(NAME_LIST_SEPARATOR) || EMPTY_NAME_LIST_TEXT;
    // #endregion

    // #region 渲染
    return (
      <Card
        extra={<div><span style={{ fontSize: "24px" }}>{count}</span>\{limit}</div>}
        style={{ marginBottom: COUNT_CARD_MARGIN_BOTTOM }}
        title={title}
        variant="borderless"
      >
        <Row gutter={8}>
          <Col span={12}>{remainingText}</Col>
          <Col span={12}>{cell && cell > ZERO && carText}</Col>
        </Row>
        <Divider size="small" />
        <div>{`${COUNT_CARD_NOT_IN_WORLD_PREFIX}${nameListDisplay}`}</div>
      </Card>
    );
    // #endregion
  };
// #endregion

export default CountCard;
