import { describe, expect, it } from "vitest";
import type { FormDefaults, NameMonsterMap } from "../services/monsterHistoryService";
import {
  resolveCascadeCount,
  resolveCascadeName,
  resolveDefaultCount,
  resolveDefaultName,
} from "./formDefaults";

// #region 测试常量
const
  ELITE_TYPE = "精英怪",
  NORMAL_TYPE = "小怪",
  ELITE_NAME = "月铁",
  NEW_ELITE_NAME = "新月铁",
  NORMAL_NAME = "小蜘蛛",
  CUSTOM_ELITE_COUNT = "30",
  EMPTY_DEFAULTS: FormDefaults = { countByName: {}, nameByType: {} },
  NAME_MONSTER_MAP: NameMonsterMap = {
    [ELITE_NAME]: { counts: [CUSTOM_ELITE_COUNT, "26"], type: ELITE_TYPE },
    [NORMAL_NAME]: { counts: ["100"], type: NORMAL_TYPE },
  };
// #endregion

// #region 测试用例
describe("resolveDefaultName", () => {
  it("returns custom default name when it exists and type matches", () => {
    const
      nameByType = { [ELITE_TYPE]: NEW_ELITE_NAME },
      map: NameMonsterMap = {
        ...NAME_MONSTER_MAP,
        [NEW_ELITE_NAME]: { counts: ["35"], type: ELITE_TYPE },
      };
    expect(resolveDefaultName(ELITE_TYPE, nameByType, map)).toBe(NEW_ELITE_NAME);
  });

  it("returns empty string when custom default is dangling", () => {
    const nameByType = { [ELITE_TYPE]: "已删除的名称" };
    expect(resolveDefaultName(ELITE_TYPE, nameByType, NAME_MONSTER_MAP)).toBe("");
  });

  it("returns empty string when no custom default even if type has recent names", () => {
    // 纯默认解析不含最近使用兜底，两套概念互不混用
    expect(resolveDefaultName(NORMAL_TYPE, EMPTY_DEFAULTS.nameByType, NAME_MONSTER_MAP)).toBe("");
  });
});

describe("resolveDefaultCount", () => {
  it("returns custom default count when set", () => {
    const countByName = { [ELITE_NAME]: CUSTOM_ELITE_COUNT };
    expect(resolveDefaultCount(ELITE_NAME, countByName)).toBe(CUSTOM_ELITE_COUNT);
  });
});

describe("resolveCascadeCount", () => {
  it("returns custom default with fromDefault true when set", () => {
    const countByName = { [ELITE_NAME]: "99" };
    expect(resolveCascadeCount(ELITE_NAME, countByName, NAME_MONSTER_MAP)).toEqual({
      fromDefault: true,
      value: "99",
    });
  });

  it("falls back to latest count with fromDefault false when no custom default", () => {
    // 规则：无 b 默认值时取 a 最近使用值（counts[0]，即下拉选项[0]）
    expect(resolveCascadeCount(ELITE_NAME, EMPTY_DEFAULTS.countByName, NAME_MONSTER_MAP)).toEqual({
      fromDefault: false,
      value: CUSTOM_ELITE_COUNT,
    });
  });

  it("returns empty string when name has no saved records", () => {
    expect(resolveCascadeCount("未知", EMPTY_DEFAULTS.countByName, NAME_MONSTER_MAP)).toEqual({
      fromDefault: false,
      value: "",
    });
  });
});

describe("resolveCascadeName", () => {
  it("returns custom default with fromDefault true when set", () => {
    const
      nameByType = { [ELITE_TYPE]: NEW_ELITE_NAME },
      map: NameMonsterMap = {
        ...NAME_MONSTER_MAP,
        [NEW_ELITE_NAME]: { counts: ["35"], type: ELITE_TYPE },
      };
    expect(resolveCascadeName(ELITE_TYPE, nameByType, map)).toEqual({
      fromDefault: true,
      value: NEW_ELITE_NAME,
    });
  });

  it("falls back to latest name of type with fromDefault false when no custom default", () => {
    // 规则：无 b 默认值时取 a 最近使用值（该类型历史键序第一，即下拉选项[0]）
    expect(resolveCascadeName(NORMAL_TYPE, EMPTY_DEFAULTS.nameByType, NAME_MONSTER_MAP)).toEqual({
      fromDefault: false,
      value: NORMAL_NAME,
    });
  });

  it("returns empty string when type has no saved records", () => {
    expect(resolveCascadeName(NORMAL_TYPE, EMPTY_DEFAULTS.nameByType, {})).toEqual({
      fromDefault: false,
      value: "",
    });
  });
});
// #endregion
