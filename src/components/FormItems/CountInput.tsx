import { AutoComplete, Form } from "antd";
import { FORM_DEFAULT_MONSTER_COUNT, MONSTER_COUNT_LABEL } from "../../configs";
import { NUMBER_RULES, REQUIRED_RULE } from "../../utils/inputRules";
import React from "react";
import type { FormValues } from "../../types/App";
import type { NameMonsterMap } from "../../services/monsterHistoryService";
import { validateInitInput } from "../../utils/inputNormalize";

// #region 类型定义
/**
 * 怪物数量输入组件属性
 */
interface CountInputProps {
  /**
   * 名称到怪物属性的映射
   */
  nameMonsterMap: NameMonsterMap;
}
// #endregion

// #region 组件实现
/**
 * 怪物数量输入框（选项为当前名称对应怪物的历史数量列表，最近使用在前）
 * @param props 组件属性
 * @returns 数量输入控件
 */
const CountInput: React.FC<CountInputProps> = (props) => {
  // #region 解构属性、表单监听与选项计算
  const
    { nameMonsterMap } = props,
    form = Form.useFormInstance<FormValues>(),
    watchedName = Form.useWatch("name", form),
    // 首帧 useWatch 字段可能未注册，兜底读取表单当前值
    currentName: string = watchedName ?? form.getFieldValue("name") ?? "",
    countOptions = (nameMonsterMap[currentName]?.counts ?? []).map((count) => ({ label: count, value: count }));
  // #endregion

  // #region 渲染
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
        filterOption={false}
        options={countOptions}
      />
    </Form.Item>
  );
  // #endregion
};
// #endregion

export default CountInput;
