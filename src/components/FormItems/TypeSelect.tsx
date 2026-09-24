import { FORM_DEFAULT_MONSTER_TYPE, MONSTER_TYPE_LABEL, MONSTER_TYPE_OPTIONS } from "../../configs";
import { Form, Select } from "antd";
import { REQUIRED_RULE } from "../../utils/inputRules";
import React from "react";
import type { FormValues } from "../../types/App";

/**
 * 怪物类型下拉框
 * @returns 类型选择控件
 */
const TypeSelect: React.FC = () => {
  // #region 表单实例与切换逻辑
  const
    form = Form.useFormInstance<FormValues>(),
    /**
     * 切换类型时清空名称与数量，避免名称绑定类型与实际类型错配
     */
    handleTypeChange = (): void => {
      form.setFieldsValue({ count: "", name: "" });
    };
  // #endregion

  // #region 渲染
  return (
    <Form.Item
      initialValue={FORM_DEFAULT_MONSTER_TYPE}
      label={MONSTER_TYPE_LABEL}
      name="type"
      rules={REQUIRED_RULE("请选择怪物类型")}
    >
      <Select
        allowClear={false}
        onChange={handleTypeChange}
        options={MONSTER_TYPE_OPTIONS}
        suffixIcon={null}
      />
    </Form.Item>
  );
  // #endregion
};

export default TypeSelect;
