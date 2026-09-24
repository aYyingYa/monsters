import { App, Input, Modal, Space } from "antd";
import React, { useState } from "react";
import type { CountEditModalProps } from "./type";
import { validateInitInput } from "../../utils/inputNormalize";

// #region 常量与组件
const
  /** 弹窗标题 */
  MODAL_TITLE = "编辑数量选项",
  /** 数量输入框标签 */
  COUNT_LABEL = "怪物数量",
  /** 数量非法提示 */
  COUNT_INVALID_MESSAGE = "请输入有效的数字",
  /** 非负整数校验正则 */
  COUNT_PATTERN = /^\d+$/u,
  /** 行间距（像素） */
  ROW_GUTTER = 8,
  /**
   * 数量编辑弹窗：编辑单个历史数量项
   * 父组件需通过 key 传入编辑目标，打开新目标时重挂载，编辑状态直接由属性初始化
   * @param props 组件属性
   * @returns 数量编辑弹窗
   */
  CountEditModal: React.FC<CountEditModalProps> = (props) => {
    // #region 解构属性、编辑状态与保存
    const
      { count, onCancel, onOk, open } = props,
      { message } = App.useApp(),
      [editedCount, setEditedCount] = useState(count),
      /** 保存：数量必须是非空有效数字 */
      handleOk = (): void => {
        const trimmedCount = editedCount.trim();
        if (!COUNT_PATTERN.test(trimmedCount)) {
          message.warning(COUNT_INVALID_MESSAGE);
          return;
        }
        onOk(trimmedCount);
      };
    // #endregion

    // #region 渲染
    return (
      <Modal onCancel={onCancel} onOk={handleOk} open={open} title={MODAL_TITLE}>
        <Space direction="vertical" size={ROW_GUTTER} style={{ width: "100%" }}>
          <div>{COUNT_LABEL}</div>
          <Input
            onChange={(event) => setEditedCount(validateInitInput(event.target.value, "NON_NEGATIVE"))}
            value={editedCount}
          />
        </Space>
      </Modal>
    );
    // #endregion
  };
// #endregion

export default CountEditModal;
