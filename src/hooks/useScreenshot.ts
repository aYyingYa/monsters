import { toBlob } from "html-to-image";
import { useCallback } from "react";
import {
  SCREENSHOT_BACKGROUND_COLOR,
  SCREENSHOT_MIME_TYPE,
  SCREENSHOT_PIXEL_RATIO,
} from "../configs";

// #region 类型定义
/**
 * 截图目标节点过滤器
 * @param node DOM 节点
 * @returns 是否保留该节点
 */
type ScreenshotFilter = (node: Node) => boolean;

/**
 * 截图 Hook 返回结果
 */
interface UseScreenshotResult {
  /**
   * 对目标节点截图并写入系统剪切板
   * @param target 截图目标 DOM 节点
   * @returns 是否成功
   */
  capture: (target: HTMLElement | null) => Promise<boolean>;
}
// #endregion

// #region 私有函数与 Hook
const
  /**
   * 判断节点是否应被排除在截图之外
   * @param node DOM 节点
   * @returns true 表示保留，false 表示排除
   */
  includeNodeInScreenshot: ScreenshotFilter = (node) => {
    if (node instanceof HTMLElement) {
      return !node.dataset.screenshotExclude;
    }
    return true;
  },
  /**
   * 将 Blob 图片写入系统剪切板
   * @param blob 图片 Blob
   * @returns 写入是否成功
   */
  writeBlobToClipboard = async (blob: Blob): Promise<boolean> => {
    if (!navigator.clipboard || typeof navigator.clipboard.write !== "function") {
      return false;
    }
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ [blob.type || SCREENSHOT_MIME_TYPE]: blob }),
      ]);
      return true;
    } catch {
      return false;
    }
  },
  /**
   * 截图 Hook
   * @returns 截图触发函数
   */
  useScreenshot = (): UseScreenshotResult => {
    const capture = useCallback(
      async (target: HTMLElement | null): Promise<boolean> => {
        if (!target) {
          return false;
        }

        try {
          const blob = await toBlob(target, {
            backgroundColor: SCREENSHOT_BACKGROUND_COLOR,
            filter: includeNodeInScreenshot,
            pixelRatio: SCREENSHOT_PIXEL_RATIO,
          });
          if (!blob) {
            return false;
          }

          return await writeBlobToClipboard(blob);
        } catch {
          return false;
        }
      },
      [],
    );

    return { capture };
  };
// #endregion

export default useScreenshot;
export type { UseScreenshotResult };
