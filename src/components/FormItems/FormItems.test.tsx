import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "antd";
import FormItems from "./index";
import type { FormItemsProps } from "./type";
import type { NameMonsterMap } from "../../services/monsterHistoryService";

const PC_WIDTH = 1200,
  MOBILE_WIDTH = 375,
  EXPECTED_PC_COLUMNS = 6,
  EXPECTED_MOBILE_COLUMNS = 3,
  MONSTER_TYPE_OPTION_COUNT = 2,
  ELAPSED_MS = 0,
  ELITE_NAME = "月铁",
  ELITE_COUNT_LATEST = "30",
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
  /** 右键包装层选择器（optionRender 输出渲染在 antd 内容容器内部，需向内精确定位） */
  OPTION_WRAPPER_SELECTOR = "[data-context-option]",
  MENU_EDIT_TEST_ID = "context-menu-edit",
  MENU_DELETE_TEST_ID = "context-menu-delete",
  OK_BUTTON_TEXT = "OK",
  /** Popconfirm 确认按钮匹配模式（antd 按钮对两个汉字自动插入空格，可访问名含空白符） */
  CONFIRM_OK_PATTERN = /^确\s*认$/u,
  /** 历史映射测试数据：精英怪月铁（数量历史 30、26），小怪小蜘蛛（数量历史 100） */
  NAME_MONSTER_MAP: NameMonsterMap = {
    [ELITE_NAME]: { counts: [ELITE_COUNT_LATEST, ELITE_COUNT_OLD], type: "精英怪" },
    [NORMAL_NAME]: { counts: [NORMAL_COUNT], type: "小怪" },
  },
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
   * 渲染 FormItems 测试组件
   * @param overrides 可选属性覆盖（用于注入动作监听）
   * @returns 渲染结果
   */
  renderFormItems = (overrides: Partial<FormItemsProps> = {}): ReturnType<typeof render> =>
    render(
      <Form>
        <FormItems
          elapsedMs={ELAPSED_MS}
          mode="idle"
          nameMonsterMap={NAME_MONSTER_MAP}
          onCancelRecord={noop}
          onConfirmRecord={noop}
          onInsertNoTimeRecord={asyncNoop}
          onPauseTimer={noop}
          onRemoveCount={asyncNoop}
          onRemoveRecord={asyncNoop}
          onResumeTimer={noop}
          onStartTimer={noop}
          onUpdateCount={asyncNoop}
          onUpdateRecord={asyncNoop}
          {...overrides}
        />
      </Form>,
    );

