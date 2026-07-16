import { Form } from "antd";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import MonsterCountSummary from "./index";

const PC_WIDTH = 1200,
  MOBILE_WIDTH = 375,
  EXPECTED_PC_COLUMNS = 2,
  EXPECTED_MOBILE_COLUMNS = 2,
  DEFAULT_COUNT = 0,
  ELITE_COUNT = 0,
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
});
