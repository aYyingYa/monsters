import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useMonsterHistory from "./useMonsterHistory";

// #region 测试常量与替身
const
  /** 内存版存储与加载标记（vi.hoisted 保证 mock 工厂可用） */
  { loadState, memoryStore } = vi.hoisted(() => ({
    loadState: { called: false },
    memoryStore: new Map<string, unknown>(),
  })),
  ELITE_NAME = "月铁",
  LEGACY_NAME = "旧版小怪",
  NEW_ELITE_NAME = "新月铁",
  COUNT_FIRST = "26",
  COUNT_SECOND = "30",
  LEGACY_COUNT = "10",
  STORAGE_KEY = "nameMonsterMap",
  ELITE_TYPE = "精英怪",
  NORMAL_TYPE = "小怪";

vi.mock("localforage", () => ({
  default: {
    INDEXEDDB: 1,
    LOCALSTORAGE: 3,
    WEBSQL: 2,
    createInstance: () => ({
      getItem: (key: string): Promise<unknown> => {
        loadState.called = true;
        return Promise.resolve(memoryStore.get(key) ?? null);
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
  loadState.called = false;
});

describe("useMonsterHistory", () => {
  it("merges counts with dedupe and keeps latest first", async () => {
    const { result } = renderHook(() => useMonsterHistory());
    // 等待初始加载完成，避免加载覆盖保存结果
    await waitFor(() => {
      expect(loadState.called).toBe(true);
    });
    await act(async () => {
      await result.current.saveMonsterHistory(ELITE_NAME, ELITE_TYPE, COUNT_FIRST);
    });
    await act(async () => {
      await result.current.saveMonsterHistory(ELITE_NAME, ELITE_TYPE, COUNT_SECOND);
    });
    // 重复数量应去重并提到最前
    await act(async () => {
      await result.current.saveMonsterHistory(ELITE_NAME, ELITE_TYPE, COUNT_FIRST);
    });
    expect(result.current.nameMonsterMap[ELITE_NAME]?.counts).toEqual([COUNT_FIRST, COUNT_SECOND]);
  });

  it("persists merged map to storage", async () => {
    const { result } = renderHook(() => useMonsterHistory());
    await waitFor(() => {
      expect(loadState.called).toBe(true);
    });
    await act(async () => {
      await result.current.saveMonsterHistory(ELITE_NAME, ELITE_TYPE, COUNT_FIRST);
    });
    expect(memoryStore.get(STORAGE_KEY)).toEqual({
      [ELITE_NAME]: { counts: [COUNT_FIRST], type: ELITE_TYPE },
    });
  });

  it("discards legacy records without counts on load", async () => {
    memoryStore.set(STORAGE_KEY, {
      [ELITE_NAME]: { counts: [COUNT_FIRST], type: ELITE_TYPE },
      [LEGACY_NAME]: { count: LEGACY_COUNT, type: NORMAL_TYPE },
    });
    const { result } = renderHook(() => useMonsterHistory());
    // 旧版单数量结构应被丢弃，新版结构正常加载
    await waitFor(() => {
      expect(result.current.nameMonsterMap[ELITE_NAME]?.counts).toEqual([COUNT_FIRST]);
    });
    expect(result.current.nameMonsterMap[LEGACY_NAME]).toBeUndefined();
  });

  it("renames record and removes old key on updateMonsterRecord", async () => {
    const { result } = renderHook(() => useMonsterHistory());
    await waitFor(() => {
      expect(loadState.called).toBe(true);
    });
    await act(async () => {
      await result.current.saveMonsterHistory(ELITE_NAME, ELITE_TYPE, COUNT_FIRST);
    });
    await act(async () => {
      await result.current.updateMonsterRecord(ELITE_NAME, NEW_ELITE_NAME, [COUNT_SECOND, COUNT_FIRST]);
    });
    // 改名后旧键删除，新键保留原类型与新数量列表
    expect(result.current.nameMonsterMap[ELITE_NAME]).toBeUndefined();
    expect(result.current.nameMonsterMap[NEW_ELITE_NAME]).toEqual({
      counts: [COUNT_SECOND, COUNT_FIRST],
      type: ELITE_TYPE,
    });
  });

  it("removes whole record on removeMonsterRecord", async () => {
    const { result } = renderHook(() => useMonsterHistory());
    await waitFor(() => {
      expect(loadState.called).toBe(true);
    });
    await act(async () => {
      await result.current.saveMonsterHistory(ELITE_NAME, ELITE_TYPE, COUNT_FIRST);
    });
    await act(async () => {
      await result.current.removeMonsterRecord(ELITE_NAME);
    });
    expect(result.current.nameMonsterMap[ELITE_NAME]).toBeUndefined();
    expect(memoryStore.get(STORAGE_KEY)).toEqual({});
  });

  it("replaces and dedupes count on updateCount", async () => {
    const { result } = renderHook(() => useMonsterHistory());
    await waitFor(() => {
      expect(loadState.called).toBe(true);
    });
    await act(async () => {
      await result.current.saveMonsterHistory(ELITE_NAME, ELITE_TYPE, COUNT_FIRST);
    });
    await act(async () => {
      await result.current.saveMonsterHistory(ELITE_NAME, ELITE_TYPE, COUNT_SECOND);
    });
    // 把 26 改为已有的 30，替换后整体去重应只剩一个 30
    await act(async () => {
      await result.current.updateCount(ELITE_NAME, COUNT_FIRST, COUNT_SECOND);
    });
    expect(result.current.nameMonsterMap[ELITE_NAME]?.counts).toEqual([COUNT_SECOND]);
  });

  it("removes count on removeCount", async () => {
    const { result } = renderHook(() => useMonsterHistory());
    await waitFor(() => {
      expect(loadState.called).toBe(true);
    });
    await act(async () => {
      await result.current.saveMonsterHistory(ELITE_NAME, ELITE_TYPE, COUNT_FIRST);
    });
    await act(async () => {
      await result.current.saveMonsterHistory(ELITE_NAME, ELITE_TYPE, COUNT_SECOND);
    });
    await act(async () => {
      await result.current.removeCount(ELITE_NAME, COUNT_SECOND);
    });
    expect(result.current.nameMonsterMap[ELITE_NAME]?.counts).toEqual([COUNT_FIRST]);
  });
});
// #endregion
