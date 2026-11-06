import { describe, expect, it } from "vitest";
import type { FormDefaults, NameMonsterMap } from "../services/monsterHistoryService";
import { resolveDefaultCount, resolveDefaultName } from "./formDefaults";

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
    const nameByType = { [ELITE_TYPE]: NEW_ELITE_NAME },
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
    // 最近使用不作为默认值兜底，两套概念互不混用
    expect(resolveDefaultName(NORMAL_TYPE, EMPTY_DEFAULTS.nameByType, NAME_MONSTER_MAP)).toBe("");
  });
});

describe("resolveDefaultCount", () => {
  it("returns custom default count when set", () => {
    const countByName = { [ELITE_NAME]: CUSTOM_ELITE_COUNT };
    expect(resolveDefaultCount(ELITE_NAME, countByName)).toBe(CUSTOM_ELITE_COUNT);
  });

  it("returns empty string when no custom default even if name has recent counts", () => {
    // 最近使用数量不作为默认值兜底
    expect(resolveDefaultCount(ELITE_NAME, EMPTY_DEFAULTS.countByName)).toBe("");
  });
});
// #endregion
