import type { FormValues, Monster } from "../../types/App";

/**
 * 怪物编辑弹窗组件属性
 */
interface MonsterEditModalProps {
  /**
   * 数量历史选项
   */
  countHistory: string[];
  /**
   * 编辑初始值
   */
  initialValues: Monster | null;
  /**
   * 名称历史选项
   */
  nameHistory: string[];
  /**
   * 选择历史名称回调
   * @param name 选中的名称
   */
  onNameSelect: (name: string) => void;
  /**
   * 取消回调
   */
  onCancel: () => void;
  /**
   * 确认回调
   * @param values 表单值
   */
  onOk: (values: FormValues) => void;
  /**
   * 弹窗是否打开
   */
  open: boolean;
}

export type { MonsterEditModalProps };
