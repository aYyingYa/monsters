import { App as AntdApp } from "antd";
import { MILLISECONDS_PER_SECOND } from "../configs";
import { useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

// #region 类型定义
/**
 * 安全 Message API（与 useApp message 调用方式一致，反馈方法不返回 Promise）
 */
export interface SafeMessageApi {
  /**
   * 销毁全部或指定 key 的 toast
   * @param key 指定 toast key（不传则全部销毁）
   */
  destroy: (key?: string) => void;
  /**
   * 错误反馈
   * @param content 展示文本
   */
  error: (content: string) => void;
  /**
   * 信息反馈
   * @param content 展示文本
   */
  info: (content: string) => void;
  /**
   * 成功反馈
   * @param content 展示文本
   */
  success: (content: string) => void;
  /**
   * 警告反馈
   * @param content 展示文本
   */
  warning: (content: string) => void;
}
// #endregion

// #region 常量与 Hook 实现
const
  /** Toast 默认展示时长（秒） */
  DEFAULT_TOAST_DURATION_SECONDS = 3,
  /** 不自动关闭的 duration 值（0 时计时器不启动） */
  MANUAL_CLOSE_DURATION = 0,
  /**
   * 安全 Message Hook：绕过 useApp message 计时器提前关闭的上游 bug
   * （@rc-component/notification useNoticeTimer 与当前运行时兼容问题），
   * 通过 duration: 0 挂起自动关闭 + 手动 setTimeout 关闭，行为等价原生 toast
   * @returns 与 useApp message 调用方式一致的反馈 API
   */
  useSafeMessage = (): SafeMessageApi => {
  const { message } = AntdApp.useApp();

  return useMemo(() => {
    const
      /**
       * 打开一条手动计时的 toast
       * @param content 展示文本
       * @param type 反馈类型
       */
      openWithManualTimer = (
        content: string,
        type: "error" | "info" | "success" | "warning"
      ): void => {
        const
          key = uuidv4(),
          closeNotice = message.open({ content, duration: MANUAL_CLOSE_DURATION, key, type });
        window.setTimeout(
          closeNotice,
          DEFAULT_TOAST_DURATION_SECONDS * MILLISECONDS_PER_SECOND
        );
      };

    return {
      destroy: (key?: string) => {
        message.destroy(key);
      },
      error: (content: string) => {
        openWithManualTimer(content, "error");
      },
      info: (content: string) => {
        openWithManualTimer(content, "info");
      },
      success: (content: string) => {
        openWithManualTimer(content, "success");
      },
      warning: (content: string) => {
        openWithManualTimer(content, "warning");
      },
    };
  }, [message]);
};
// #endregion

export default useSafeMessage;
