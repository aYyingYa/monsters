import { useEffect, useState } from "react";

// #region 常量与路由工具
const
  /** 默认落地页路径（首页） */
  HOME_PATH = "/home",
  /** 呱唧地页面路径 */
  GUAJIDI_PATH = "/guajidi",
  /**
   * 读取当前 hash 路由路径（无 hash 时视为根路径）
   * @returns 以 / 开头的路由路径
   */
  getHashPath = (): string => {
    const hash = window.location.hash.replace(/^#/u, "");
    if (hash.startsWith("/")) {
      return hash;
    }
    return "/";
  },
  /**
   * Hash 路由 Hook：监听 hashchange 返回当前路径
   * @returns 当前路由路径
   */
  useHashPath = (): string => {
    const [path, setPath] = useState<string>(getHashPath);

    useEffect(() => {
      const handleHashChange = (): void => {
        setPath(getHashPath());
      };
      window.addEventListener("hashchange", handleHashChange);
      return (): void => {
        window.removeEventListener("hashchange", handleHashChange);
      };
    }, []);

    return path;
  },
  /**
   * 编程式跳转（修改 location.hash 触发路由）
   * @param path 目标路径
   */
  navigateTo = (path: string): void => {
    window.location.hash = path;
  },
  /**
   * 规范化路由路径：根路径重定向到首页
   * @param path 当前路由路径
   * @returns 规范化后的路径（始终为已注册页面）
   */
  resolveRoutePath = (path: string): string => {
    if (path === "/" || path === "") {
      return HOME_PATH;
    }
    return path;
  };
// #endregion

export { GUAJIDI_PATH, HOME_PATH, navigateTo, resolveRoutePath, useHashPath };
