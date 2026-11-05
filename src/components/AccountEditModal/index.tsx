import type { AccountEditModalProps } from "./type";
import type { AccountFormValues } from "../../types/App";
import { ACCOUNT_NAME_RULES, ACCOUNT_RULES, PASSWORD_RULES, UID_RULES } from "../../utils/inputRules";
import { Form, Input, Modal } from "antd";
import { UID_INPUT_MAX_LENGTH } from "../../configs";
import React, { useEffect } from "react";

// #region 账号编辑弹窗组件
/**
 * 呱唧地账号编辑弹窗（新增/编辑共用）
 * @param props 组件属性
 * @returns 编辑弹窗控件
 */
const AccountEditModal: React.FC<AccountEditModalProps> = (props) => {
  // #region 属性、表单与提交
  const
    { initialValues, onCancel, onOk, open } = props,
    [form] = Form.useForm<AccountFormValues>(),
    handleOk = (): void => {
      form.validateFields()
        .then((values: AccountFormValues) => {
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
        account: initialValues.account,
        accountName: initialValues.accountName,
        extraInfo: initialValues.extraInfo,
        password: initialValues.password,
        uid: initialValues.uid,
      });
    }
  }, [form, initialValues]);
  // #endregion

  // #region 渲染
  let modalTitle = "新增账号";
  if (initialValues) {
    modalTitle = "编辑账号";
  }
  return (
    <Modal
      onCancel={handleCancel}
      onOk={handleOk}
      open={open}
      title={modalTitle}
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="uid"
          name="uid"
          rules={UID_RULES}
        >
          <Input
            maxLength={UID_INPUT_MAX_LENGTH}
            placeholder="9位数字uid"
          />
        </Form.Item>
        <Form.Item
          label="账号名"
          name="accountName"
          rules={ACCOUNT_NAME_RULES}
        >
          <Input placeholder="账号名" />
        </Form.Item>
        <Form.Item
          label="账号"
          name="account"
          rules={ACCOUNT_RULES}
        >
          <Input placeholder="手机号或邮箱" />
        </Form.Item>
        <Form.Item
          label="密码"
          name="password"
          rules={PASSWORD_RULES}
        >
          <Input.Password placeholder="密码" />
        </Form.Item>
        <Form.Item
          label="额外信息"
          name="extraInfo"
        >
          <Input placeholder="额外信息（选填）" />
        </Form.Item>
      </Form>
    </Modal>
  );
  // #endregion
};
// #endregion

export default AccountEditModal;
