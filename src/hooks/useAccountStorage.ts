import { useCallback, useEffect, useState } from "react";
import createLocalForageAccountService from "../services/localForageAccountService";
import type { AccountRecord } from "../types/App";

// #region 类型定义
/**
 * 账号存储 Hook 返回结果
 */
interface UseAccountStorageResult {
  /**
   * 账号记录列表
   */
  accounts: AccountRecord[];
  /**
   * 新增账号记录
   * @param record 账号记录
   */
  addAccount: (record: AccountRecord) => Promise<void>;
  /**
   * 是否正在初始化加载
   */
  loading: boolean;
  /**
   * 删除账号记录
   * @param id 记录id
   */
  removeAccount: (id: string) => Promise<void>;
  /**
   * 更新账号记录
   * @param record 账号记录
   */
  updateAccount: (record: AccountRecord) => Promise<void>;
}
// #endregion

// #region Hook 实现
/**
 * 呱唧地账号本地存储 Hook
 * @returns 账号状态与操作函数
 */
const
  /**
   * 模块级存储服务单例：避免随渲染重建导致初始化 effect 循环执行
   */
  storageService = createLocalForageAccountService(),
  useAccountStorage = (): UseAccountStorageResult => {
    const
      [accounts, setAccounts] = useState<AccountRecord[]>([]),
      [loading, setLoading] = useState(true),
      addAccount = useCallback(async (record: AccountRecord): Promise<void> => {
        setAccounts((prev) => [...prev, record]);
        await storageService.addAccount(record);
      }, []),
      updateAccount = useCallback(async (record: AccountRecord): Promise<void> => {
        setAccounts((prev) =>
          prev.map((item) => {
            if (item.id === record.id) {
              return record;
            }
            return item;
          })
        );
        await storageService.updateAccount(record);
      }, []),
      removeAccount = useCallback(async (id: string): Promise<void> => {
        setAccounts((prev) => prev.filter((item) => item.id !== id));
        await storageService.removeAccount(id);
      }, []);

    // #region 初始化：从持久化存储异步加载全部账号
    useEffect(() => {
      let isCancelled = false;
      (async (): Promise<void> => {
        const storedAccounts = await storageService.listAccounts();
        if (!isCancelled) {
          setAccounts(storedAccounts);
          setLoading(false);
        }
      })().catch((): void => {
        // 初始化失败时保持空状态，避免页面崩溃
        if (!isCancelled) {
          setLoading(false);
        }
      });
      return (): void => {
        isCancelled = true;
      };
    }, []);
    // #endregion

    return {
      accounts,
      addAccount,
      loading,
      removeAccount,
      updateAccount,
    };
  };
// #endregion

export default useAccountStorage;
export type { UseAccountStorageResult };
