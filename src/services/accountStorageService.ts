import type { AccountRecord } from "../types/App";

// #region 类型定义
/**
 * 呱唧地账号存储服务接口
 */
export interface AccountStorageService {
  /**
   * 读取全部账号记录
   * @returns 账号记录数组
   */
  listAccounts: () => Promise<AccountRecord[]>;
  /**
   * 新增账号记录
   * @param record 账号记录
   */
  addAccount: (record: AccountRecord) => Promise<void>;
  /**
   * 更新账号记录（按 id 覆盖）
   * @param record 账号记录
   */
  updateAccount: (record: AccountRecord) => Promise<void>;
  /**
   * 删除账号记录
   * @param id 记录id
   */
  removeAccount: (id: string) => Promise<void>;
}
// #endregion
