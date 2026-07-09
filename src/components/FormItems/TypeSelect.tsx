import { FORM_DEFAULT_MONSTER_TYPE, MONSTER_TYPE_LABEL, MONSTER_TYPE_OPTIONS } from "../../configs";
import { Form, Select } from "antd";
import { REQUIRED_RULE } from "../../utils/inputRules";
import React from "react";

/**
 * 怪物类型下拉框
 * @returns 类型选择控件
 */
const TypeSelect: React.FC = () => (
  <Form.Item
    initialValue={FORM_DEFAULT_MONSTER_TYPE}
    label={MONSTER_TYPE_LABEL}
    name="type"
    rules={REQUIRED_RULE("请选择怪物类型")}
  >
    <Select
      allowClear={false}
      options={MONSTER_TYPE_OPTIONS}
      suffixIcon={null}
    />
  </Form.Item>
);

export default TypeSelect;
