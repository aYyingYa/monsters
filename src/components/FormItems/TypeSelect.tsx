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
import {
  type CascadeValueResult,
  resolveCascadeCount,
  resolveCascadeName,
} from "../../utils/formDefaults";
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
  /** 级联最近使用数量 toast 前缀 */
  CASCADE_RECENT_COUNT_MESSAGE_PREFIX = "已切换为最近使用数量：",
  /** 级联最近使用名称 toast 前缀 */
  CASCADE_RECENT_NAME_MESSAGE_PREFIX = "已切换为最近使用名称：",
  /**
   * 按取值来源选择 toast 前缀（b 默认值 / a 最近使用值）
   * @param result 级联取值结果
   * @param defaultPrefix 默认值前缀
   * @param recentPrefix 最近使用值前缀
   * @returns toast 前缀
   */
  pickCascadePrefix = (
    result: CascadeValueResult,
    defaultPrefix: string,
    recentPrefix: string
  ): string => {
    if (result.fromDefault) {
      return defaultPrefix;
    }
    return recentPrefix;
  },
  /**
   * 生成单个级联取值项的 toast 片段（无数值时返回空串）
   * @param result 级联取值结果
   * @param defaultPrefix 默认值前缀
   * @param recentPrefix 最近使用值前缀
   * @returns toast 片段
   */
  buildCascadePart = (
    result: CascadeValueResult,
    defaultPrefix: string,
    recentPrefix: string
  ): string => {
    if (result.value === "") {
      return "";
    }
    return `${pickCascadePrefix(result, defaultPrefix, recentPrefix)}${result.value}`;
  },
  /**
   * 拼接级联回填 toast 文本（名称与数量均无数值时返回空串）
   * @param nameResult 级联名称取值结果
   * @param countResult 级联数量取值结果
   * @returns toast 文本
   */
  buildCascadeToastText = (
    nameResult: CascadeValueResult,
    countResult: CascadeValueResult
  ): string => {
    const
      namePart = buildCascadePart(nameResult, CASCADE_NAME_MESSAGE_PREFIX, CASCADE_RECENT_NAME_MESSAGE_PREFIX),
      countPart = buildCascadePart(countResult, CASCADE_COUNT_MESSAGE_PREFIX, CASCADE_RECENT_COUNT_MESSAGE_PREFIX);
    if (namePart === "") {
      return countPart;
    }
    if (countPart === "") {
      return namePart;
    }
    return `${namePart}，${countPart}`;
  },
  /**
   * 怪物类型下拉框（切换类型后名称/数量级联切换：优先默认值，无默认值取最近使用值）
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
     * 切换类型：名称切换到该类型级联值，数量级联切换到该名称级联值；
     * 本级被回填时 toast 提示
     * @param type 选中的怪物类型
     */
    handleTypeChange = (type: MonsterType): void => {
      const
        nextName = resolveCascadeName(type, formDefaults.nameByType, nameMonsterMap),
        nextCount = resolveCascadeCount(nextName.value, formDefaults.countByName, nameMonsterMap),
        toastText = buildCascadeToastText(nextName, nextCount);
      form.setFieldsValue({
        count: nextCount.value,
        name: nextName.value,
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
