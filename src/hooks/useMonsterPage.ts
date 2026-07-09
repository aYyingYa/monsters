import {
  DEFAULT_MONSTER_TYPE,
  DELETE_SUCCESS_MESSAGE,
  EDIT_SUCCESS_MESSAGE,
  ELITE_MONSTER_TYPE,
  SELECT_DATE_MESSAGE_PREFIX,
  STATE_VALUE_INDEX,
  TIMER_CANCEL_MESSAGE,
  TIMER_CONFIRM_MESSAGE,
  TIMER_PAUSE_MESSAGE,
  TIMER_RESUME_MESSAGE,
  TIMER_START_MESSAGE,
} from "../configs";
import type { FormValues, Monster } from "../types/App";
import { useState } from "react";
import { App, Form, type TableProps } from "antd";
import type { FilterValue, SortOrder } from "antd/es/table/interface";
import type { FormInstance } from "antd/es/form";
import { reduceMonsterCount } from "../utils/calc";
import useMonsterStorage from "./useMonsterStorage";
import useMonsterTimer from "./useMonsterTimer";
import { v4 as uuidv4 } from "uuid";

// #region 类型定义
/**
 * 页面数据钩子返回结果
 */
interface UseMonsterPageResult {
  /**
   * 当前选中的日期
   */
  activeDate: string;
  /**
   * 可选的日期文件列表
   */
  availableDates: string[];
  /**
   * 历史数量选项
   */
  countHistory: string[];
  /**
   * 当前正在编辑的怪物（null 表示未编辑）
   */
  editMonster: Monster | null;
  /**
   * 编辑弹窗是否打开
   */
  editModalOpen: boolean;
  /**
   * 小怪累计数量
   */
  defaultMonsterCount: number;
  /**
   * 计时器已运行毫秒数
   */
  elapsedMs: number;
  /**
   * 精英怪累计数量
   */
  eliteMonsterCount: number;
  /**
   * 受控筛选状态
   */
  filteredInfo: Record<string, FilterValue | null>;
  /**
   * 表单实例
   */
  form: FormInstance<FormValues>;
  /**
   * 计时器运行模式
   */
  mode: "idle" | "paused" | "running";
  /**
   * 怪物列表
   */
  monsters: Monster[];
  /**
   * 历史名称选项
   */
  nameHistory: string[];
  /**
   * 受控排序状态
   */
  sortInfo: { columnKey: string; order: SortOrder } | null;
  /**
   * 取消编辑
   */
  onCancelEdit: () => void;
  /**
   * 取消当前计时且不记录
   */
  onCancelRecord: () => void;
  /**
   * 结束并记录确认回调
   */
  onConfirmRecord: () => Promise<void>;
  /**
   * 删除记录
   * @param id 怪物 id
   */
  onDeleteMonster: (id: string) => Promise<void>;
  /**
   * 打开编辑弹窗
   * @param monster 怪物对象
   */
  onEditMonster: (monster: Monster) => void;
  /**
   * 暂停计时
   */
  onPauseTimer: () => void;
  /**
   * 继续计时
   */
  onResumeTimer: () => void;
  /**
   * 切换日期文件
   * @param date 目标日期
   */
  onSelectDate: (date: string) => Promise<void>;
  /**
   * 开始计时回调
   */
  onStartTimer: () => void;
  /**
   * 表格变化回调
   */
  onTableChange: TableProps<Monster>["onChange"];
  /**
   * 提交编辑表单
   * @param values 表单值
   */
  onSubmitEdit: (values: FormValues) => Promise<void>;
}
// #endregion

// #region 页面数据钩子
/**
 * 聚合计时、表单校验与记录逻辑的页面钩子
 * @returns 页面所需数据与回调
 */
