import { GUAJIDI_PATH, HOME_PATH, resolveRoutePath, useHashPath } from "./router/hashRouter";
import BottomNav from "./components/BottomNav";
import GuajidiPage from "./pages/GuajidiPage";
import HomePage from "./pages/HomePage";
import React, { useEffect } from "react";
import styles from "./App.module.less";

// #region 应用主组件
/**
 * 应用主组件：hash 路由 + 底部导航布局
 * @returns 应用根组件
 */
const App: React.FC = () => {
  // #region 路由解析与默认重定向
  const
    rawPath = useHashPath(),
    path = resolveRoutePath(rawPath);

  // 根路径重定向到首页（替换 hash 触发重渲染）
  useEffect(() => {
    if (path !== rawPath) {
      window.location.replace(`#${path}`);
    }
  }, [path, rawPath]);
  // #endregion

  // #region 渲染
  return (
    <div className={styles.layout}>
      <main className={styles.content}>
        {path === HOME_PATH && <HomePage />}
        {path === GUAJIDI_PATH && <GuajidiPage />}
      </main>
      <BottomNav activePath={path} />
    </div>
  );
  // #endregion
};
// #endregion

export default App;
