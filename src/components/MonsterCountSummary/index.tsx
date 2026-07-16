import { Col, Grid, Row } from "antd";
import {
  DEFAULT_MONSTER_COUNT_LIMIT,
  DEFAULT_MONSTER_TYPE,
  ELITE_MONSTER_COUNT_LIMIT,
  ELITE_MONSTER_TYPE,
  ZERO,
} from "../../configs";
import CountCard from "../CountCard";
import type { CountCardProps } from "../CountCard/type";
import type { MonsterCountSummaryProps } from "./type";
import React from "react";
import { useWatch } from "antd/es/form/Form";

// #region 类型定义
type CountCardRenderProps = {
  cell: CountCardProps["cell"];
  count: number;
  inCurrentWorldNames: string[];
  limit: number;
  targetName: string;
  title: string;
};
// #endregion

// #region 布局常量、工具函数与组件
const { useBreakpoint } = Grid,
  SPAN_FULL = 24,
  SPAN_EIGHTH = 8,
  GUTTER_MAIN = 16,
  renderCountCard = (props: CountCardRenderProps): React.ReactNode => (
    <CountCard
      cell={props.cell}
      count={props.count}
      inCurrentWorldNames={props.inCurrentWorldNames}
      limit={props.limit}
      targetName={props.targetName}
      title={props.title}
    />
  ),
  /**
   * 怪物数量统计摘要
   * @param props 组件属性
   * @returns 统计摘要控件
   */
  MonsterCountSummary: React.FC<MonsterCountSummaryProps> = (props) => {
    // #region 解构属性、计算与断点判断
    const { defaultMonsterCount, eliteMonsterCount, form, monsters } = props,
      inCurrentWorldDefaultNames = [
        ...new Set(
          monsters
            .filter(
              (monster) =>
                monster.type === DEFAULT_MONSTER_TYPE &&
                monster.isInCurrentWorld,
            )
            .map((monster) => monster.name),
        ),
      ],
      inCurrentWorldEliteNames = [
        ...new Set(
          monsters
            .filter(
              (monster) =>
                monster.type === ELITE_MONSTER_TYPE &&
                monster.isInCurrentWorld,
            )
            .map((monster) => monster.name),
        ),
      ],
      monsterCount = Number(useWatch("count", form) || ZERO),
      monsterName = useWatch("name", form) ?? "",
      monsterType = useWatch("type", form),
      screens = useBreakpoint(),
      isMobile = !screens.md,
      eliteCard = renderCountCard({
        cell: monsterType === ELITE_MONSTER_TYPE && monsterCount,
        count: eliteMonsterCount,
        inCurrentWorldNames: inCurrentWorldEliteNames,
        limit: ELITE_MONSTER_COUNT_LIMIT,
        targetName: monsterName,
        title: ELITE_MONSTER_TYPE,
      }),
      defaultCard = renderCountCard({
        cell: monsterType === DEFAULT_MONSTER_TYPE && monsterCount,
        count: defaultMonsterCount,
        inCurrentWorldNames: inCurrentWorldDefaultNames,
        limit: DEFAULT_MONSTER_COUNT_LIMIT,
        targetName: monsterName,
        title: DEFAULT_MONSTER_TYPE,
      });
    // #endregion

    // #region 移动端布局：上下两行
    if (isMobile) {
      return (
        <Row data-testid="count-summary-row">
          <Col span={SPAN_FULL}>{eliteCard}</Col>
          <Col span={SPAN_FULL}>{defaultCard}</Col>
        </Row>
      );
    }
    // #endregion

    // #region PC 端布局：左右两列
    return (
      <Row data-testid="count-summary-row" gutter={GUTTER_MAIN}>
        <Col span={SPAN_EIGHTH}>{eliteCard}</Col>
        <Col span={SPAN_EIGHTH}>{defaultCard}</Col>
      </Row>
    );
    // #endregion
  };
// #endregion

export default MonsterCountSummary;
