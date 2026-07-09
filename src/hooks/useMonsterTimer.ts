import {
  STATE_SETTER_INDEX,
  STATE_VALUE_INDEX,
  TIMER_UPDATE_INTERVAL,
  ZERO,
} from "../configs";
import { useEffect, useRef, useState } from "react";

// #region 类型定义
/** 计时器运行模式 */
type TimerMode = "idle" | "paused" | "running";

/**
 * 计时器数据状态
 */
interface MonsterTimerState {
  /**
   * 已运行毫秒数
   */
  elapsedMs: number;
  /**
   * 当前计时模式
   */
  mode: TimerMode;
}

/**
 * 计时器钩子返回结果
 */
interface UseMonsterTimerResult {
  /**
   * 已运行毫秒数
   */
  elapsedMs: number;
  /**
   * 当前计时模式
   */
  mode: TimerMode;
  /**
   * 暂停计时（不重置）
   */
  pauseTimer: () => void;
  /**
   * 重置计时器为空闲状态
   */
  resetTimer: () => void;
  /**
   * 继续计时
   */
  resumeTimer: () => void;
  /**
   * 开始计时
   */
  startTimer: () => void;
  /**
   * 停止计时并返回最终用时
   */
  stopTimer: () => number;
}
// #endregion

// #region 常量、辅助函数与计时器钩子
const
  /** 启动定时器并持续更新已运行时长 */
  runInterval = (
    setTimerData: (value: MonsterTimerState) => void,
    startTime: number
  ): number => window.setInterval(() => {
    setTimerData({ elapsedMs: Date.now() - startTime, mode: "running" });
  }, TIMER_UPDATE_INTERVAL),
  /**
   * 怪物计时器钩子
   * @returns 计时器状态与控制函数
   */
  useMonsterTimer = (): UseMonsterTimerResult => {
    const
      activeTimerRef = useRef<number | null>(null),
      elapsedBeforePauseRef = useRef(ZERO),
      monsterTimerData = useState<MonsterTimerState>({ elapsedMs: ZERO, mode: "idle" }),
      startTimeRef = useRef(ZERO),
      timerSetter = monsterTimerData[STATE_SETTER_INDEX],
      timerValue = monsterTimerData[STATE_VALUE_INDEX],
      clearActiveTimer = (): void => {
        if (activeTimerRef.current !== null) {
          window.clearInterval(activeTimerRef.current);
          activeTimerRef.current = null;
        }
      },
      pauseTimer = (): void => {
        clearActiveTimer();
        elapsedBeforePauseRef.current = timerValue.elapsedMs;
        timerSetter({ elapsedMs: timerValue.elapsedMs, mode: "paused" });
      },
      resetTimer = (): void => {
        clearActiveTimer();
        elapsedBeforePauseRef.current = ZERO;
        timerSetter({ elapsedMs: timerValue.elapsedMs, mode: "idle" });
      },
      resumeTimer = (): void => {
        const resumedStartTime = Date.now() - elapsedBeforePauseRef.current;
        startTimeRef.current = resumedStartTime;
        timerSetter({ elapsedMs: elapsedBeforePauseRef.current, mode: "running" });
        activeTimerRef.current = runInterval(timerSetter, resumedStartTime);
      },
      startTimer = (): void => {
        const start = Date.now();
        startTimeRef.current = start;
        elapsedBeforePauseRef.current = ZERO;
        timerSetter({ elapsedMs: ZERO, mode: "running" });
        activeTimerRef.current = runInterval(timerSetter, start);
      },
      stopTimer = (): number => {
        clearActiveTimer();
        const finalElapsed = Date.now() - startTimeRef.current;
        timerSetter({ elapsedMs: finalElapsed, mode: "idle" });
        return finalElapsed;
      };

    useEffect(
      () => (): void => {
        if (activeTimerRef.current !== null) {
          window.clearInterval(activeTimerRef.current);
        }
      },
      []
    );

    return {
      elapsedMs: timerValue.elapsedMs,
      mode: timerValue.mode,
      pauseTimer,
      resetTimer,
      resumeTimer,
      startTimer,
      stopTimer,
    };
  };
// #endregion

export default useMonsterTimer;
export type { TimerMode };
