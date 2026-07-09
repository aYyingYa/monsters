import {
  ACTION_LABEL,
  TIMER_CANCEL_LABEL,
  TIMER_END_LABEL,
  TIMER_PAUSE_LABEL,
  TIMER_RESUME_LABEL,
  TIMER_START_LABEL,
} from "../../configs";
import type { FormItemsProps } from "./type";
import { Button, Col, Form, Row } from "antd";
import React from "react";

// #region 类型定义
type ActionButtonProps = Pick<
  FormItemsProps,
  | "mode"
  | "onCancelRecord"
  | "onConfirmRecord"
  | "onPauseTimer"
  | "onResumeTimer"
  | "onStartTimer"
>;
// #endregion

// #region 操作按钮
/**
 * 操作按钮
 * @param props 组件属性
 * @returns 操作按钮控件
 */
const ActionButton: React.FC<ActionButtonProps> = (props) => {
  // #region 解构属性
  const {
    mode,
    onCancelRecord,
    onConfirmRecord,
    onPauseTimer,
    onResumeTimer,
    onStartTimer,
  } = props;
  // #endregion

  // #region 渲染
  if (mode === "running") {
    return (
      <Form.Item label={ACTION_LABEL}>
        <Row gutter={8}>
          <Col span={12}>
            <Button block danger htmlType="button" onClick={onConfirmRecord} type="primary">
              {TIMER_END_LABEL}
            </Button>
          </Col>
          <Col span={12}>
            <Button block htmlType="button" onClick={onPauseTimer}>
              {TIMER_PAUSE_LABEL}
            </Button>
          </Col>
        </Row>
      </Form.Item>
    );
  }

  if (mode === "paused") {
    return (
      <Form.Item label={ACTION_LABEL}>
        <Row gutter={8}>
          <Col span={12}>
            <Button block htmlType="button" onClick={onResumeTimer} type="primary">
              {TIMER_RESUME_LABEL}
            </Button>
          </Col>
          <Col span={12}>
            <Button block danger htmlType="button" onClick={onCancelRecord}>
              {TIMER_CANCEL_LABEL}
            </Button>
          </Col>
        </Row>
      </Form.Item>
    );
  }

  return (
    <Form.Item label={ACTION_LABEL}>
      <Button block htmlType="button" onClick={onStartTimer}>
        {TIMER_START_LABEL}
      </Button>
    </Form.Item>
  );
  // #endregion
};
// #endregion

export default ActionButton;
