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
import useSafeMessage from "../../hooks/useSafeMessage";

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

// #region 常量、工具与组件
const
  /** 级联默认数量 toast 前缀 */
  CASCADE_COUNT_MESSAGE_PREFIX = "已切换为默认数量：",
  /** 级联默认名称 toast 前缀 */
  CASCADE_NAME_MESSAGE_PREFIX = "已切换为默认名称：",
  /**
   * 拼接级联回填 toast 文本（名称与数量均无默认值时返回空串）
   * @param defaultName 级联默认名称
   * @param defaultCount 级联默认数量
   * @returns toast 文本
   */
  buildCascadeToastText = (defaultName: string, defaultCount: string): string => {
    let toastText = "";
    if (defaultName !== "") {
      toastText = `${CASCADE_NAME_MESSAGE_PREFIX}${defaultName}`;
    }
    if (defaultCount !== "") {
      if (toastText !== "") {
        toastText = `${toastText}，`;
      }
      toastText = `${toastText}${CASCADE_COUNT_MESSAGE_PREFIX}${defaultCount}`;
    }
    return toastText;
  },
  /**
   * 怪物类型下拉框（切换类型后名称/数量级联切换到对应默认值）
   * @param props 组件属性
   * @returns 类型选择控件
   */
  TypeSelect: React.FC<TypeSelectProps> = (props) => {
  // #region 表单实例与级联切换逻辑
  const
    { formDefaults, nameMonsterMap } = props,
    form = Form.useFormInstance<FormValues>(),
    message = useSafeMessage(),
    /**
     * 切换类型：名称切换到该类型默认名称，数量级联切换到该名称默认数量；
     * 本级被默认值回填时 toast 提示
     * @param type 选中的怪物类型
     */
    handleTypeChange = (type: MonsterType): void => {
      const
        nextName = resolveDefaultName(type, formDefaults.nameByType, nameMonsterMap),
        nextCount = resolveDefaultCount(nextName, formDefaults.countByName),
        toastText = buildCascadeToastText(nextName, nextCount);
      form.setFieldsValue({
        count: nextCount,
        name: nextName,
      });
      if (toastText !== "") {
        message.success(toastText);
      }
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
        suffix={null}
      />
    </Form.Item>
  );
  // #endregion
  };
// #endregion

export default TypeSelect;
