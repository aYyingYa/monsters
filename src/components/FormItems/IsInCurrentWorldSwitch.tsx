import {
  CURRENT_WORLD_NO,
  CURRENT_WORLD_YES,
  IS_IN_CURRENT_WORLD_DEFAULT,
  IS_IN_CURRENT_WORLD_LABEL,
} from "../../configs";
import { Form, Switch } from "antd";
import React from "react";

/**
 * 是否在本世界开关
 * @returns 布尔开关控件
 */
const IsInCurrentWorldSwitch: React.FC = () => (
  <Form.Item
    initialValue={IS_IN_CURRENT_WORLD_DEFAULT}
    label={IS_IN_CURRENT_WORLD_LABEL}
    name="isInCurrentWorld"
    valuePropName="checked"
  >
    <Switch
      checkedChildren={CURRENT_WORLD_YES}
      unCheckedChildren={CURRENT_WORLD_NO}
    />
  </Form.Item>
);

export default IsInCurrentWorldSwitch;
