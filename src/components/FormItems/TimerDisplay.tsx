import { Form } from "antd";
import React from "react";
import { TIMER_LABEL } from "../../configs";
import { formatElapsedTime } from "../../utils/calc";
import styles from "./index.module.less";

/**
 * 计时器显示组件属性
 */
interface TimerDisplayProps {
  /**
   * 已运行毫秒数
   */
  elapsedMs: number;
}

/**
 * 计时器显示
 * @param props 组件属性
 * @returns 计时器显示控件
 */
const TimerDisplay: React.FC<TimerDisplayProps> = (props) => {
  const { elapsedMs } = props;
  return (
    <Form.Item label={TIMER_LABEL}>
      <span className={styles.timerDisplay}>{formatElapsedTime(elapsedMs)}</span>
    </Form.Item>
  );
};

export default TimerDisplay;
