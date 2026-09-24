import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "antd";
import MonsterCountSummary from "./index";
import { useEffect } from "react";

const PC_WIDTH = 1200,
  MOBILE_WIDTH = 375,
  EXPECTED_PC_COLUMNS = 2,
  EXPECTED_MOBILE_COLUMNS = 2,
  EXPECTED_ZERO_CELL_COLUMNS = 0,
  DEFAULT_COUNT = 0,
  ELITE_COUNT = 0,
  ELITE_TYPE = "精英怪",
  CELL_COLUMN_SELECTOR = ".ant-col-12",
  EMPTY_TEXT = "",
  HAS_COUNT = "88",
  /** 车数预估文案匹配模式（如「打月铁还需5车」） */
  CAR_TEXT_PATTERN = /还需\d+车/u,
  /** 进度区域测试标识 */
  PROGRESS_TEST_ID = "count-card-progress",
  /** 精英怪卡片进度文本（上限 400，当前 0） */
  ELITE_PROGRESS_TEXT = "0/400",
  /** 第一张卡片在进度区域列表中的下标 */
  FIRST_CARD_INDEX = 0,
  /**
   * 设置视口宽度并触发 resize 事件
   * @param width 视口宽度
   */
  setViewportWidth = (width: number): void => {
    window.innerWidth = width;
    window.dispatchEvent(new Event("resize"));
  },
  /**
   * 测试包装组件，内部创建真实 form 实例
   * @returns 统计摘要测试组件
   */
  SummaryWrapper: React.FC = () => {
    const [form] = Form.useForm();
    return (
      <MonsterCountSummary
        defaultMonsterCount={DEFAULT_COUNT}
        eliteMonsterCount={ELITE_COUNT}
        form={form}
        monsters={[]}
      />
    );
  },
  /**
   * 模拟类型切换后数量被清空场景的包装组件
   * @returns 统计摘要测试组件
   */
  EmptyCountSummaryWrapper: React.FC = () => {
    const [form] = Form.useForm();
    useEffect(() => {
      form.setFieldsValue({ count: EMPTY_TEXT, type: ELITE_TYPE });
    }, [form]);
    return (
      <MonsterCountSummary
        defaultMonsterCount={DEFAULT_COUNT}
        eliteMonsterCount={ELITE_COUNT}
        form={form}
        monsters={[]}
      />
    );
  },
  /**
   * 模拟只填数量未填名称场景的包装组件
   * @returns 统计摘要测试组件
   */
  EmptyNameSummaryWrapper: React.FC = () => {
    const [form] = Form.useForm();
    useEffect(() => {
      form.setFieldsValue({ count: HAS_COUNT, name: EMPTY_TEXT, type: ELITE_TYPE });
    }, [form]);
    return (
      <MonsterCountSummary
        defaultMonsterCount={DEFAULT_COUNT}
        eliteMonsterCount={ELITE_COUNT}
        form={form}
        monsters={[]}
      />
    );
  },
  /**
   * 渲染 MonsterCountSummary 测试组件
   * @returns 渲染结果
   */
  renderSummary = (): ReturnType<typeof render> => render(<SummaryWrapper />);

describe("MonsterCountSummary", () => {
  it("renders 2 columns on PC", () => {
    setViewportWidth(PC_WIDTH);
    renderSummary();
    const row = screen.getByTestId("count-summary-row"),
      columns = row.querySelectorAll(":scope > .ant-col");
    expect(columns.length).toBe(EXPECTED_PC_COLUMNS);
  });

  it("renders 2 stacked rows on mobile", () => {
    setViewportWidth(MOBILE_WIDTH);
    renderSummary();
    const row = screen.getByTestId("count-summary-row"),
      columns = row.querySelectorAll(":scope > .ant-col");
    expect(columns.length).toBe(EXPECTED_MOBILE_COLUMNS);
  });

  it("hides cell text when count is cleared", async () => {
    setViewportWidth(PC_WIDTH);
    render(<EmptyCountSummaryWrapper />);
    // 数量被清空后，单车数量区域不应渲染出 0
    await waitFor(() => {
      const zeroCellColumns = Array.from(document.querySelectorAll(CELL_COLUMN_SELECTOR)).filter(
        (element) => element.textContent === "0",
      );
      expect(zeroCellColumns.length).toBe(EXPECTED_ZERO_CELL_COLUMNS);
    });
  });

  it("hides car text when name is empty", async () => {
    setViewportWidth(PC_WIDTH);
    render(<EmptyNameSummaryWrapper />);
    // 未填名称时目标未确定，不应出现任何车数预估文案
    await waitFor(() => {
      expect(screen.queryByText(CAR_TEXT_PATTERN)).not.toBeInTheDocument();
    });
  });

  it("copies progress text on progress click", async () => {
    const writeText = vi.fn((): Promise<void> => Promise.resolve());
    // 测试环境无剪贴板实现，注入内存替身
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });
    setViewportWidth(PC_WIDTH);
    renderSummary();
    fireEvent.click(screen.getAllByTestId(PROGRESS_TEST_ID)[FIRST_CARD_INDEX]);
    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(ELITE_PROGRESS_TEXT);
    });
  });
});
