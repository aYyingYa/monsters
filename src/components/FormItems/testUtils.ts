import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Form } from "antd";
import FormItems from "./index";
import type { FormItemsProps } from "./type";
import type { NameMonsterMap } from "../../services/monsterHistoryService";
import { createElement } from "react";
import { expect } from "vitest";

// #region 测试常量与工具（供 FormItems 测试用例共享）
const
  PC_WIDTH = 1200,
  MOBILE_WIDTH = 375,
  EXPECTED_PC_COLUMNS = 6,
  EXPECTED_MOBILE_COLUMNS = 3,
  MONSTER_TYPE_OPTION_COUNT = 2,
  ELAPSED_MS = 0,
  ELITE_NAME = "月铁",
  ELITE_COUNT_LATEST = "30",
  ELITE_COUNT_MIDDLE = "28",
  ELITE_COUNT_OLD = "26",
  NORMAL_NAME = "小蜘蛛",
  NORMAL_COUNT = "100",
  NORMAL_TYPE = "小怪",
  NEW_NAME = "新月铁",
  NEW_COUNT = "35",
  TYPE_FIELD_LABEL = "怪物类型",
  NAME_FIELD_LABEL = "怪物名称",
  COUNT_FIELD_LABEL = "怪物数量",
  OPTION_SELECTOR = ".ant-select-item-option",
  /** 下拉选项数量为零值（等待选项渲染的就绪判定时使用） */
  EMPTY_OPTION_COUNT = 0,
  /** 右键包装层选择器（optionRender 输出渲染在 antd 内容容器内部，需向内精确定位） */
  OPTION_WRAPPER_SELECTOR = "[data-context-option]",
  MENU_EDIT_TEST_ID = "context-menu-edit",
  MENU_DELETE_TEST_ID = "context-menu-delete",
  MENU_SET_DEFAULT_TEST_ID = "context-menu-set-default",
  OK_BUTTON_TEXT = "OK",
  /** Popconfirm 确认按钮匹配模式（antd 按钮对两个汉字自动插入空格，可访问名含空白符） */
  CONFIRM_OK_PATTERN = /^确\s*认$/u,
  /** 历史映射测试数据：精英怪月铁（存储序 30、28、26 即最近使用序，下拉展示序为 30、26、28），小怪小蜘蛛（数量历史 100） */
  NAME_MONSTER_MAP: NameMonsterMap = {
    [ELITE_NAME]: { counts: [ELITE_COUNT_LATEST, ELITE_COUNT_MIDDLE, ELITE_COUNT_OLD], type: "精英怪" },
    [NORMAL_NAME]: { counts: [NORMAL_COUNT], type: "小怪" },
  },
  /** 空级联默认值（默认值与最近使用是两套概念，测试默认两者分离） */
  EMPTY_FORM_DEFAULTS: FormItemsProps["formDefaults"] = { countByName: {}, nameByType: {} },
  /**
   * 空同步回调，仅用于测试
   */
  noop = (): void => {
    // 空回调，仅用于测试
  },
  /**
   * 空异步回调，仅用于测试
   */
  asyncNoop = async (): Promise<void> => {
    // 空回调，仅用于测试
  },
  /**
   * 设置视口宽度并触发 resize 事件
   * @param width 视口宽度
   */
  setViewportWidth = (width: number): void => {
    window.innerWidth = width;
    window.dispatchEvent(new Event("resize"));
  },

  /**
   * 获取指定字段当前打开的下拉选项元素（经 aria-owns 定位所属下拉容器，避免其他下拉残留干扰）
   * @param label 字段标签
   * @returns 选项元素数组
   */
  getOptionElements = (label: string): Element[] => {
    const
      listId = screen.getByLabelText(label).getAttribute("aria-owns"),
      dropdown = listId && document.getElementById(listId)?.closest(".ant-select-dropdown");
    if (!dropdown) {
      return [];
    }
    return Array.from(dropdown.querySelectorAll(OPTION_SELECTOR));
  },
  /**
   * 获取指定字段下拉选项的内容元素（名称/数量选项被右键包装层包裹，取包装层以触发其事件）
   * @param label 字段标签
   * @returns 内容元素数组
   */
  getOptionContents = (label: string): Element[] =>
    getOptionElements(label).map((element) => element.querySelector(OPTION_WRAPPER_SELECTOR) ?? element),
  /**
   * 获取指定字段当前打开的下拉选项文本列表
   * @param label 字段标签
   * @returns 选项文本数组
   */
  getOptionTexts = (label: string): string[] =>
    getOptionElements(label).map((element) => element.textContent ?? ""),
  /**
   * 点击指定字段下拉中文本匹配的选项
   * @param label 字段标签
   * @param text 选项文本
   */
  clickOption = (label: string, text: string): void => {
    const option = getOptionContents(label).find((element) => element.textContent === text);
    if (typeof option === "undefined") {
      throw new Error(`下拉选项不存在：${text}`);
    }
    fireEvent.click(option);
  },
  /**
   * 右键点击指定字段下拉中文本匹配的选项
   * @param label 字段标签
   * @param text 选项文本
   */
  rightClickOption = (label: string, text: string): void => {
    const option = getOptionContents(label).find((element) => element.textContent === text);
    if (typeof option === "undefined") {
      throw new Error(`下拉选项不存在：${text}`);
    }
    fireEvent.contextMenu(option);
  },

  /**
   * 打开指定字段下拉并等待选项渲染就绪
   * @param label 字段标签
   */
  openDropdown = async (label: string): Promise<void> => {
    fireEvent.mouseDown(screen.getByLabelText(label));
    await waitFor(() => {
      expect(getOptionElements(label).length).toBeGreaterThan(EMPTY_OPTION_COUNT);
    });
  },
  /**
   * 选中精英怪名称并打开数量下拉（数量选项依赖当前名称，需先选中名称）
   */
  selectEliteNameAndOpenCount = async (): Promise<void> => {
    await openDropdown(NAME_FIELD_LABEL);
    clickOption(NAME_FIELD_LABEL, ELITE_NAME);
    await openDropdown(COUNT_FIELD_LABEL);
  },
  /**
   * 渲染 FormItems 测试组件（用 createElement 避免 JSX 触发组件文件导出限制）
   * @param overrides 可选属性覆盖（用于注入动作监听）
   * @returns 渲染结果
   */
  renderFormItems = (overrides: Partial<FormItemsProps> = {}): ReturnType<typeof render> => {
    const formItemsProps: FormItemsProps = {
      elapsedMs: ELAPSED_MS,
      formDefaults: EMPTY_FORM_DEFAULTS,
      mode: "idle",
      nameMonsterMap: NAME_MONSTER_MAP,
      onCancelRecord: noop,
      onConfirmRecord: noop,
      onInsertNoTimeRecord: asyncNoop,
      onPauseTimer: noop,
      onRemoveCount: asyncNoop,
      onRemoveRecord: asyncNoop,
      onResumeTimer: noop,
      onSetDefaultCount: asyncNoop,
      onSetDefaultName: asyncNoop,
      onStartTimer: noop,
      onUpdateCount: asyncNoop,
      onUpdateRecord: asyncNoop,
      ...overrides,
    };
    return render(createElement(Form, null, createElement(FormItems, formItemsProps)));
  },
  /**
   * 以 PC 视口宽度渲染 FormItems 测试组件
   * @param overrides 可选属性覆盖（用于注入动作监听）
   * @returns 渲染结果
   */
  renderPcFormItems = (overrides: Partial<FormItemsProps> = {}): ReturnType<typeof render> => {
    setViewportWidth(PC_WIDTH);
    return renderFormItems(overrides);
  };
// #endregion

export {
  asyncNoop,
  clickOption,
  CONFIRM_OK_PATTERN,
  COUNT_FIELD_LABEL,
  ELITE_COUNT_LATEST,
  ELITE_COUNT_MIDDLE,
  ELITE_COUNT_OLD,
  ELITE_NAME,
  EXPECTED_MOBILE_COLUMNS,
  EXPECTED_PC_COLUMNS,
  getOptionTexts,
  MENU_DELETE_TEST_ID,
  MENU_EDIT_TEST_ID,
  MENU_SET_DEFAULT_TEST_ID,
  MOBILE_WIDTH,
  MONSTER_TYPE_OPTION_COUNT,
  NAME_FIELD_LABEL,
  NEW_COUNT,
  NEW_NAME,
  NORMAL_COUNT,
  NORMAL_NAME,
  NORMAL_TYPE,
  OK_BUTTON_TEXT,
  openDropdown,
  renderFormItems,
  renderPcFormItems,
  rightClickOption,
  selectEliteNameAndOpenCount,
  setViewportWidth,
  TYPE_FIELD_LABEL,
};
