import { Col, Row } from "antd";
import {
  DEFAULT_MONSTER_COUNT_LIMIT,
  DEFAULT_MONSTER_TYPE,
  ELITE_MONSTER_COUNT_LIMIT,
  ELITE_MONSTER_TYPE,
  ZERO,
} from "../../configs";
import CountCard from "../CountCard";
import type { MonsterCountSummaryProps } from "./type";
import React from "react";
import { useWatch } from "antd/es/form/Form";

// #region 统计摘要
/**
 * 怪物数量统计摘要
 * @param props 组件属性
 * @returns 统计摘要控件
 */
const MonsterCountSummary: React.FC<MonsterCountSummaryProps> = (props) => {
  // #region 解构属性与计算
  const
    { defaultMonsterCount, eliteMonsterCount, form, monsters } = props,
    inCurrentWorldDefaultNames = [
      ...new Set(
        monsters
          .filter((monster) => monster.type === DEFAULT_MONSTER_TYPE && monster.isInCurrentWorld)
          .map((monster) => monster.name),
      ),
    ],
    inCurrentWorldEliteNames = [
      ...new Set(
        monsters
          .filter((monster) => monster.type === ELITE_MONSTER_TYPE && monster.isInCurrentWorld)
          .map((monster) => monster.name),
      ),
    ],
    monsterCount = Number(useWatch("count", form) || ZERO),
    monsterName = useWatch("name", form) ?? "",
    monsterType = useWatch("type", form);
  // #endregion

  // #region 渲染
  return (
    <Row gutter={16}>
      <Col span={8}>
        <CountCard
          cell={monsterType === ELITE_MONSTER_TYPE && monsterCount}
          count={eliteMonsterCount}
          inCurrentWorldNames={inCurrentWorldEliteNames}
          limit={ELITE_MONSTER_COUNT_LIMIT}
          targetName={monsterName}
          title={ELITE_MONSTER_TYPE}
        />
      </Col>
      <Col span={8}>
        <CountCard
          cell={monsterType === DEFAULT_MONSTER_TYPE && monsterCount}
          count={defaultMonsterCount}
          inCurrentWorldNames={inCurrentWorldDefaultNames}
          limit={DEFAULT_MONSTER_COUNT_LIMIT}
          targetName={monsterName}
          title={DEFAULT_MONSTER_TYPE}
        />
      </Col>
    </Row>
  );
  // #endregion
};
// #endregion

export default MonsterCountSummary;
