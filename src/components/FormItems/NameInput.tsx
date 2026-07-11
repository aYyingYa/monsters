import { AutoComplete, Form } from "antd";
import { FORM_DEFAULT_MONSTER_NAME, MONSTER_NAME_LABEL } from "../../configs";
import { REQUIRED_RULE } from "../../utils/inputRules";
import React from "react";

// #region 类型定义
/**
 * 怪物名称输入组件属性
 */
interface NameInputProps {
  /**
   * 历史名称选项
   */
  nameHistory: string[];
  /**
   * 选择历史名称回调
   * @param name 选中的名称
   */
  onNameSelect: (name: string) => void;
}
// #endregion

// #region 组件实现
/**
 * 怪物名称输入框（支持历史记录下拉）
 * @param props 组件属性
 * @returns 名称输入控件
 */
const NameInput: React.FC<NameInputProps> = (props) => {
  // #region 解构属性
  const { nameHistory, onNameSelect } = props;
  // #endregion

  // #region 渲染
  return (
    <Form.Item
      initialValue={FORM_DEFAULT_MONSTER_NAME}
      label={MONSTER_NAME_LABEL}
      name="name"
      rules={REQUIRED_RULE("请输入怪物名称")}
    >
      <AutoComplete
        allowClear
        onSelect={onNameSelect}
        options={nameHistory.map((name) => ({ label: name, value: name }))}
      />
    </Form.Item>
  );
  // #endregion
};
// #endregion

export default NameInput;
