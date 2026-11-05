// #region 常量与脱敏工具
const
  /** 字符串起始索引 */
  START_INDEX = 0,
  /** 中国大陆手机号长度 */
  PHONE_LENGTH = 11,
  /** 手机号保留前缀长度 */
  PHONE_PREFIX_LENGTH = 3,
  /** 手机号保留后缀长度 */
  PHONE_SUFFIX_LENGTH = 4,
  /** 邮箱用户名保留长度 */
  EMAIL_PREFIX_LENGTH = 3,
  /** 过短文本保留长度 */
  SHORT_MASK_KEEP_LENGTH = 1,
  /** 通用脱敏保留前缀长度 */
  COMMON_PREFIX_LENGTH = 2,
  /** 通用脱敏保留后缀长度 */
  COMMON_SUFFIX_LENGTH = 2,
  /** 通用脱敏最小可保留长度 */
  COMMON_MIN_LENGTH = COMMON_PREFIX_LENGTH + COMMON_SUFFIX_LENGTH,
  /** 手机号正则 */
  PHONE_PATTERN = /^1\d+$/u,
  /** 邮箱正则 */
  EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/u,
  /** 统一脱敏占位符 */
  MASK_PLACEHOLDER = "****",
  /**
   * 对手机号脱敏：保留前3位与后4位
   * @param phone 手机号
   * @returns 脱敏后的手机号
   */
  maskPhone = (phone: string): string =>
    phone.slice(START_INDEX, PHONE_PREFIX_LENGTH) + MASK_PLACEHOLDER + phone.slice(-PHONE_SUFFIX_LENGTH),
  /**
   * 对邮箱脱敏：用户名仅保留首字符
   * @param email 邮箱
   * @returns 脱敏后的邮箱
   */
  maskEmail = (email: string): string => {
    const
      [userName = "", domain = ""] = email.split("@"),
      maskedUserName = userName.slice(START_INDEX, EMAIL_PREFIX_LENGTH) + MASK_PLACEHOLDER;
    return `${maskedUserName}@${domain}`;
  },
  /**
   * 通用脱敏：保留前2位与后2位，过短时仅保留前1位
   * @param text 原始文本
   * @returns 脱敏后的文本
   */
  maskCommon = (text: string): string => {
    if (text.length >= COMMON_MIN_LENGTH) {
      return text.slice(START_INDEX, COMMON_PREFIX_LENGTH) + MASK_PLACEHOLDER + text.slice(-COMMON_SUFFIX_LENGTH);
    }
    return text.slice(START_INDEX, SHORT_MASK_KEEP_LENGTH) + MASK_PLACEHOLDER;
  },
  /**
   * 对账号（手机号或邮箱）脱敏，展示用
   * @param account 原始账号
   * @returns 脱敏后的账号
   */
  maskAccount = (account: string): string => {
    if (EMAIL_PATTERN.test(account)) {
      return maskEmail(account);
    }
    if (account.length === PHONE_LENGTH && PHONE_PATTERN.test(account)) {
      return maskPhone(account);
    }
    return maskCommon(account);
  };
// #endregion

export { maskAccount };
