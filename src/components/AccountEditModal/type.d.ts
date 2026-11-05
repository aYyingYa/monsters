import type { AccountFormValues, AccountRecord } from "../../types/App";

/**
 * 账号编辑弹窗组件属性
 */
export interface AccountEditModalProps {
  /**
   * 编辑时的初始值（新增时为空）
   */
  initialValues: AccountRecord | null;
  /**
   * 取消回调
   */
  onCancel: () => void;
  /**
   * 确认回调
   * @param values 表单数据
   */
  onOk: (values: AccountFormValues) => void;
  /**
   * 弹窗是否打开
   */
  open: boolean;
}
