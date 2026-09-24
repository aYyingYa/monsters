import { App, Button, Input, Modal, Space } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import type { NameEditModalProps } from "./type";
import { validateInitInput } from "../../utils/inputNormalize";

// #region 常量与组件
const
  /** 弹窗标题 */
  MODAL_TITLE = "编辑名称选项",
  /** 名称输入框标签 */
  NAME_LABEL = "怪物名称",
  /** 数量列表标签 */
  COUNTS_LABEL = "数量列表",
  /** 添加数量按钮文案 */
  ADD_COUNT_TEXT = "添加数量",
  /** 名称为空提示 */
  NAME_EMPTY_MESSAGE = "名称不能为空",
  /** 名称重复提示 */
  NAME_DUPLICATED_MESSAGE = "名称已存在",
  /** 行间距（像素） */
  ROW_GUTTER = 8,
  /**
   * 名称编辑弹窗：编辑怪物名称与其数量历史列表
   * 父组件需通过 key 传入编辑目标，打开新目标时重挂载，编辑状态直接由属性初始化
   * @param props 组件属性
   * @returns 名称编辑弹窗
   */
  NameEditModal: React.FC<NameEditModalProps> = (props) => {
    // #region 解构属性、编辑状态与行操作
    const
      { counts, existingNames, name, onCancel, onOk, open } = props,
      { message } = App.useApp(),
      [editedName, setEditedName] = useState(name),
      [editedCounts, setEditedCounts] = useState<string[]>(counts),
      /**
       * 更新指定行的数量（实时过滤非法字符）
       * @param index 行下标
       * @param value 输入值
       */
      handleCountChange = (index: number, value: string): void => {
        setEditedCounts(
          editedCounts.map((item, itemIndex) => {
            if (itemIndex === index) {
              return validateInitInput(value, "NON_NEGATIVE");
            }
            return item;
          }),
        );
      },
      /** 添加一行空数量 */
      handleAddCount = (): void => {
        setEditedCounts([...editedCounts, ""]);
      },
      /**
       * 删除指定行的数量
       * @param index 行下标
       */
      handleRemoveCount = (index: number): void => {
        setEditedCounts(editedCounts.filter((_count, itemIndex) => itemIndex !== index));
      },
      /** 保存：名称非空且不重复，数量去空白去重 */
      handleOk = (): void => {
        const
          trimmedName = editedName.trim(),
          nextCounts = [
            ...new Set(editedCounts.map((item) => item.trim()).filter((item) => item !== "")),
          ];
        if (trimmedName === "") {
          message.warning(NAME_EMPTY_MESSAGE);
          return;
        }
        // 与其他名称重复时拒绝保存，避免合并歧义
        if (existingNames.includes(trimmedName)) {
          message.warning(NAME_DUPLICATED_MESSAGE);
          return;
        }
        onOk(trimmedName, nextCounts);
      };
    // #endregion

    // #region 渲染
    return (
      <Modal onCancel={onCancel} onOk={handleOk} open={open} title={MODAL_TITLE}>
        <Space direction="vertical" size={ROW_GUTTER} style={{ width: "100%" }}>
          <div>{NAME_LABEL}</div>
          <Input
            onChange={(event) => setEditedName(event.target.value)}
            value={editedName}
          />
          <div>{COUNTS_LABEL}</div>
          {editedCounts.map((count, index) => (
            // 编辑中的数量无稳定唯一标识，使用行下标作为 key
            <Space key={index} style={{ display: "flex" }}>
              <Input
                onChange={(event) => handleCountChange(index, event.target.value)}
                value={count}
              />
              <Button
                icon={<DeleteOutlined />}
                onClick={() => handleRemoveCount(index)}
                type="text"
              />
            </Space>
          ))}
          <Button icon={<PlusOutlined />} onClick={handleAddCount} type="dashed">
            {ADD_COUNT_TEXT}
          </Button>
        </Space>
      </Modal>
    );
    // #endregion
  };
// #endregion

export default NameEditModal;
