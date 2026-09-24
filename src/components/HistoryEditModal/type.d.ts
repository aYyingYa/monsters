/**
 * 名称编辑弹窗组件属性
 */
export interface NameEditModalProps {
  /**
   * 原数量历史列表
   */
  counts: string[];
  /**
   * 其他已存在的名称（用于重名校验，不含当前名称）
   */
  existingNames: string[];
  /**
   * 原名称
   */
  name: string;
  /**
   * 取消回调
   */
  onCancel: () => void;
  /**
   * 保存回调
   * @param name 新名称
   * @param counts 新数量历史列表
   */
  onOk: (name: string, counts: string[]) => void;
  /**
   * 弹窗是否打开
   */
  open: boolean;
}

/**
 * 数量编辑弹窗组件属性
 */
export interface CountEditModalProps {
  /**
   * 原数量
   */
  count: string;
  /**
   * 取消回调
   */
  onCancel: () => void;
  /**
   * 保存回调
   * @param count 新数量
   */
  onOk: (count: string) => void;
  /**
   * 弹窗是否打开
   */
  open: boolean;
}
