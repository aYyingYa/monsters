import localforage from "localforage";
import type { AccountRecord } from "../types/App";
import type { AccountStorageService } from "./accountStorageService";

// #region 常量与存储服务实现
const
  /** LocalForage 实例名称 */
  DRIVER_NAME = "guajidiAccounts",
  /** 账号索引键 */
  ACCOUNTS_INDEX_KEY = "accounts",
  /**
   * 基于 id 构建 localForage 键
   * @param id 记录id
   * @returns 存储键
   */
  buildAccountKey = (id: string): string => `account:${id}`,
  /** LocalForage 存储实例 */
  storage = localforage.createInstance({
    description: "呱唧地账号持久化存储",
    driver: [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE],
    name: DRIVER_NAME,
    storeName: "accounts",
    version: 1,
  }),
  /**
   * 读取 id 索引
   * @returns 记录id数组
   */
  readIdIndex = async (): Promise<string[]> => {
    const storedIds = await storage.getItem<string[]>(ACCOUNTS_INDEX_KEY);
    return storedIds ?? [];
  },
  /**
   * 将记录id写入索引（保持去重）
   * @param id 记录id
   */
  addIdToIndex = async (id: string): Promise<void> => {
    const
      storedIds = await readIdIndex(),
      idSet = new Set(storedIds);
    idSet.add(id);
    await storage.setItem(ACCOUNTS_INDEX_KEY, [...idSet]);
  },
  /**
   * 从索引中移除记录id
   * @param id 记录id
   */
  removeIdFromIndex = async (id: string): Promise<void> => {
    const
      storedIds = await readIdIndex(),
      nextIds = storedIds.filter((storedId) => storedId !== id);
    await storage.setItem(ACCOUNTS_INDEX_KEY, nextIds);
  },
  /**
   * 基于 localForage 的账号存储服务
   * @returns 存储服务实例
   */
  createLocalForageAccountService = (): AccountStorageService => ({
    addAccount: async (record: AccountRecord): Promise<void> => {
      await storage.setItem(buildAccountKey(record.id), record);
      await addIdToIndex(record.id);
    },
    listAccounts: async (): Promise<AccountRecord[]> => {
      const
        storedIds = await readIdIndex(),
        records = await Promise.all(
          storedIds.map(async (id) => await storage.getItem<AccountRecord>(buildAccountKey(id)))
        );
      return records.filter((record): record is AccountRecord => record !== null);
    },
    removeAccount: async (id: string): Promise<void> => {
      await removeIdFromIndex(id);
      await storage.removeItem(buildAccountKey(id));
    },
    updateAccount: async (record: AccountRecord): Promise<void> => {
      await storage.setItem(buildAccountKey(record.id), record);
      await addIdToIndex(record.id);
    },
  });
// #endregion

export default createLocalForageAccountService;
