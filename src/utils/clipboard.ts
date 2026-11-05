// #region 剪贴板工具
/**
 * 复制文本到剪贴板
 * @param text 待复制文本
 * @returns 复制是否成功
 */
export const copyText = async (text: string): Promise<boolean> => {
  try {
    if (!navigator.clipboard || typeof navigator.clipboard.writeText !== "function") {
      return false;
    }
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // 剪贴板权限被拒或非安全上下文时复制失败
    return false;
  }
};
// #endregion
