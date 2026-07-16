import { Col, Form, Grid, Input, Row } from "antd";
import ActionButton from "./ActionButton";
import CountInput from "./CountInput";
import type { FormItemsProps } from "./type";
import IsInCurrentWorldSwitch from "./IsInCurrentWorldSwitch";
import NameInput from "./NameInput";
import React from "react";
import TimerDisplay from "./TimerDisplay";
import TypeSelect from "./TypeSelect";

// #region 布局常量与组件
const { useBreakpoint } = Grid,
  SPAN_FULL = 24,
  SPAN_HALF = 12,
  SPAN_THIRD = 8,
  SPAN_SIXTH = 4,
  GUTTER_MAIN = 16,
  GUTTER_INNER = 8,
  /**
   * 表单一行布局组件
   * @param props 组件属性
   * @returns 表单控件区域
   */
  FormItems: React.FC<FormItemsProps> = (props) => {
    // #region 解构属性与断点判断
    const {
        countHistory,
        elapsedMs,
        mode,
        nameHistory,
        onCancelRecord,
        onConfirmRecord,
        onInsertNoTimeRecord,
        onNameSelect,
        onPauseTimer,
        onResumeTimer,
        onStartTimer,
      } = props,
      screens = useBreakpoint(),
      isMobile = !screens.md;
    // #endregion

    // #region 移动端布局：三行
    if (isMobile) {
      return (
        <>
          <Row align="top" data-testid="form-items-row" gutter={[GUTTER_MAIN, GUTTER_MAIN]}>
            {/* 第一行：怪物类型、怪物名称、怪物数量 */}
            <Col span={SPAN_FULL}>
              <Row gutter={[GUTTER_INNER, GUTTER_INNER]}>
                <Col span={SPAN_THIRD}>
                  <TypeSelect />
                </Col>
                <Col span={SPAN_THIRD}>
                  <NameInput nameHistory={nameHistory} onNameSelect={onNameSelect} />
                </Col>
                <Col span={SPAN_THIRD}>
                  <CountInput countHistory={countHistory} />
                </Col>
              </Row>
            </Col>

            {/* 第二行：是否在本世界、计时 */}
            <Col span={SPAN_FULL}>
              <Row gutter={[GUTTER_INNER, GUTTER_INNER]}>
                <Col span={SPAN_HALF}>
                  <IsInCurrentWorldSwitch />
                </Col>
                <Col span={SPAN_HALF}>
                  <TimerDisplay elapsedMs={elapsedMs} />
                </Col>
              </Row>
            </Col>

            {/* 第三行：操作 */}
            <Col span={SPAN_FULL}>
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
          <Form.Item hidden name="usedTime">
            <Input />
          </Form.Item>
        </>
      );
    }
    // #endregion

    // #region PC 端布局：6 列横向等分
    return (
      <>
        <Row align="top" data-testid="form-items-row" gutter={GUTTER_MAIN}>
          <Col span={SPAN_SIXTH}>
            <TypeSelect />
          </Col>
          <Col span={SPAN_SIXTH}>
            <NameInput nameHistory={nameHistory} onNameSelect={onNameSelect} />
          </Col>
          <Col span={SPAN_SIXTH}>
            <CountInput countHistory={countHistory} />
          </Col>
          <Col span={SPAN_SIXTH}>
            <IsInCurrentWorldSwitch />
          </Col>
          <Col span={SPAN_SIXTH}>
            <TimerDisplay elapsedMs={elapsedMs} />
          </Col>
          <Col span={SPAN_SIXTH}>
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
        <Form.Item hidden name="usedTime">
          <Input />
        </Form.Item>
      </>
    );
    // #endregion
  };
// #endregion

export default FormItems;
