import { FileAddOutlined } from "@ant-design/icons";
import {
  ACTION_LABEL,
  NO_TIME_RECORD_CANCEL_TEXT,
  NO_TIME_RECORD_CONFIRM_TITLE,
  NO_TIME_RECORD_OK_TEXT,
  TIMER_CANCEL_LABEL,
  TIMER_END_LABEL,
  TIMER_PAUSE_LABEL,
  TIMER_RESUME_LABEL,
  TIMER_START_LABEL,
} from "../../configs";
import type { FormItemsProps } from "./type";
import { Button, Col, Form, Grid, Popconfirm, Row, Space } from "antd";
import React from "react";

// #region 类型定义
type ActionButtonProps = Pick<
  FormItemsProps,
  | "mode"
  | "onCancelRecord"
  | "onConfirmRecord"
  | "onInsertNoTimeRecord"
  | "onPauseTimer"
  | "onResumeTimer"
  | "onStartTimer"
>;

type RunningButtonRenderProps = {
  actionLabel: React.ReactNode;
  isMobile: boolean;
  onConfirmRecord: () => void;
  onPauseTimer: () => void;
};

type PausedButtonRenderProps = {
  actionLabel: React.ReactNode;
  isMobile: boolean;
  onCancelRecord: () => void;
  onResumeTimer: () => void;
};
// #endregion

// #region 布局常量、工具函数与组件
const { useBreakpoint } = Grid,
  SPAN_FULL = 24,
  SPAN_HALF = 12,
  GUTTER_MAIN = 8,
  /**
   * 构建带“不计用时”小图标的操作标签
   * @param onInsertNoTimeRecord 不计用时插入记录回调
   * @returns 标签节点
   */
  buildActionLabel = (onInsertNoTimeRecord: () => Promise<void>): React.ReactNode => (
    <Space onClick={(event): void => event.stopPropagation()}>
      {ACTION_LABEL}
      <Popconfirm
        cancelText={NO_TIME_RECORD_CANCEL_TEXT}
        okText={NO_TIME_RECORD_OK_TEXT}
        onConfirm={onInsertNoTimeRecord}
        title={NO_TIME_RECORD_CONFIRM_TITLE}
      >
        <Button icon={<FileAddOutlined />} size="small" type="text" />
      </Popconfirm>
    </Space>
  ),
  /**
   * 渲染运行中按钮
   * @param props 渲染属性
   * @returns 运行中按钮节点
   */
  renderRunningButtons = (props: RunningButtonRenderProps): React.ReactNode => {
    const { actionLabel, isMobile, onConfirmRecord, onPauseTimer } = props;

    if (isMobile) {
      return (
        <Form.Item colon={false} label={actionLabel}>
          <Row gutter={[GUTTER_MAIN, GUTTER_MAIN]}>
            <Col span={SPAN_FULL}>
              <Button
                block
                danger
                htmlType="button"
                onClick={onConfirmRecord}
                type="primary"
              >
                {TIMER_END_LABEL}
              </Button>
            </Col>
            <Col span={SPAN_FULL}>
              <Button block htmlType="button" onClick={onPauseTimer}>
                {TIMER_PAUSE_LABEL}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      );
    }

    return (
      <Form.Item colon={false} label={actionLabel}>
        <Row gutter={GUTTER_MAIN}>
          <Col span={SPAN_HALF}>
            <Button
              block
              danger
              htmlType="button"
              onClick={onConfirmRecord}
              type="primary"
            >
              {TIMER_END_LABEL}
            </Button>
          </Col>
          <Col span={SPAN_HALF}>
            <Button block htmlType="button" onClick={onPauseTimer}>
              {TIMER_PAUSE_LABEL}
            </Button>
          </Col>
        </Row>
      </Form.Item>
    );
  },
  /**
   * 渲染暂停中按钮
   * @param props 渲染属性
   * @returns 暂停中按钮节点
   */
  renderPausedButtons = (props: PausedButtonRenderProps): React.ReactNode => {
    const { actionLabel, isMobile, onCancelRecord, onResumeTimer } = props;

    if (isMobile) {
      return (
        <Form.Item colon={false} label={actionLabel}>
          <Row gutter={[GUTTER_MAIN, GUTTER_MAIN]}>
            <Col span={SPAN_FULL}>
              <Button
                block
                htmlType="button"
                onClick={onResumeTimer}
                type="primary"
              >
                {TIMER_RESUME_LABEL}
              </Button>
            </Col>
            <Col span={SPAN_FULL}>
              <Button
                block
                danger
                htmlType="button"
                onClick={onCancelRecord}
              >
                {TIMER_CANCEL_LABEL}
              </Button>
            </Col>
          </Row>
        </Form.Item>
      );
    }

    return (
      <Form.Item colon={false} label={actionLabel}>
        <Row gutter={GUTTER_MAIN}>
          <Col span={SPAN_HALF}>
            <Button
              block
              htmlType="button"
              onClick={onResumeTimer}
              type="primary"
            >
              {TIMER_RESUME_LABEL}
            </Button>
          </Col>
          <Col span={SPAN_HALF}>
            <Button block danger htmlType="button" onClick={onCancelRecord}>
              {TIMER_CANCEL_LABEL}
            </Button>
          </Col>
        </Row>
      </Form.Item>
    );
  },
  /**
   * 操作按钮
   * @param props 组件属性
   * @returns 操作按钮控件
   */
  ActionButton: React.FC<ActionButtonProps> = (props) => {
    // #region 解构属性与断点判断
    const {
        mode,
        onCancelRecord,
        onConfirmRecord,
        onInsertNoTimeRecord,
        onPauseTimer,
        onResumeTimer,
        onStartTimer,
      } = props,
      screens = useBreakpoint(),
      isMobile = !screens.md,
      actionLabel = buildActionLabel(onInsertNoTimeRecord);
    // #endregion

    // #region 渲染
    if (mode === "running") {
      return renderRunningButtons({
        actionLabel,
        isMobile,
        onConfirmRecord,
        onPauseTimer,
      });
    }

    if (mode === "paused") {
      return renderPausedButtons({
        actionLabel,
        isMobile,
        onCancelRecord,
        onResumeTimer,
      });
    }

    return (
      <Form.Item colon={false} label={actionLabel}>
        <Button block htmlType="button" onClick={onStartTimer}>
          {TIMER_START_LABEL}
        </Button>
      </Form.Item>
    );
    // #endregion
  };
// #endregion

export default ActionButton;
