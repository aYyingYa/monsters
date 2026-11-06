/**
 * 右键菜单组件属性
 */
export interface ContextMenuProps {
  /**
   * 菜单定位横坐标（像素）
   */
  left: number;
  /**
   * 菜单关闭回调
   */
  onClose: () => void;
  /**
   * 删除确认回调
   */
  onDelete: () => void;
  /**
   * 编辑回调
   */
  onEdit: () => void;
  /**
   * 设为默认值回调（不传则不展示该菜单项）
   */
  onSetDefault?: () => void;
  /**
   * 菜单是否打开
   */
  open: boolean;
  /**
   * 菜单定位纵坐标（像素）
   */
  top: number;
}