const useMonsterPage = (): UseMonsterPageResult => {
  const
    form = Form.useForm<FormValues>()[STATE_VALUE_INDEX],
    { message } = App.useApp(),
    monsterStorage = useMonsterStorage(),
    monsterTimer = useMonsterTimer(),
    [editMonster, setEditMonster] = useState<Monster | null>(null),
    [editModalOpen, setEditModalOpen] = useState(false),
    [filteredInfo, setFilteredInfo] = useState<Record<string, FilterValue | null>>({}),
    [sortInfo, setSortInfo] = useState<{ columnKey: string; order: SortOrder } | null>(null),
    countHistory = [...new Set(monsterStorage.monsters.map((monster) => monster.count.toString()))],
    nameHistory = [...new Set(monsterStorage.monsters.map((monster) => monster.name))],
    handleCancelEdit = (): void => {
      setEditModalOpen(false);
      setEditMonster(null);
    },
    handleCancelRecord = (): void => {
      monsterTimer.resetTimer();
      message.success(TIMER_CANCEL_MESSAGE);
    },
    handleConfirmRecord = async (): Promise<void> => {
      try {
        const
          values: FormValues = await form.validateFields(),
          elapsed = monsterTimer.stopTimer(),
          newMonster: Monster = {
            count: Number(values.count),
            id: uuidv4(),
            isInCurrentWorld: values.isInCurrentWorld,
            name: values.name,
            time: Date.now(),
            type: values.type,
            usedTime: elapsed,
          };
        form.setFieldValue("usedTime", elapsed);
        await monsterStorage.saveMonsters([...monsterStorage.monsters, newMonster]);
        message.success(TIMER_CONFIRM_MESSAGE);
      } catch {
        // 校验失败时 Ant Design 会自动展示错误提示
      }
    },
    handleDeleteMonster = async (id: string): Promise<void> => {
      const nextMonsters = monsterStorage.monsters.filter((monster) => monster.id !== id);
      await monsterStorage.saveMonsters(nextMonsters);
      message.success(DELETE_SUCCESS_MESSAGE);
    },
    handleEditMonster = (monster: Monster): void => {
      setEditMonster(monster);
      setEditModalOpen(true);
    },
    handlePauseTimer = (): void => {
      monsterTimer.pauseTimer();
      message.success(TIMER_PAUSE_MESSAGE);
    },
    handleResumeTimer = (): void => {
      monsterTimer.resumeTimer();
      message.success(TIMER_RESUME_MESSAGE);
    },
    handleSelectDate = async (date: string): Promise<void> => {
      await monsterStorage.selectDate(date);
      message.success(`${SELECT_DATE_MESSAGE_PREFIX}${date}`);
    },
    handleStartTimer = (): void => {
      monsterTimer.startTimer();
      message.success(TIMER_START_MESSAGE);
    },
    handleTableChange: NonNullable<TableProps<Monster>["onChange"]> = (_pagination, filters, sorter): void => {
      setFilteredInfo(filters);
      if (Array.isArray(sorter)) {
        setSortInfo(null);
        return;
      }
      setSortInfo({
        columnKey: sorter.columnKey as string,
        order: sorter.order ?? null,
      });
    },
    handleSubmitEdit = async (values: FormValues): Promise<void> => {
      if (!editMonster) {
        return;
      }
      const nextMonsters = monsterStorage.monsters.map((monster) => {
        if (monster.id !== editMonster.id) {
          return monster;
        }
        return {
          ...monster,
          count: Number(values.count),
          isInCurrentWorld: values.isInCurrentWorld,
          name: values.name,
          type: values.type,
        };
      });
      await monsterStorage.saveMonsters(nextMonsters);
      setEditModalOpen(false);
      setEditMonster(null);
      message.success(EDIT_SUCCESS_MESSAGE);
    };

  return {
    activeDate: monsterStorage.activeDate,
    availableDates: monsterStorage.availableDates,
    countHistory,
    defaultMonsterCount: reduceMonsterCount(monsterStorage.monsters, DEFAULT_MONSTER_TYPE),
    editModalOpen,
    editMonster,
    elapsedMs: monsterTimer.elapsedMs,
    eliteMonsterCount: reduceMonsterCount(monsterStorage.monsters, ELITE_MONSTER_TYPE),
    filteredInfo,
    form,
    mode: monsterTimer.mode,
    monsters: monsterStorage.monsters,
    nameHistory,
    onCancelEdit: handleCancelEdit,
    onCancelRecord: handleCancelRecord,
    onConfirmRecord: handleConfirmRecord,
    onDeleteMonster: handleDeleteMonster,
    onEditMonster: handleEditMonster,
    onPauseTimer: handlePauseTimer,
    onResumeTimer: handleResumeTimer,
    onSelectDate: handleSelectDate,
    onStartTimer: handleStartTimer,
    onSubmitEdit: handleSubmitEdit,
    onTableChange: handleTableChange,
    sortInfo,
  };
};
// #endregion

export default useMonsterPage;
export type { UseMonsterPageResult };
