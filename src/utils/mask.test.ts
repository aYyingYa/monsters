import { describe, expect, it } from "vitest";
import { maskAccount } from "./mask";

// #region 测试常量
const
  PHONE = "13812345678",
  PHONE_MASKED = "138****5678",
  EMAIL = "monster@example.com",
  EMAIL_MASKED = "mon****@example.com",
  LONG_TEXT = "abcdefghij",
  LONG_TEXT_MASKED = "ab****ij",
  SHORT_TEXT = "ab",
  SHORT_TEXT_MASKED = "a****";
// #endregion

// #region 测试用例
describe("maskAccount", () => {
  it("masks phone number keeping first 3 and last 4 digits", () => {
    expect(maskAccount(PHONE)).toBe(PHONE_MASKED);
  });

  it("masks email keeping first char of user name and full domain", () => {
    expect(maskAccount(EMAIL)).toBe(EMAIL_MASKED);
  });

  it("masks common long text keeping first 2 and last 2 chars", () => {
    expect(maskAccount(LONG_TEXT)).toBe(LONG_TEXT_MASKED);
  });

  it("masks short text keeping only first char", () => {
    expect(maskAccount(SHORT_TEXT)).toBe(SHORT_TEXT_MASKED);
  });
});
// #endregion
