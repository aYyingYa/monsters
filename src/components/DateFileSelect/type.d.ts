/**
 * 日期文件选择组件属性
 */
interface DateFileSelectProps {
  /**
   * 当前选中的日期
   */
  activeDate: string;
  /**
   * 可选的日期文件列表
   */
  availableDates: string[];
  /**
   * 选择日期回调
   * @param date 目标日期
   */
  onSelect: (date: string) => void;
}

export type { DateFileSelectProps };
