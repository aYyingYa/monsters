import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import {
  CONFIRM_OK_PATTERN,
  COUNT_FIELD_LABEL,
  ELITE_COUNT_LATEST,
  ELITE_COUNT_MIDDLE,
  ELITE_COUNT_OLD,
  ELITE_NAME,
  EXPECTED_MOBILE_COLUMNS,
  EXPECTED_PC_COLUMNS,
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
  TYPE_FIELD_LABEL,
  asyncNoop,
  clickOption,
  getOptionTexts,
  openDropdown,
  renderFormItems,
  renderPcFormItems,
  rightClickOption,
  selectEliteNameAndOpenCount,
  setViewportWidth,
} from "./testUtils";

// #region 布局用例
describe("FormItems", () => {
  it("renders 6 columns on PC", () => {
    renderPcFormItems();
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
  // #endregion

  // #region 级联默认值用例（默认值与最近使用是两套概念）
  it("filters name options by current type", async () => {
    renderPcFormItems();
    fireEvent.mouseDown(screen.getByLabelText(NAME_FIELD_LABEL));
    // 默认类型为精英怪，名称选项应只有精英怪名称
    await waitFor(() => {
      expect(getOptionTexts(NAME_FIELD_LABEL)).toEqual([ELITE_NAME]);
    });
  });

  it("resets count to default count on name select", async () => {
    renderPcFormItems({
      formDefaults: { countByName: { [ELITE_NAME]: ELITE_COUNT_OLD }, nameByType: {} },
    });
    fireEvent.mouseDown(screen.getByLabelText(NAME_FIELD_LABEL));
    await waitFor(() => {
      expect(getOptionTexts(NAME_FIELD_LABEL)).toEqual([ELITE_NAME]);
    });
    clickOption(NAME_FIELD_LABEL, ELITE_NAME);
    // 数量切换为该名称的默认数量而非最近使用数量
    expect(screen.getByLabelText(COUNT_FIELD_LABEL)).toHaveValue(ELITE_COUNT_OLD);
  });

  it("falls back to latest count on name select without default count", async () => {
    renderPcFormItems();
    fireEvent.mouseDown(screen.getByLabelText(NAME_FIELD_LABEL));
    await waitFor(() => {
      expect(getOptionTexts(NAME_FIELD_LABEL)).toEqual([ELITE_NAME]);
    });
    clickOption(NAME_FIELD_LABEL, ELITE_NAME);
    // 规则：无 b 默认值时取 a 最近使用值（counts[0]）
    expect(screen.getByLabelText(COUNT_FIELD_LABEL)).toHaveValue(ELITE_COUNT_LATEST);
  });

  it("shows count options with latest first and the rest ascending", async () => {
    renderPcFormItems();
    // 数量选项属于当前名称，需先选中名称
    await openDropdown(NAME_FIELD_LABEL);
    clickOption(NAME_FIELD_LABEL, ELITE_NAME);
    await openDropdown(COUNT_FIELD_LABEL);
    expect(getOptionTexts(COUNT_FIELD_LABEL)).toEqual([ELITE_COUNT_LATEST, ELITE_COUNT_OLD, ELITE_COUNT_MIDDLE]);
  });

  it("cascades custom defaults on type change", async () => {
    renderPcFormItems({
      formDefaults: {
        countByName: { [NORMAL_NAME]: NORMAL_COUNT },
        nameByType: { [NORMAL_TYPE]: NORMAL_NAME },
      },
    });
    fireEvent.mouseDown(screen.getByLabelText(TYPE_FIELD_LABEL));
    await waitFor(() => {
      expect(getOptionTexts(TYPE_FIELD_LABEL).length).toBe(MONSTER_TYPE_OPTION_COUNT);
    });
    clickOption(TYPE_FIELD_LABEL, NORMAL_TYPE);
    // 类型切换后名称/数量级联到各自默认值
    expect(screen.getByLabelText(NAME_FIELD_LABEL)).toHaveValue(NORMAL_NAME);
    expect(screen.getByLabelText(COUNT_FIELD_LABEL)).toHaveValue(NORMAL_COUNT);
  });

  it("falls back to latest used name and count on type change without defaults", async () => {
    renderPcFormItems();
    fireEvent.mouseDown(screen.getByLabelText(TYPE_FIELD_LABEL));
    await waitFor(() => {
      expect(getOptionTexts(TYPE_FIELD_LABEL).length).toBe(MONSTER_TYPE_OPTION_COUNT);
    });
    clickOption(TYPE_FIELD_LABEL, NORMAL_TYPE);
    // 规则：无 b 默认值时名称取该类型最近使用名称，数量级联取该名称最近使用数量
    expect(screen.getByLabelText(NAME_FIELD_LABEL)).toHaveValue(NORMAL_NAME);
    expect(screen.getByLabelText(COUNT_FIELD_LABEL)).toHaveValue(NORMAL_COUNT);
  });

  it("shows names of new type after type change", async () => {
    renderPcFormItems();
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
  // #endregion

  // #region 右键菜单用例
  describe("context menu", () => {
    it("opens name edit modal with record data on menu edit", async () => {
      renderPcFormItems();
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
      renderPcFormItems({ onUpdateRecord });
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
        expect(onUpdateRecord).toHaveBeenCalledWith(ELITE_NAME, NEW_NAME, [ELITE_COUNT_LATEST, ELITE_COUNT_MIDDLE, ELITE_COUNT_OLD]);
      });
    });

    it("calls onRemoveRecord on delete confirm", async () => {
      const onRemoveRecord = vi.fn(asyncNoop);
      renderPcFormItems({ onRemoveRecord });
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
      renderPcFormItems({ onUpdateCount });
      await selectEliteNameAndOpenCount();
      expect(getOptionTexts(COUNT_FIELD_LABEL)).toEqual([ELITE_COUNT_LATEST, ELITE_COUNT_OLD, ELITE_COUNT_MIDDLE]);
      rightClickOption(COUNT_FIELD_LABEL, ELITE_COUNT_LATEST);
      fireEvent.click(await screen.findByTestId(MENU_EDIT_TEST_ID));
      // 数量输入框已回填最近使用数量，需限定弹窗范围定位编辑输入框
      fireEvent.change(
        within(await screen.findByRole("dialog")).getByDisplayValue(ELITE_COUNT_LATEST),
        { target: { value: NEW_COUNT } }
      );
      fireEvent.click(screen.getByRole("button", { name: OK_BUTTON_TEXT }));
      await waitFor(() => {
        expect(onUpdateCount).toHaveBeenCalledWith(ELITE_NAME, ELITE_COUNT_LATEST, NEW_COUNT);
      });
    });

    it("calls onRemoveCount on count delete confirm", async () => {
      const onRemoveCount = vi.fn(asyncNoop);
      renderPcFormItems({ onRemoveCount });
      await selectEliteNameAndOpenCount();
      expect(getOptionTexts(COUNT_FIELD_LABEL)).toEqual([ELITE_COUNT_LATEST, ELITE_COUNT_OLD, ELITE_COUNT_MIDDLE]);
      rightClickOption(COUNT_FIELD_LABEL, ELITE_COUNT_LATEST);
      fireEvent.click(await screen.findByTestId(MENU_DELETE_TEST_ID));
      fireEvent.click(await screen.findByRole("button", { name: CONFIRM_OK_PATTERN }));
      await waitFor(() => {
        expect(onRemoveCount).toHaveBeenCalledWith(ELITE_NAME, ELITE_COUNT_LATEST);
      });
    });

    it("calls onSetDefaultName with current type on name set default", async () => {
      const onSetDefaultName = vi.fn(asyncNoop);
      renderPcFormItems({ onSetDefaultName });
      fireEvent.mouseDown(screen.getByLabelText(NAME_FIELD_LABEL));
      await waitFor(() => {
        expect(getOptionTexts(NAME_FIELD_LABEL)).toEqual([ELITE_NAME]);
      });
      rightClickOption(NAME_FIELD_LABEL, ELITE_NAME);
      fireEvent.click(await screen.findByTestId(MENU_SET_DEFAULT_TEST_ID));
      await waitFor(() => {
        expect(onSetDefaultName).toHaveBeenCalledWith("精英怪", ELITE_NAME);
      });
    });

    it("calls onSetDefaultCount with current name on count set default", async () => {
      const onSetDefaultCount = vi.fn(asyncNoop);
      renderPcFormItems({
        formDefaults: { countByName: {}, nameByType: { "精英怪": ELITE_NAME } },
        onSetDefaultCount,
      });
      await selectEliteNameAndOpenCount();
      expect(getOptionTexts(COUNT_FIELD_LABEL)).toEqual([ELITE_COUNT_LATEST, ELITE_COUNT_OLD, ELITE_COUNT_MIDDLE]);
      rightClickOption(COUNT_FIELD_LABEL, ELITE_COUNT_OLD);
      fireEvent.click(await screen.findByTestId(MENU_SET_DEFAULT_TEST_ID));
      await waitFor(() => {
        expect(onSetDefaultCount).toHaveBeenCalledWith(ELITE_NAME, ELITE_COUNT_OLD);
      });
    });
  });
  // #endregion
});
