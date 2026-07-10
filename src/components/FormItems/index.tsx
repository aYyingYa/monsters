import { Col, Form, Input, Row } from "antd";
import ActionButton from "./ActionButton";
import CountInput from "./CountInput";
import type { FormItemsProps } from "./type";
import IsInCurrentWorldSwitch from "./IsInCurrentWorldSwitch";
import NameInput from "./NameInput";
import React from "react";
import TimerDisplay from "./TimerDisplay";
import TypeSelect from "./TypeSelect";

/**
 * 表单一行布局组件
 * @param props 组件属性
 * @returns 表单控件区域
 */
const FormItems: React.FC<FormItemsProps> = (props) => {
  // #region 解构属性
  const {
    countHistory,
    elapsedMs,
    mode,
    nameHistory,
    onCancelRecord,
    onConfirmRecord,
    onInsertNoTimeRecord,
    onPauseTimer,
    onResumeTimer,
    onStartTimer,
  } = props;
  // #endregion

  // #region 渲染
  return (
    <>
      <Row align="top" gutter={16}>
        <Col span={4}>
          <TypeSelect />
        </Col>
        <Col span={4}>
          <NameInput nameHistory={nameHistory} />
        </Col>
        <Col span={4}>
          <CountInput countHistory={countHistory} />
        </Col>
        <Col span={4}>
          <IsInCurrentWorldSwitch />
        </Col>
        <Col span={4}>
          <TimerDisplay elapsedMs={elapsedMs} />
        </Col>
        <Col span={4}>
          <ActionButton
            mode={mode}
            onCancelRecord={onCancelRecord}
            onConfirmRecord={onConfirmRecord}
            onInsertNoTimeRecord={onInsertNoTimeRecord}
            onPauseTimer={onPauseTimer}
            onResumeTimer={onResumeTimer}
            onStartTimer={onStartTimer}
          />
        </Col>
      </Row>
      <Form.Item name="usedTime" hidden>
        <Input />
      </Form.Item>
    </>
  );
  // #endregion
};

export default FormItems;
