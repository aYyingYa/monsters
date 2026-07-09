import type { Rule } from "antd/es/form";

export const
  NUMBER_RULES: Rule[] = [{ message: "请输入有效的数字", pattern: /^-?\d+(?:\.\d{1,2})?$/u }],
  REQUIRED_RULE: (message: string) => Rule[] = (message) => [{ message, required: true }],
  TEL_RULES: Rule[] = [{ message: "请输入正确的11位手机号！", pattern: /^1[3-9]\d{9}$/u }];
