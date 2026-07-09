import { AutoComplete, Form } from "antd";
import { FORM_DEFAULT_MONSTER_NAME, MONSTER_NAME_LABEL } from "../../configs";
import { REQUIRED_RULE } from "../../utils/inputRules";
import React from "react";

/**
 * 怪物名称输入组件属性
 */
interface NameInputProps {
  /**
   * 历史名称选项
   */
  nameHistory: string[];
}

/**
 * 怪物名称输入框（支持历史记录下拉）
 * @param props 组件属性
 * @returns 名称输入控件
 */
const NameInput: React.FC<NameInputProps> = (props) => {
  const { nameHistory } = props;
  return (
    <Form.Item
      initialValue={FORM_DEFAULT_MONSTER_NAME}
      label={MONSTER_NAME_LABEL}
      name="name"
      rules={REQUIRED_RULE("请输入怪物名称")}
    >
      <AutoComplete
        allowClear
        options={nameHistory.map((name) => ({ label: name, value: name }))}
      />
    </Form.Item>
  );
};

export default NameInput;
