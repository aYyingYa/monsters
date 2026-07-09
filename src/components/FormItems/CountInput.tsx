import { AutoComplete, Form } from "antd";
import { FORM_DEFAULT_MONSTER_COUNT, MONSTER_COUNT_LABEL } from "../../configs";
import { NUMBER_RULES, REQUIRED_RULE } from "../../utils/inputRules";
import React from "react";
import { validateInitInput } from "../../utils/inputNormalize";

/**
 * 怪物数量输入组件属性
 */
interface CountInputProps {
  /**
   * 历史数量选项
   */
  countHistory: string[];
}

/**
 * 怪物数量输入框（支持历史记录下拉）
 * @param props 组件属性
 * @returns 数量输入控件
 */
const CountInput: React.FC<CountInputProps> = (props) => {
  const { countHistory } = props;
  return (
    <Form.Item
      initialValue={FORM_DEFAULT_MONSTER_COUNT}
      label={MONSTER_COUNT_LABEL}
      name="count"
      normalize={(value: string) => validateInitInput(value, "NON_NEGATIVE")}
      rules={[...REQUIRED_RULE("请输入怪物数量"), ...NUMBER_RULES]}
    >
      <AutoComplete
        allowClear
        options={countHistory.map((count) => ({ label: count, value: count }))}
      />
    </Form.Item>
  );
};

export default CountInput;
