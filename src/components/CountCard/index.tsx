import {
  COUNT_CARD_LIMIT_REACHED_TEXT,
  COUNT_CARD_MARGIN_BOTTOM,
  COUNT_CARD_NOT_IN_WORLD_PREFIX,
  COUNT_CARD_NO_CELL_CAR_TEXT,
  COUNT_CARD_NO_CELL_PREFIX,
  COUNT_CARD_NO_CELL_SUFFIX,
  EMPTY_NAME_LIST_TEXT,
  NAME_LIST_SEPARATOR,
  SCREENSHOT_BUTTON_TITLE,
  SCREENSHOT_FAILURE_MESSAGE,
  SCREENSHOT_SUCCESS_MESSAGE,
  ZERO,
} from "../../configs";
import { App, Button, Card, Col, Divider, Row, Space, Tooltip } from "antd";
import { CameraOutlined } from "@ant-design/icons";
import type { CountCardProps } from "./type";
import React, { useCallback, useRef, useState } from "react";
import useScreenshot from "../../hooks/useScreenshot";

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
   * 计算剩余数量展示文案
   * @param remaining 剩余数量
   * @returns 展示文案
   */
  buildRemainingText = (remaining: number): string => {
    if (remaining <= ZERO) {
      return COUNT_CARD_LIMIT_REACHED_TEXT;
    }
    return `${COUNT_CARD_NO_CELL_PREFIX}${remaining}${COUNT_CARD_NO_CELL_SUFFIX}`;
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
      remainingText = buildRemainingText(remaining),
      nameListDisplay = inCurrentWorldNames.join(NAME_LIST_SEPARATOR) || EMPTY_NAME_LIST_TEXT,
      cardRef = useRef<HTMLDivElement>(null),
      { message } = App.useApp(),
      { capture } = useScreenshot(),
      [screenshotLoading, setScreenshotLoading] = useState(false),
      handleScreenshot = useCallback(async (): Promise<void> => {
        if (!cardRef.current) {
          message.error(SCREENSHOT_FAILURE_MESSAGE);
          return;
        }
        setScreenshotLoading(true);
        const success = await capture(cardRef.current);
        setScreenshotLoading(false);
        if (success) {
          message.success(SCREENSHOT_SUCCESS_MESSAGE);
        } else {
          message.error(SCREENSHOT_FAILURE_MESSAGE);
        }
      }, [capture, message]);
    // #endregion

    // #region 渲染
    return (
      <div ref={cardRef}>
        <Card
          extra={<div><span style={{ fontSize: "24px" }}>{count}</span>\{limit}</div>}
          style={{ marginBottom: COUNT_CARD_MARGIN_BOTTOM }}
          title={
            <Space align="center" size={8}>
              <span>{title}</span>
              <Tooltip title={SCREENSHOT_BUTTON_TITLE}>
                <Button
                  data-screenshot-exclude
                  icon={<CameraOutlined />}
                  loading={screenshotLoading}
                  onClick={handleScreenshot}
                  size="small"
                  type="text"
                />
              </Tooltip>
            </Space>
          }
          variant="borderless"
        >
          <Row gutter={8}>
            <Col span={12}>{remainingText}</Col>
            <Col span={12}>{cell && cell > ZERO && carText}</Col>
          </Row>
          <Divider size="small" />
          <div>{`${COUNT_CARD_NOT_IN_WORLD_PREFIX}${nameListDisplay}`}</div>
        </Card>
      </div>
    );
    // #endregion
  };
// #endregion

export default CountCard;
