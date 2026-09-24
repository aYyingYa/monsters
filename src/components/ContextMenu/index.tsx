import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import type { ContextMenuProps } from "./type";
import { Popconfirm } from "antd";
import styles from "./index.module.less";

// #region 常量与组件
const
  /** 菜单预估宽度（像素），用于视口边缘防溢出 */
  MENU_WIDTH = 96,
  /** 菜单预估高度（像素），用于视口边缘防溢出 */
  MENU_HEIGHT = 76,
  /** 菜单与视口边缘的最小间距（像素） */
  VIEWPORT_MARGIN = 8,
  /** Popconfirm 气泡容器选择器，外部点击判定时排除 */
  POPOVER_SELECTOR = ".ant-popover",
  /** 删除确认气泡标题 */
  DELETE_CONFIRM_TITLE = "确认删除该选项？",
  /** 确认按钮文案 */
  CONFIRM_OK_TEXT = "确认",
  /** 取消按钮文案 */
  CONFIRM_CANCEL_TEXT = "取消",
  /** 空清理函数：菜单未打开时保持 effect 返回值类型一致 */
  noopCleanup = (): void => {
    // 未打开时无需清理
  },
  /**
   * 历史选项右键菜单（固定定位浮层，提供编辑与删除入口）
   * @param props 组件属性
   * @returns 右键菜单浮层
   */
  ContextMenu: React.FC<ContextMenuProps> = (props) => {
    // #region 解构属性、引用与定位
    const
      { left, onClose, onDelete, onEdit, open, top } = props,
      menuRef = useRef<HTMLDivElement>(null),
      // 靠近视口右/下边缘时向内收，避免菜单溢出屏幕
      menuLeft = Math.min(left, window.innerWidth - MENU_WIDTH - VIEWPORT_MARGIN),
      menuTop = Math.min(top, window.innerHeight - MENU_HEIGHT - VIEWPORT_MARGIN);
    // #endregion

    // #region 外部点击、滚动与 Esc 关闭
    useEffect(() => {
      if (!open) {
        return noopCleanup;
      }
      const
        handleMouseDown = (event: MouseEvent): void => {
          const { target } = event;
          if (!(target instanceof Node)) {
            return;
          }
          // 点击菜单内部不关闭
          if (menuRef.current?.contains(target)) {
            return;
          }
          // Popconfirm 气泡渲染在 body 下且不属于菜单容器，点击气泡时不关闭菜单
          if (target instanceof Element && target.closest(POPOVER_SELECTOR)) {
            return;
          }
          onClose();
        },
        handleKeyDown = (event: KeyboardEvent): void => {
          if (event.key === "Escape") {
            onClose();
          }
        },
        handleScroll = (): void => {
          onClose();
        };
      document.addEventListener("mousedown", handleMouseDown, true);
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("scroll", handleScroll, true);
      return (): void => {
        document.removeEventListener("mousedown", handleMouseDown, true);
        document.removeEventListener("keydown", handleKeyDown);
        document.removeEventListener("scroll", handleScroll, true);
      };
    }, [open, onClose]);
    // #endregion

    // #region 渲染
    if (!open) {
      return null;
    }
    return createPortal(
      <div className={styles.menu} data-testid="context-menu" ref={menuRef} style={{ left: menuLeft, top: menuTop }}>
        <div className={styles.item} data-testid="context-menu-edit" onClick={onEdit}>
          <EditOutlined />
          编辑
        </div>
        <Popconfirm
          cancelText={CONFIRM_CANCEL_TEXT}
          okText={CONFIRM_OK_TEXT}
          onConfirm={onDelete}
          placement="right"
          title={DELETE_CONFIRM_TITLE}
        >
          <div className={styles.item} data-testid="context-menu-delete">
            <DeleteOutlined />
            删除
          </div>
        </Popconfirm>
      </div>,
      document.body,
    );
    // #endregion
  };
// #endregion

export default ContextMenu;