describe("FormItems", () => {
  it("renders 6 columns on PC", () => {
    setViewportWidth(PC_WIDTH);
    renderFormItems();
    const row = screen.getByTestId("form-items-row"),
      columns = row.querySelectorAll(":scope > .ant-col");
    expect(columns.length).toBe(EXPECTED_PC_COLUMNS);
  });

  it("renders 3 rows on mobile", () => {
    setViewportWidth(MOBILE_WIDTH);
    renderFormItems();
    const row = screen.getByTestId("form-items-row"),
      columns = row.querySelectorAll(":scope > .ant-col");
    expect(columns.length).toBe(EXPECTED_MOBILE_COLUMNS);
  });

  it("filters name options by current type", async () => {
    setViewportWidth(PC_WIDTH);
    renderFormItems();
    fireEvent.mouseDown(screen.getByLabelText(NAME_FIELD_LABEL));
    // 默认类型为精英怪，名称选项应只有精英怪名称
    await waitFor(() => {
      expect(getOptionTexts(NAME_FIELD_LABEL)).toEqual([ELITE_NAME]);
    });
  });

  it("backfills latest count on name select", async () => {
    setViewportWidth(PC_WIDTH);
    renderFormItems();
    fireEvent.mouseDown(screen.getByLabelText(NAME_FIELD_LABEL));
    await waitFor(() => {
      expect(getOptionTexts(NAME_FIELD_LABEL)).toEqual([ELITE_NAME]);
    });
    clickOption(NAME_FIELD_LABEL, ELITE_NAME);
    // 回填该怪物最近使用的数量
    expect(screen.getByLabelText(COUNT_FIELD_LABEL)).toHaveValue(ELITE_COUNT_LATEST);
  });

  it("shows count options bound to current name", async () => {
    setViewportWidth(PC_WIDTH);
    renderFormItems();
    fireEvent.mouseDown(screen.getByLabelText(COUNT_FIELD_LABEL));
    // 默认名称为月铁，数量选项应是月铁的全部历史数量
    await waitFor(() => {
      expect(getOptionTexts(COUNT_FIELD_LABEL)).toEqual([ELITE_COUNT_LATEST, ELITE_COUNT_OLD]);
    });
  });

  it("clears name and count on type change", async () => {
    setViewportWidth(PC_WIDTH);
    renderFormItems();
    fireEvent.mouseDown(screen.getByLabelText(TYPE_FIELD_LABEL));
    await waitFor(() => {
      expect(getOptionTexts(TYPE_FIELD_LABEL).length).toBe(MONSTER_TYPE_OPTION_COUNT);
    });
    clickOption(TYPE_FIELD_LABEL, NORMAL_TYPE);
    expect(screen.getByLabelText(NAME_FIELD_LABEL)).toHaveValue("");
    expect(screen.getByLabelText(COUNT_FIELD_LABEL)).toHaveValue("");
  });

  it("shows names of new type after type change", async () => {
    setViewportWidth(PC_WIDTH);
    renderFormItems();
    fireEvent.mouseDown(screen.getByLabelText(TYPE_FIELD_LABEL));
    await waitFor(() => {
      expect(getOptionTexts(TYPE_FIELD_LABEL).length).toBe(MONSTER_TYPE_OPTION_COUNT);
    });
    clickOption(TYPE_FIELD_LABEL, NORMAL_TYPE);
    fireEvent.mouseDown(screen.getByLabelText(NAME_FIELD_LABEL));
    // 切换为小怪后，名称选项应只剩小怪名称
    await waitFor(() => {
      expect(getOptionTexts(NAME_FIELD_LABEL)).toEqual([NORMAL_NAME]);
    });
  });

  describe("context menu", () => {
    it("opens name edit modal with record data on menu edit", async () => {
      setViewportWidth(PC_WIDTH);
      renderFormItems();
      fireEvent.mouseDown(screen.getByLabelText(NAME_FIELD_LABEL));
      await waitFor(() => {
        expect(getOptionTexts(NAME_FIELD_LABEL)).toEqual([ELITE_NAME]);
      });
      rightClickOption(NAME_FIELD_LABEL, ELITE_NAME);
      fireEvent.click(await screen.findByTestId(MENU_EDIT_TEST_ID));
      // 弹窗应展示名称与数量列表（表单中名称值相同，需限定弹窗范围内查询）
      const dialog = await screen.findByRole("dialog");
      expect(within(dialog).getByDisplayValue(ELITE_NAME)).toBeInTheDocument();
      expect(within(dialog).getByDisplayValue(ELITE_COUNT_LATEST)).toBeInTheDocument();
      expect(within(dialog).getByDisplayValue(ELITE_COUNT_OLD)).toBeInTheDocument();
    });

    it("calls onUpdateRecord on name edit save", async () => {
      const onUpdateRecord = vi.fn(asyncNoop);
      setViewportWidth(PC_WIDTH);
      renderFormItems({ onUpdateRecord });
      fireEvent.mouseDown(screen.getByLabelText(NAME_FIELD_LABEL));
      await waitFor(() => {
        expect(getOptionTexts(NAME_FIELD_LABEL)).toEqual([ELITE_NAME]);
      });
      rightClickOption(NAME_FIELD_LABEL, ELITE_NAME);
      fireEvent.click(await screen.findByTestId(MENU_EDIT_TEST_ID));
      // 表单中名称值相同，需限定弹窗范围内查询
      fireEvent.change(within(await screen.findByRole("dialog")).getByDisplayValue(ELITE_NAME), {
        target: { value: NEW_NAME },
      });
      fireEvent.click(within(screen.getByRole("dialog")).getByRole("button", { name: OK_BUTTON_TEXT }));
      await waitFor(() => {
        expect(onUpdateRecord).toHaveBeenCalledWith(ELITE_NAME, NEW_NAME, [ELITE_COUNT_LATEST, ELITE_COUNT_OLD]);
      });
    });

    it("calls onRemoveRecord on delete confirm", async () => {
      const onRemoveRecord = vi.fn(asyncNoop);
      setViewportWidth(PC_WIDTH);
      renderFormItems({ onRemoveRecord });
      fireEvent.mouseDown(screen.getByLabelText(NAME_FIELD_LABEL));
      await waitFor(() => {
        expect(getOptionTexts(NAME_FIELD_LABEL)).toEqual([ELITE_NAME]);
      });
      rightClickOption(NAME_FIELD_LABEL, ELITE_NAME);
      fireEvent.click(await screen.findByTestId(MENU_DELETE_TEST_ID));
      // Popconfirm 气泡中点击确认
      fireEvent.click(await screen.findByRole("button", { name: CONFIRM_OK_PATTERN }));
      await waitFor(() => {
        expect(onRemoveRecord).toHaveBeenCalledWith(ELITE_NAME);
      });
    });

    it("calls onUpdateCount on count edit save", async () => {
      const onUpdateCount = vi.fn(asyncNoop);
      setViewportWidth(PC_WIDTH);
      renderFormItems({ onUpdateCount });
      fireEvent.mouseDown(screen.getByLabelText(COUNT_FIELD_LABEL));
      await waitFor(() => {
        expect(getOptionTexts(COUNT_FIELD_LABEL)).toEqual([ELITE_COUNT_LATEST, ELITE_COUNT_OLD]);
      });
      rightClickOption(COUNT_FIELD_LABEL, ELITE_COUNT_LATEST);
      fireEvent.click(await screen.findByTestId(MENU_EDIT_TEST_ID));
      fireEvent.change(await screen.findByDisplayValue(ELITE_COUNT_LATEST), { target: { value: NEW_COUNT } });
      fireEvent.click(screen.getByRole("button", { name: OK_BUTTON_TEXT }));
      await waitFor(() => {
        expect(onUpdateCount).toHaveBeenCalledWith(ELITE_NAME, ELITE_COUNT_LATEST, NEW_COUNT);
      });
    });

    it("calls onRemoveCount on count delete confirm", async () => {
      const onRemoveCount = vi.fn(asyncNoop);
      setViewportWidth(PC_WIDTH);
      renderFormItems({ onRemoveCount });
      fireEvent.mouseDown(screen.getByLabelText(COUNT_FIELD_LABEL));
      await waitFor(() => {
        expect(getOptionTexts(COUNT_FIELD_LABEL)).toEqual([ELITE_COUNT_LATEST, ELITE_COUNT_OLD]);
      });
      rightClickOption(COUNT_FIELD_LABEL, ELITE_COUNT_LATEST);
      fireEvent.click(await screen.findByTestId(MENU_DELETE_TEST_ID));
      fireEvent.click(await screen.findByRole("button", { name: CONFIRM_OK_PATTERN }));
      await waitFor(() => {
        expect(onRemoveCount).toHaveBeenCalledWith(ELITE_NAME, ELITE_COUNT_LATEST);
      });
    });
  });
});
