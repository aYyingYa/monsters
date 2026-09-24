import { AutoComplete, Form } from "antd";
import { FORM_DEFAULT_MONSTER_NAME, MONSTER_NAME_LABEL, type MonsterType, ZERO } from "../../configs";
import React, { useCallback, useState } from "react";
import { REQUIRED_RULE } from "../../utils/inputRules";
import type { FormValues } from "../../types/App";
import type { NameMonsterMap } from "../../services/monsterHistoryService";
import ContextMenu from "../ContextMenu";
import { NameEditModal } from "../HistoryEditModal";

// #region 类型定义
/**
 * 怪物名称输入组件属性
 */
interface NameInputProps {
  /**
   * 名称到怪物属性的映射
   */
  nameMonsterMap: NameMonsterMap;
  /**
   * 删除名称记录回调
   * @param name 怪物名称
   */
  onRemoveRecord: (name: string) => Promise<void>;
  /**
   * 更新名称记录回调
   * @param oldName 原名称
   * @param name 新名称
   * @param counts 新数量历史列表
   */
  onUpdateRecord: (oldName: string, name: string, counts: string[]) => Promise<void>;
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
   * 右键目标名称
   */
  name: string;
}
// #endregion

// #region 组件
const
  /**
   * 怪物名称输入框（选项按当前怪物类型过滤，支持右键编辑/删除历史选项）
   * @param props 组件属性
   * @returns 名称输入控件
   */
  NameInput: React.FC<NameInputProps> = (props) => {
    // #region 解构属性、表单监听、状态与动作
    const
      { nameMonsterMap, onRemoveRecord, onUpdateRecord } = props,
      form = Form.useFormInstance<FormValues>(),
      watchedType = Form.useWatch("type", form),
      // 首帧 useWatch 字段可能未注册，兜底读取表单当前值
      currentType: MonsterType | undefined = watchedType ?? form.getFieldValue("type"),
      [menuState, setMenuState] = useState<MenuState | null>(null),
      [editingName, setEditingName] = useState<string | null>(null),
      nameOptions = Object.entries(nameMonsterMap)
        .filter(([, record]) => typeof currentType === "undefined" || record.type === currentType)
        .map(([name]) => ({ label: name, value: name })),
      // 重名校验需排除当前编辑的名称自身
      existingNames = Object.keys(nameMonsterMap).filter((name) => name !== editingName),
      /**
       * 选中历史名称时回填其绑定类型与最近使用的数量
       * @param name 选中的名称
       */
      handleNameSelect = (name: string): void => {
        const record = nameMonsterMap[name];
        // 无绑定记录或数量历史为空时不回填，保留用户当前输入
        if (typeof record === "undefined" || record.counts.length === ZERO) {
          return;
        }
        form.setFieldsValue({ count: record.counts[ZERO], type: record.type });
      },
      /** 关闭右键菜单 */
      closeMenu = useCallback((): void => {
        setMenuState(null);
      }, []),
      /**
       * 选项右键：阻止系统菜单并打开自定义菜单
       * 注意不可在选项上拦截 mousedown：rc-select 依赖列表容器的 mousedown preventDefault
       * 保持输入框焦点，拦截会截断冒泡导致下拉被 blur 逻辑关闭
       * @param event 鼠标事件
       * @param name 选项名称
       */
      handleOptionContextMenu = (event: React.MouseEvent, name: string): void => {
        event.preventDefault();
        setMenuState({ clientX: event.clientX, clientY: event.clientY, name });
      },
      /** 菜单编辑：打开名称编辑弹窗 */
      handleMenuEdit = (): void => {
        if (menuState === null) {
          return;
        }
        setEditingName(menuState.name);
        setMenuState(null);
      },
      /** 菜单删除确认：删除名称记录并关闭菜单 */
      handleMenuDelete = async (): Promise<void> => {
        if (menuState === null) {
          return;
        }
        await onRemoveRecord(menuState.name);
        setMenuState(null);
      },
      /**
       * 名称编辑弹窗保存：更新记录并关闭弹窗
       * @param name 新名称
       * @param counts 新数量历史列表
       */
      handleEditOk = async (name: string, counts: string[]): Promise<void> => {
        if (editingName === null) {
          return;
        }
        await onUpdateRecord(editingName, name, counts);
        setEditingName(null);
      },
      /** 名称编辑弹窗取消 */
      handleEditCancel = (): void => {
        setEditingName(null);
      };
    // #endregion

    // #region 编辑中的数量列表（编辑弹窗关闭时为空数组）
    let editingCounts: string[] = [];
    if (editingName !== null) {
      editingCounts = nameMonsterMap[editingName]?.counts ?? [];
    }
    // #endregion

    // #region 渲染
    return (
      <>
        <Form.Item
          initialValue={FORM_DEFAULT_MONSTER_NAME}
          label={MONSTER_NAME_LABEL}
          name="name"
          rules={REQUIRED_RULE("请输入怪物名称")}
        >
          <AutoComplete
            allowClear
            onSelect={handleNameSelect}
            optionRender={(option) => (
              <div
                data-context-option
                onContextMenu={(event) => handleOptionContextMenu(event, String(option.value ?? ""))}
              >
                {option.label}
              </div>
            )}
            options={nameOptions}
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
        <NameEditModal
          counts={editingCounts}
          existingNames={existingNames}
          key={editingName ?? ""}
          name={editingName ?? ""}
          onCancel={handleEditCancel}
          onOk={handleEditOk}
          open={editingName !== null}
        />
      </>
    );
    // #endregion
  };
// #endregion

export default NameInput;
