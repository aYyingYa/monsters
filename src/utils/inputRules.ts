import type { Rule } from "antd/es/form";

export const
  NUMBER_RULES: Rule[] = [{ message: "请输入有效的数字", pattern: /^-?\d+(?:\.\d{1,2})?$/u }],
  REQUIRED_RULE: (message: string) => Rule[] = (message) => [{ message, required: true }],
  TEL_RULES: Rule[] = [{ message: "请输入正确的11位手机号！", pattern: /^1[3-9]\d{9}$/u }],
  /** 呱唧地 Uid 校验规则（9位数字） */
  UID_RULES: Rule[] = [
    { message: "uid 为9位数字", pattern: /^\d{9}$/u },
    { message: "请输入uid", required: true },
  ],
  /** 呱唧地账号名校验规则 */
  ACCOUNT_NAME_RULES: Rule[] = [{ message: "请输入账号名", required: true }],
  /** 呱唧地账号校验规则（手机号或邮箱） */
  ACCOUNT_RULES: Rule[] = [
    { message: "请输入手机号或邮箱", required: true },
    { message: "请输入正确的手机号或邮箱", pattern: /^(?:1\d{10}|[^\s@]+@[^\s@]+\.[^\s@]+)$/u },
  ],
  /** 呱唧地密码校验规则 */
  PASSWORD_RULES: Rule[] = [{ message: "请输入密码", required: true }];
