import type { FormDefaults, NameMonsterMap } from "../../services/monsterHistoryService";
import { AutoComplete, Form } from "antd";
import { MONSTER_COUNT_LABEL, ZERO } from "../../configs";
import { NUMBER_RULES, REQUIRED_RULE } from "../../utils/inputRules";
import React, { useCallback, useState } from "react";
import type { FormValues } from "../../types/App";
import ContextMenu from "../ContextMenu";
import { CountEditModal } from "../HistoryEditModal";
import { validateInitInput } from "../../utils/inputNormalize";
import { resolveDefaultCount } from "../../utils/formDefaults";
import styles from "./index.module.less";
import useSafeMessage from "../../hooks/useSafeMessage";

// #region 类型定义
/**
 * 怪物数量输入组件属性
 */
interface CountInputProps {
  /**
   * 表单级联默认值配置
   */
  formDefaults: FormDefaults;
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
   * 设为指定名称的默认数量回调
   * @param name 怪物名称
   * @param count 默认怪物数量
   */
  onSetDefaultCount: (name: string, count: string) => Promise<void>;
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

// #region 纯函数工具与组件
const
  /** 设为默认值成功提示 */
  SET_DEFAULT_COUNT_MESSAGE = "已设为该名称默认数量",
  /**
   * 数量数值升序比较器（数量入库前已经数值校验，直接转 Number 比较）
   * @param prev 前一个数量
   * @param next 后一个数量
   * @returns 升序比较结果
   */
  compareCountBySize = (prev: string, next: string): number => Number(prev) - Number(next),
  /**
   * 生成数量展示列表：第一项保留最近使用，其余按数值升序
   * @param counts 数量历史（存储序：最近使用在前）
   * @returns 展示用数量列表
   */
  toDisplayCounts = (counts: string[]): string[] => {
    const [latestCount, ...restCounts] = counts;
    // 无历史数量时直接返回空列表
    if (typeof latestCount === "undefined") {
      return [];
    }
    return [latestCount, ...restCounts.sort(compareCountBySize)];
  },
  /**
   * 怪物数量输入框（选项为当前名称的历史数量，支持右键编辑/删除/设为默认历史选项）
   * @param props 组件属性
   * @returns 数量输入控件
   */
  CountInput: React.FC<CountInputProps> = (props) => {
    // #region 解构属性、表单监听、状态与动作
    const
      { formDefaults, nameMonsterMap, onRemoveCount, onSetDefaultCount, onUpdateCount } = props,
      form = Form.useFormInstance<FormValues>(),
      message = useSafeMessage(),
      watchedName = Form.useWatch("name", form),
      // 首帧 useWatch 字段可能未注册，兜底读取表单当前值
      currentName: string = watchedName ?? form.getFieldValue("name") ?? "",
      // 该名称的默认数量（数量选项标记用）
      defaultCountOfName = resolveDefaultCount(currentName, formDefaults.countByName),
      [menuState, setMenuState] = useState<MenuState | null>(null),
      [editingCount, setEditingCount] = useState<string | null>(null),
      countOptions = toDisplayCounts(nameMonsterMap[currentName]?.counts ?? []).map((count) => ({ label: count, value: count })),
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
      /** 菜单设为默认：将该数量绑定为当前名称的默认数量 */
      handleMenuSetDefault = (): void => {
        if (menuState === null || currentName === "") {
          return;
        }
        message.success(SET_DEFAULT_COUNT_MESSAGE);
        onSetDefaultCount(currentName, menuState.count).catch((): void => {
          // 持久化失败时默认值仅本次会话生效
        });
        setMenuState(null);
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
          label={MONSTER_COUNT_LABEL}
          name="count"
          normalize={(value: string) => validateInitInput(value, "NON_NEGATIVE")}
          rules={[...REQUIRED_RULE("请输入怪物数量"), ...NUMBER_RULES]}
        >
          <AutoComplete
            allowClear
            filterOption={false}
            optionRender={(option) => {
              const optionCount = String(option.value ?? ""),
               isDefaultOption = optionCount !== "" && optionCount === defaultCountOfName;
              let defaultBadge: React.ReactNode = null;
              if (isDefaultOption) {
                defaultBadge = <span className={styles.defaultBadge}>默认</span>;
              }
              return (
                <div
                  className={styles.optionRow}
                  data-context-option
                  onContextMenu={(event) => handleOptionContextMenu(event, optionCount)}
                >
                  <span data-option-label>{option.label}</span>
                  {defaultBadge}
                </div>
              );
            }}
            options={countOptions}
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
