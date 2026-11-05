import type { AccountRecord } from "../../types/App";

/**
 * 账号卡片组件属性
 */
export interface AccountCardProps {
  /**
   * 账号记录
   */
  account: AccountRecord;
  /**
   * 编辑回调
   * @param account 账号记录
   */
  onEdit: (account: AccountRecord) => void;
  /**
   * 删除回调
   */
  onDelete: () => void;
}
