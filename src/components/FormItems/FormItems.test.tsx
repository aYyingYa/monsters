import { Form } from "antd";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import FormItems from "./index";

const PC_WIDTH = 1200,
  MOBILE_WIDTH = 375,
  EXPECTED_PC_COLUMNS = 6,
  EXPECTED_MOBILE_COLUMNS = 3,
  ELAPSED_MS = 0,
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
   * 渲染 FormItems 测试组件
   * @returns 渲染结果
   */
  renderFormItems = (): ReturnType<typeof render> =>
    render(
      <Form>
        <FormItems
          countHistory={[]}
          elapsedMs={ELAPSED_MS}
          mode="idle"
          nameHistory={[]}
          onCancelRecord={noop}
          onConfirmRecord={noop}
          onInsertNoTimeRecord={asyncNoop}
          onNameSelect={noop}
          onPauseTimer={noop}
          onResumeTimer={noop}
          onStartTimer={noop}
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
});
