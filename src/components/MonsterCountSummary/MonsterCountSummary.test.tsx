import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
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
});
