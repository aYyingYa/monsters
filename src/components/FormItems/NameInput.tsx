import { AutoComplete, Form } from "antd";
import { FORM_DEFAULT_MONSTER_NAME, MONSTER_NAME_LABEL, type MonsterType, ZERO } from "../../configs";
import { REQUIRED_RULE } from "../../utils/inputRules";
import React from "react";
import type { FormValues } from "../../types/App";
import type { NameMonsterMap } from "../../services/monsterHistoryService";

// #region 类型定义
/**
 * 怪物名称输入组件属性
 */
interface NameInputProps {
  /**
   * 名称到怪物属性的映射
   */
  nameMonsterMap: NameMonsterMap;
}
// #endregion

// #region 组件实现
/**
 * 怪物名称输入框（选项按当前怪物类型过滤，选中后回填类型与最近使用的数量）
 * @param props 组件属性
 * @returns 名称输入控件
 */
const NameInput: React.FC<NameInputProps> = (props) => {
  // #region 解构属性、表单监听与选项计算
  const
    { nameMonsterMap } = props,
    form = Form.useFormInstance<FormValues>(),
    watchedType = Form.useWatch("type", form),
    // 首帧 useWatch 字段可能未注册，兜底读取表单当前值
    currentType: MonsterType | undefined = watchedType ?? form.getFieldValue("type"),
    nameOptions = Object.entries(nameMonsterMap)
      .filter(([, record]) => typeof currentType === "undefined" || record.type === currentType)
      .map(([name]) => ({ label: name, value: name })),
    /**
     * 选中历史名称时回填其绑定类型与最近使用的数量
     * @param name 选中的名称
     */
    handleNameSelect = (name: string): void => {
      const record = nameMonsterMap[name];
      // 无绑定记录或数量历史为空时不回填，保留用户当前输入
      if (typeof record === "undefined" || record.counts.length === ZERO) {
        return;
      }
      form.setFieldsValue({ count: record.counts[ZERO], type: record.type });
    };
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
        onSelect={handleNameSelect}
        options={nameOptions}
      />
    </Form.Item>
  );
  // #endregion
};
// #endregion

export default NameInput;
