import { AutoComplete, Form } from "antd";
import { FORM_DEFAULT_MONSTER_COUNT, MONSTER_COUNT_LABEL, ZERO } from "../../configs";
import { NUMBER_RULES, REQUIRED_RULE } from "../../utils/inputRules";
import React, { useCallback, useState } from "react";
import type { FormValues } from "../../types/App";
import type { NameMonsterMap } from "../../services/monsterHistoryService";
import ContextMenu from "../ContextMenu";
import { CountEditModal } from "../HistoryEditModal";
import { validateInitInput } from "../../utils/inputNormalize";

// #region 类型定义
/**
 * 怪物数量输入组件属性
 */
interface CountInputProps {
  /**
   * 名称到怪物属性的映射
   */
  nameMonsterMap: NameMonsterMap;
  /**
   * 删除数量项回调
   * @param name 怪物名称
   * @param count 待删除的数量
   */
  onRemoveCount: (name: string, count: string) => Promise<void>;
  /**
   * 更新数量项回调
   * @param name 怪物名称
   * @param oldCount 原数量
   * @param newCount 新数量
   */
  onUpdateCount: (name: string, oldCount: string, newCount: string) => Promise<void>;
}

/**
 * 右键菜单状态
 */
interface MenuState {
  /**
   * 菜单定位横坐标
   */
  clientX: number;
  /**
   * 菜单定位纵坐标
   */
  clientY: number;
  /**
   * 右键目标数量
   */
  count: string;
}
// #endregion

// #region 组件
const
  /**
   * 怪物数量输入框（选项为当前名称的历史数量，支持右键编辑/删除历史选项）
   * @param props 组件属性
   * @returns 数量输入控件
   */
  CountInput: React.FC<CountInputProps> = (props) => {
    // #region 解构属性、表单监听、状态与动作
    const
      { nameMonsterMap, onRemoveCount, onUpdateCount } = props,
      form = Form.useFormInstance<FormValues>(),
      watchedName = Form.useWatch("name", form),
      // 首帧 useWatch 字段可能未注册，兜底读取表单当前值
      currentName: string = watchedName ?? form.getFieldValue("name") ?? "",
      [menuState, setMenuState] = useState<MenuState | null>(null),
      [editingCount, setEditingCount] = useState<string | null>(null),
      countOptions = (nameMonsterMap[currentName]?.counts ?? []).map((count) => ({ label: count, value: count })),
      /** 关闭右键菜单 */
      closeMenu = useCallback((): void => {
        setMenuState(null);
      }, []),
      /**
       * 选项右键：阻止系统菜单并打开自定义菜单
       * 注意不可在选项上拦截 mousedown：rc-select 依赖列表容器的 mousedown preventDefault
       * 保持输入框焦点，拦截会截断冒泡导致下拉被 blur 逻辑关闭
       * @param event 鼠标事件
       * @param count 选项数量
       */
      handleOptionContextMenu = (event: React.MouseEvent, count: string): void => {
        event.preventDefault();
        setMenuState({ clientX: event.clientX, clientY: event.clientY, count });
      },
      /** 菜单编辑：打开数量编辑弹窗 */
      handleMenuEdit = (): void => {
        if (menuState === null) {
          return;
        }
        setEditingCount(menuState.count);
        setMenuState(null);
      },
      /** 菜单删除确认：删除数量项并关闭菜单 */
      handleMenuDelete = async (): Promise<void> => {
        if (menuState === null) {
          return;
        }
        await onRemoveCount(currentName, menuState.count);
        setMenuState(null);
      },
      /**
       * 数量编辑弹窗保存：更新数量项并关闭弹窗
       * @param count 新数量
       */
      handleEditOk = async (count: string): Promise<void> => {
        if (editingCount === null) {
          return;
        }
        await onUpdateCount(currentName, editingCount, count);
        setEditingCount(null);
      },
      /** 数量编辑弹窗取消 */
      handleEditCancel = (): void => {
        setEditingCount(null);
      };
    // #endregion

    // #region 渲染
    return (
      <>
        <Form.Item
          initialValue={FORM_DEFAULT_MONSTER_COUNT}
          label={MONSTER_COUNT_LABEL}
          name="count"
          normalize={(value: string) => validateInitInput(value, "NON_NEGATIVE")}
          rules={[...REQUIRED_RULE("请输入怪物数量"), ...NUMBER_RULES]}
        >
          <AutoComplete
            allowClear
            filterOption={false}
            optionRender={(option) => (
              <div
                data-context-option
                onContextMenu={(event) => handleOptionContextMenu(event, String(option.value ?? ""))}
              >
                {option.label}
              </div>
            )}
            options={countOptions}
          />
        </Form.Item>
        <ContextMenu
          left={menuState?.clientX ?? ZERO}
          onClose={closeMenu}
          onDelete={handleMenuDelete}
          onEdit={handleMenuEdit}
          open={menuState !== null}
          top={menuState?.clientY ?? ZERO}
        />
        <CountEditModal
          count={editingCount ?? ""}
          key={editingCount ?? ""}
          onCancel={handleEditCancel}
          onOk={handleEditOk}
          open={editingCount !== null}
        />
      </>
    );
    // #endregion
  };
// #endregion

export default CountInput;
