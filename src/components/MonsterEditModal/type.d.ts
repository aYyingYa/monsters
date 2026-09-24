import type { FormValues, Monster } from "../../types/App";
import type { NameMonsterMap } from "../../services/monsterHistoryService";

/**
 * 怪物编辑弹窗组件属性
 */
interface MonsterEditModalProps {
  /**
   * 编辑初始值
   */
  initialValues: Monster | null;
  /**
   * 名称到怪物属性的映射
   */
  nameMonsterMap: NameMonsterMap;
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
