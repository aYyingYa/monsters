import { Form, Modal } from "antd";
import type { MonsterEditModalProps } from "./type";
import React, { useEffect } from "react";
import type { FormValues } from "../../types/App";
import CountInput from "../FormItems/CountInput";
import IsInCurrentWorldSwitch from "../FormItems/IsInCurrentWorldSwitch";
import NameInput from "../FormItems/NameInput";
import TypeSelect from "../FormItems/TypeSelect";

/**
 * 怪物编辑弹窗
 * @param props 组件属性
 * @returns 编辑弹窗控件
 */
const MonsterEditModal: React.FC<MonsterEditModalProps> = (props) => {
  // #region 属性、表单与提交
  const
    {
      formDefaults,
      initialValues,
      nameMonsterMap,
      onCancel,
      onOk,
      onRemoveCount,
      onRemoveRecord,
      onSetDefaultCount,
      onSetDefaultName,
      onUpdateCount,
      onUpdateRecord,
      open,
    } = props,
    [form] = Form.useForm<FormValues>(),
    handleOk = (): void => {
      form.validateFields()
        .then((values: FormValues) => {
          onOk(values);
          form.resetFields();
        })
        .catch((): void => {
          // 校验失败时 Ant Design 会自动展示错误提示
        });
    },
    handleCancel = (): void => {
      form.resetFields();
      onCancel();
    };
  // #endregion

  // #region 初始化表单值
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue({
        count: initialValues.count.toString(),
        isInCurrentWorld: initialValues.isInCurrentWorld,
        name: initialValues.name,
        type: initialValues.type,
      });
    }
  }, [form, initialValues]);
  // #endregion

  // #region 渲染
  return (
    <Modal
      onCancel={handleCancel}
      onOk={handleOk}
      open={open}
      title="编辑怪物记录"
    >
      <Form form={form} layout="vertical">
        <TypeSelect formDefaults={formDefaults} nameMonsterMap={nameMonsterMap} />
        <NameInput
          formDefaults={formDefaults}
          nameMonsterMap={nameMonsterMap}
          onRemoveRecord={onRemoveRecord}
          onSetDefaultName={onSetDefaultName}
          onUpdateRecord={onUpdateRecord}
        />
        <CountInput
          formDefaults={formDefaults}
          nameMonsterMap={nameMonsterMap}
          onRemoveCount={onRemoveCount}
          onSetDefaultCount={onSetDefaultCount}
          onUpdateCount={onUpdateCount}
        />
        <IsInCurrentWorldSwitch />
      </Form>
    </Modal>
  );
  // #endregion
};

export default MonsterEditModal;
