import type { BottomNavProps } from "./type";
import { GUAJIDI_PATH, HOME_PATH, navigateTo } from "../../router/hashRouter";
import { HomeOutlined, IdcardOutlined } from "@ant-design/icons";
import React from "react";
import styles from "./index.module.less";

// #region 类型定义
/**
 * 底部导航项
 */
interface NavItem {
  /**
   * 导航路径
   */
  path: string;
  /**
   * 导航标签
   */
  label: string;
  /**
   * 导航图标
   */
  icon: React.ReactNode;
}
// #endregion

// #region 底部导航栏组件
/**
 * 底部导航栏
 * @param props 组件属性
 * @returns 底部导航栏控件
 */
const BottomNav: React.FC<BottomNavProps> = (props) => {
  const
    { activePath } = props,
    /** 导航项列表 */
    navItems: NavItem[] = [
      { icon: <HomeOutlined />, label: "锄地", path: HOME_PATH },
      { icon: <IdcardOutlined />, label: "呱唧地", path: GUAJIDI_PATH },
    ];

  // #region 渲染
  return (
    <nav className={styles.bottomNav}>
      {navItems.map((item) => {
        const isActive = activePath === item.path;
        let
          itemClassName = styles.navItem,
          ariaCurrent: "false" | "page" = "false";
        if (isActive) {
          itemClassName = `${itemClassName} ${styles.active}`;
          ariaCurrent = "page";
        }
        return (
          <button
            aria-current={ariaCurrent}
            className={itemClassName}
            key={item.path}
            onClick={() => {
              navigateTo(item.path);
            }}
            type="button"
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span className={styles.navLabel}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
  // #endregion
};
// #endregion

export default BottomNav;
