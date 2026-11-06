import type { FormDefaults, NameMonsterMap } from "../../services/monsterHistoryService";
import type { FormValues } from "../../types/App";
import {
  FORM_DEFAULT_MONSTER_TYPE,
  MONSTER_TYPE_LABEL,
  MONSTER_TYPE_OPTIONS,
  type MonsterType,
} from "../../configs";
import { Form, Select } from "antd";
import React from "react";
import { resolveDefaultCount, resolveDefaultName } from "../../utils/formDefaults";

// #region 类型定义
/**
 * 怪物类型下拉框组件属性
 */
interface TypeSelectProps {
  /**
   * 表单级联默认值配置
   */
  formDefaults: FormDefaults;
  /**
   * 名称到怪物属性的映射
   */
  nameMonsterMap: NameMonsterMap;
}
// #endregion

// #region 组件
/**
 * 怪物类型下拉框（切换类型后名称/数量级联切换到对应默认值）
 * @param props 组件属性
 * @returns 类型选择控件
 */
const TypeSelect: React.FC<TypeSelectProps> = (props) => {
  // #region 表单实例与级联切换逻辑
  const
    { formDefaults, nameMonsterMap } = props,
    form = Form.useFormInstance<FormValues>(),
    /**
     * 切换类型：名称切换到该类型默认名称，数量级联切换到该名称默认数量
     * @param type 选中的怪物类型
     */
    handleTypeChange = (type: MonsterType): void => {
      const nextName = resolveDefaultName(type, formDefaults.nameByType, nameMonsterMap);
      form.setFieldsValue({
        count: resolveDefaultCount(nextName, formDefaults.countByName),
        name: nextName,
      });
    };
  // #endregion

  // #region 渲染
  return (
    <Form.Item
      initialValue={FORM_DEFAULT_MONSTER_TYPE}
      label={MONSTER_TYPE_LABEL}
      name="type"
      rules={[{ message: "请选择怪物类型", required: true }]}
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
// #endregion

export default TypeSelect;
