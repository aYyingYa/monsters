import type { AccountRecord } from "../types/App";
import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useAccountStorage from "./useAccountStorage";

// #region 测试常量与替身
const
  /** 内存版存储（vi.hoisted 保证 mock 工厂可用） */
  { memoryStore } = vi.hoisted(() => ({
    memoryStore: new Map<string, unknown>(),
  })),
  FIRST_ID = "id-1",
  SECOND_ID = "id-2",
  FIRST_ACCOUNT: AccountRecord = {
    account: "13812345678",
    accountName: "影宝",
    extraInfo: "微信大号",
    id: FIRST_ID,
    password: "abc123",
    uid: "123456789",
  },
  SECOND_ACCOUNT: AccountRecord = {
    account: "monster@example.com",
    accountName: "小怪兽",
    id: SECOND_ID,
    password: "xyz789",
    uid: "987654321",
  },
  UPDATED_NAME = "新影宝",
  INDEX_KEY = "accounts",
  FIRST_STORAGE_KEY = `account:${FIRST_ID}`;

vi.mock("localforage", () => ({
  default: {
    INDEXEDDB: 1,
    LOCALSTORAGE: 3,
    WEBSQL: 2,
    createInstance: () => ({
      getItem: (key: string): Promise<unknown> => Promise.resolve(memoryStore.get(key) ?? null),
      removeItem: (key: string): Promise<void> => {
        memoryStore.delete(key);
        return Promise.resolve();
      },
      setItem: (key: string, value: unknown): Promise<void> => {
        memoryStore.set(key, value);
        return Promise.resolve();
      },
    }),
  },
}));
// #endregion

// #region 测试用例
beforeEach(() => {
  memoryStore.clear();
});

describe("useAccountStorage", () => {
  it("adds account and persists record with id index", async () => {
    const { result } = renderHook(() => useAccountStorage());
    // 等待初始加载完成，避免加载覆盖保存结果
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    await act(async () => {
      await result.current.addAccount(FIRST_ACCOUNT);
    });
    expect(result.current.accounts).toEqual([FIRST_ACCOUNT]);
    expect(memoryStore.get(FIRST_STORAGE_KEY)).toEqual(FIRST_ACCOUNT);
    expect(memoryStore.get(INDEX_KEY)).toEqual([FIRST_ID]);
  });

  it("updates account by id and keeps index unchanged", async () => {
    const { result } = renderHook(() => useAccountStorage());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    await act(async () => {
      await result.current.addAccount(FIRST_ACCOUNT);
    });
    await act(async () => {
      await result.current.updateAccount({ ...FIRST_ACCOUNT, accountName: UPDATED_NAME });
    });
    expect(result.current.accounts).toEqual([{ ...FIRST_ACCOUNT, accountName: UPDATED_NAME }]);
    expect(memoryStore.get(FIRST_STORAGE_KEY)).toEqual({
      ...FIRST_ACCOUNT,
      accountName: UPDATED_NAME,
    });
    expect(memoryStore.get(INDEX_KEY)).toEqual([FIRST_ID]);
  });

  it("removes account and cleans both record and index", async () => {
    const { result } = renderHook(() => useAccountStorage());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    await act(async () => {
      await result.current.addAccount(FIRST_ACCOUNT);
    });
    await act(async () => {
      await result.current.addAccount(SECOND_ACCOUNT);
    });
    await act(async () => {
      await result.current.removeAccount(FIRST_ID);
    });
    expect(result.current.accounts).toEqual([SECOND_ACCOUNT]);
    expect(memoryStore.get(FIRST_STORAGE_KEY)).toBeUndefined();
    expect(memoryStore.get(INDEX_KEY)).toEqual([SECOND_ID]);
  });

  it("loads persisted accounts on init", async () => {
    memoryStore.set(INDEX_KEY, [FIRST_ID, SECOND_ID]);
    memoryStore.set(FIRST_STORAGE_KEY, FIRST_ACCOUNT);
    memoryStore.set(`account:${SECOND_ID}`, SECOND_ACCOUNT);
    const { result } = renderHook(() => useAccountStorage());
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
    expect(result.current.accounts).toEqual([FIRST_ACCOUNT, SECOND_ACCOUNT]);
  });

  it("skips missing records when loading index", async () => {
    memoryStore.set(INDEX_KEY, [FIRST_ID, SECOND_ID]);
    memoryStore.set(FIRST_STORAGE_KEY, FIRST_ACCOUNT);
    const { result } = renderHook(() => useAccountStorage());
    await waitFor(() => {
      expect(result.current.accounts).toEqual([FIRST_ACCOUNT]);
    });
  });
});
// #endregion
