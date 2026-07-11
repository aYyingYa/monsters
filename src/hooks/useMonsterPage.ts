import {
  DEFAULT_MONSTER_TYPE,
  DELETE_SUCCESS_MESSAGE,
  EDIT_SUCCESS_MESSAGE,
  ELITE_MONSTER_TYPE,
  NO_TIME_RECORD_SUCCESS_MESSAGE,
  SELECT_DATE_MESSAGE_PREFIX,
  STATE_VALUE_INDEX,
  TIMER_CANCEL_MESSAGE,
  TIMER_CONFIRM_MESSAGE,
  TIMER_PAUSE_MESSAGE,
  TIMER_RESUME_MESSAGE,
  TIMER_START_MESSAGE,
} from "../configs";
import type { FormValues, Monster } from "../types/App";
import { useCallback, useEffect, useRef, useState } from "react";
import { App, Form, type TableProps } from "antd";
import type { SortOrder } from "antd/es/table/interface";
import type { FormInstance } from "antd/es/form";
import { reduceMonsterCount } from "../utils/calc";
import useMonsterHistory from "./useMonsterHistory";
import useMonsterStorage from "./useMonsterStorage";
import useMonsterTimer from "./useMonsterTimer";
import { v4 as uuidv4 } from "uuid";

// #region 类型定义
interface UseMonsterPageResult {
  activeDate: string;
  availableDates: string[];
  countHistory: string[];
  editMonster: Monster | null;
  editModalOpen: boolean;
  defaultMonsterCount: number;
  elapsedMs: number;
  eliteMonsterCount: number;
  form: FormInstance<FormValues>;
  mode: "idle" | "paused" | "running";
  monsters: Monster[];
  nameHistory: string[];
  sortInfo: { columnKey: string; order: SortOrder } | null;
  onCancelEdit: () => void;
  onCancelRecord: () => void;
  onConfirmRecord: () => Promise<void>;
  onInsertNoTimeRecord: () => Promise<void>;
  onNameSelect: (name: string) => void;
  onDeleteMonster: (id: string) => Promise<void>;
  onEditMonster: (monster: Monster) => void;
  onPauseTimer: () => void;
  onResumeTimer: () => void;
  onSelectDate: (date: string) => Promise<void>;
  onStartTimer: () => void;
  onTableChange: TableProps<Monster>["onChange"];
  onSubmitEdit: (values: FormValues) => Promise<void>;
}
// #endregion

// #region 页面数据钩子
const useMonsterPage = (): UseMonsterPageResult => {
  // #region 状态、引用与回调
  const
    form = Form.useForm<FormValues>()[STATE_VALUE_INDEX],
    { message } = App.useApp(),
    monsterStorage = useMonsterStorage(),
    monsterTimer = useMonsterTimer(),
    monsterHistory = useMonsterHistory(),
    [editMonster, setEditMonster] = useState<Monster | null>(null),
    [editModalOpen, setEditModalOpen] = useState(false),
    [sortInfo, setSortInfo] = useState<{ columnKey: string; order: SortOrder } | null>(null),
    monstersRef = useRef(monsterStorage.monsters),
    saveMonstersRef = useRef(monsterStorage.saveMonsters),
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
        await Promise.all([
          monsterStorage.saveMonsters([...monsterStorage.monsters, newMonster]),
          monsterHistory.saveNameCount(values.name, values.count),
        ]);
        message.success(TIMER_CONFIRM_MESSAGE);
      } catch {
        // 校验失败时 Ant Design 会自动展示错误提示
      }
    },
    handleInsertNoTimeRecord = async (): Promise<void> => {
      try {
        const
          values: FormValues = await form.validateFields(),
          newMonster: Monster = {
            count: Number(values.count),
            id: uuidv4(),
            isInCurrentWorld: values.isInCurrentWorld,
            name: values.name,
            time: Date.now(),
            type: values.type,
            usedTime: 0,
          };
        await Promise.all([
          monsterStorage.saveMonsters([...monsterStorage.monsters, newMonster]),
          monsterHistory.saveNameCount(values.name, values.count),
        ]);
        message.success(NO_TIME_RECORD_SUCCESS_MESSAGE);
      } catch {
        // 校验失败时 Ant Design 会自动展示错误提示
      }
    },
    handleDeleteMonster = useCallback(async (id: string): Promise<void> => {
      const nextMonsters = monstersRef.current.filter((monster) => monster.id !== id);
      await saveMonstersRef.current(nextMonsters);
      message.success(DELETE_SUCCESS_MESSAGE);
    }, [message]),
    handleEditMonster = useCallback((monster: Monster): void => {
      setEditMonster(monster);
      setEditModalOpen(true);
    }, []),
    handleNameSelect = (name: string): void => {
      const count = monsterHistory.nameCountMap[name];
      if (typeof count !== "undefined") {
        form.setFieldValue("count", count);
      }
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
    handleTableChange: NonNullable<TableProps<Monster>["onChange"]> = (_pagination, _filters, sorter): void => {
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
      await Promise.all([
        monsterStorage.saveMonsters(nextMonsters),
        monsterHistory.saveNameCount(values.name, values.count),
      ]);
      setEditModalOpen(false);
      setEditMonster(null);
      message.success(EDIT_SUCCESS_MESSAGE);
    };

  useEffect(() => {
    monstersRef.current = monsterStorage.monsters;
    saveMonstersRef.current = monsterStorage.saveMonsters;
  }, [monsterStorage.monsters, monsterStorage.saveMonsters]);
  // #endregion

  return {
    activeDate: monsterStorage.activeDate,
    availableDates: monsterStorage.availableDates,
    countHistory: monsterHistory.countHistory,
    defaultMonsterCount: reduceMonsterCount(monsterStorage.monsters, DEFAULT_MONSTER_TYPE),
    editModalOpen,
    editMonster,
    elapsedMs: monsterTimer.elapsedMs,
    eliteMonsterCount: reduceMonsterCount(monsterStorage.monsters, ELITE_MONSTER_TYPE),
    form,
    mode: monsterTimer.mode,
    monsters: monsterStorage.monsters,
    nameHistory: monsterHistory.nameHistory,
    onCancelEdit: handleCancelEdit,
    onCancelRecord: handleCancelRecord,
    onConfirmRecord: handleConfirmRecord,
    onDeleteMonster: handleDeleteMonster,
    onEditMonster: handleEditMonster,
    onInsertNoTimeRecord: handleInsertNoTimeRecord,
    onNameSelect: handleNameSelect,
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
