// #region 整数输入校验函数
const
  /**
   * 移除数字字符串开头的连续零
   * @param value 输入值
   * @returns 处理后的字符串
   */
  cleanLeadingZeros = (value: string): string => value.replace(/^0+(?=\d)/u, ""),
  /**
   * 规范化负号：只允许出现在开头，并移除其余负号
   * @param value 输入值
   * @returns 处理后的字符串
   */
  normalizeNegativeSign = (value: string): string => {
    if (!value.includes("-")) {
      return value;
    }
    if (value.startsWith("-")) {
      const afterSign = value.replace(/^-/u, "");
      return `-${cleanLeadingZeros(afterSign.replace(/-/gu, ""))}`;
    }
    return value.replace(/-/gu, "");
  },
  /**
   * 过滤非数字字符
   * @param value 输入值
   * @param allowNegative 是否允许负数
   * @returns 过滤后的字符串
   */
  removeInvalidChars = (value: string, allowNegative: boolean): string => {
    if (allowNegative) {
      return value.replace(/[^0-9-]/gu, "");
    }
    return value.replace(/[^0-9]/gu, "");
  },
  /**
   * 校验并格式化整数输入
   * @param value 输入值
   * @param type 校验类型，默认允许负数
   * @returns 处理后的合法值
   */
  validateInitInput = (value: string, type?: "NON_NEGATIVE"): string => {
    if (value) {
      return cleanLeadingZeros(
        normalizeNegativeSign(removeInvalidChars(value.trim(), type !== "NON_NEGATIVE"))
      );
    }
    return "";
  };

export { validateInitInput };
// #endregion
