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
   * 删除数量项回调
   * @param name 怪物名称
   * @param count 待删除的数量
   */
  onRemoveCount: (name: string, count: string) => Promise<void>;
  /**
   * 删除名称记录回调
   * @param name 怪物名称
   */
  onRemoveRecord: (name: string) => Promise<void>;
  /**
   * 更新数量项回调
   * @param name 怪物名称
   * @param oldCount 原数量
   * @param newCount 新数量
   */
  onUpdateCount: (name: string, oldCount: string, newCount: string) => Promise<void>;
  /**
   * 更新名称记录回调
   * @param oldName 原名称
   * @param name 新名称
   * @param counts 新数量历史列表
   */
  onUpdateRecord: (oldName: string, name: string, counts: string[]) => Promise<void>;
  /**
   * 弹窗是否打开
   */
  open: boolean;
}

export type { MonsterEditModalProps };
