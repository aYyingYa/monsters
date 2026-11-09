import type { FormDefaults, NameMonsterMap } from "../../services/monsterHistoryService";
import { AutoComplete, Form } from "antd";
import { MONSTER_NAME_LABEL, type MonsterType, ZERO } from "../../configs";
import React, { useCallback, useState } from "react";
import { REQUIRED_RULE } from "../../utils/inputRules";
import type { FormValues } from "../../types/App";
import ContextMenu from "../ContextMenu";
import { NameEditModal } from "../HistoryEditModal";
import { resolveCascadeCount, resolveDefaultName } from "../../utils/formDefaults";
import styles from "./index.module.less";
import useSafeMessage from "../../hooks/useSafeMessage";

// #region 类型定义
/**
 * 怪物名称输入组件属性
 */
interface NameInputProps {
  /**
   * 表单级联默认值配置
   */
  formDefaults: FormDefaults;
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
   * 设为指定类型的默认名称回调
   * @param type 怪物类型
   * @param name 默认怪物名称
   */
  onSetDefaultName: (type: MonsterType, name: string) => Promise<void>;
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
  /** 级联默认数量 toast 前缀 */
  CASCADE_COUNT_MESSAGE_PREFIX = "已切换为默认数量：",
  /** 级联最近使用数量 toast 前缀 */
  CASCADE_RECENT_COUNT_MESSAGE_PREFIX = "已切换为最近使用数量：",
  /** 设为默认值成功提示 */
  SET_DEFAULT_NAME_MESSAGE = "已设为该类型默认名称",
  /**
   * 怪物名称输入框（选项按当前怪物类型过滤，支持右键编辑/删除/设为默认历史选项）
   * @param props 组件属性
   * @returns 名称输入控件
   */
  NameInput: React.FC<NameInputProps> = (props) => {
    // #region 解构属性、表单监听、状态与动作
    const
      { formDefaults, nameMonsterMap, onRemoveRecord, onSetDefaultName, onUpdateRecord } = props,
      form = Form.useFormInstance<FormValues>(),
      message = useSafeMessage(),
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
       * 选中历史名称时回填其绑定类型，数量级联切换到该名称级联值（优先默认，无默认取最近使用）；
       * 数量被回填时 toast 提示
       * @param name 选中的名称
       */
      handleNameSelect = (name: string): void => {
        const
          record = nameMonsterMap[name],
          nextCount = resolveCascadeCount(name, formDefaults.countByName, nameMonsterMap);
        // 无绑定记录时不回填，保留用户当前输入
        if (typeof record === "undefined") {
          return;
        }
        form.setFieldsValue({
          count: nextCount.value,
          type: record.type,
        });
        if (nextCount.value === "") {
          return;
        }
        if (nextCount.fromDefault) {
          message.success(`${CASCADE_COUNT_MESSAGE_PREFIX}${nextCount.value}`);
        } else {
          message.success(`${CASCADE_RECENT_COUNT_MESSAGE_PREFIX}${nextCount.value}`);
        }
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
      /** 菜单设为默认：将该名称绑定为当前类型的默认名称 */
      handleMenuSetDefault = (): void => {
        if (menuState === null || typeof currentType === "undefined") {
          return;
        }
        message.success(SET_DEFAULT_NAME_MESSAGE);
        onSetDefaultName(currentType, menuState.name).catch((): void => {
          // 持久化失败时默认值仅本次会话生效
        });
        setMenuState(null);
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
          label={MONSTER_NAME_LABEL}
          name="name"
          rules={REQUIRED_RULE("请输入怪物名称")}
        >
          <AutoComplete
            allowClear
            onSelect={handleNameSelect}
            optionRender={(option) => {
              const optionName = String(option.value ?? ""),
               isDefaultOption =
                optionName !== "" &&
                typeof currentType !== "undefined" &&
                optionName === resolveDefaultName(currentType, formDefaults.nameByType, nameMonsterMap);
              let defaultBadge: React.ReactNode = null;
              if (isDefaultOption) {
                defaultBadge = <span className={styles.defaultBadge}>默认</span>;
              }
              return (
                <div
                  className={styles.optionRow}
                  data-context-option
                  onContextMenu={(event) => handleOptionContextMenu(event, optionName)}
                >
                  <span data-option-label>{option.label}</span>
                  {defaultBadge}
                </div>
              );
            }}
            options={nameOptions}
          />
        </Form.Item>
        <ContextMenu
          left={menuState?.clientX ?? ZERO}
          onClose={closeMenu}
          onDelete={handleMenuDelete}
          onEdit={handleMenuEdit}
          onSetDefault={handleMenuSetDefault}
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
