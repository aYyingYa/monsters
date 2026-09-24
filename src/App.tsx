import { App as AntdApp, Divider, Form } from "antd";
import { FormItems, MonsterCountSummary } from "./components";
import React from "react";
import styles from "./App.module.less";
import DateFileSelect from "./components/DateFileSelect";
import MonsterEditModal from "./components/MonsterEditModal";
import MonsterTable from "./components/MonsterTable";
import useMonsterPage from "./hooks/useMonsterPage";

// #region 应用主组件
/**
 * 应用主组件
 * @returns 页面根组件
 */
const App: React.FC = () => {
  // #region 获取页面数据
  const {
    activeDate,
    availableDates,
    defaultMonsterCount,
    editMonster,
    editModalOpen,
    elapsedMs,
    eliteMonsterCount,
    form,
    mode,
    monsters,
    nameMonsterMap,
    sortInfo,
    onCancelEdit,
    onCancelRecord,
    onConfirmRecord,
    onDeleteMonster,
    onEditMonster,
    onInsertNoTimeRecord,
    onPauseTimer,
    onRemoveCount,
    onRemoveRecord,
    onResumeTimer,
    onSelectDate,
    onStartTimer,
    onSubmitEdit,
    onTableChange,
    onUpdateCount,
    onUpdateRecord,
  } = useMonsterPage();
  // #endregion

  // #region 渲染
  return (
    <AntdApp style={{ height: "100%" }}>
      <div className={styles.home}>
        <MonsterCountSummary
          defaultMonsterCount={defaultMonsterCount}
          eliteMonsterCount={eliteMonsterCount}
          form={form}
          monsters={monsters}
        />
        <Form form={form} layout="vertical">
          <FormItems
            elapsedMs={elapsedMs}
            mode={mode}
            nameMonsterMap={nameMonsterMap}
            onCancelRecord={onCancelRecord}
            onConfirmRecord={onConfirmRecord}
            onInsertNoTimeRecord={onInsertNoTimeRecord}
            onPauseTimer={onPauseTimer}
            onRemoveCount={onRemoveCount}
            onRemoveRecord={onRemoveRecord}
            onResumeTimer={onResumeTimer}
            onStartTimer={onStartTimer}
            onUpdateCount={onUpdateCount}
            onUpdateRecord={onUpdateRecord}
          />
        </Form>
        <Divider size="middle" />
        <DateFileSelect
          activeDate={activeDate}
          availableDates={availableDates}
          onSelect={onSelectDate}
        />
        <MonsterTable
          monsters={monsters}
          onDelete={onDeleteMonster}
          onEdit={onEditMonster}
          onTableChange={onTableChange}
          sortInfo={sortInfo}
        />
        <MonsterEditModal
          initialValues={editMonster}
          nameMonsterMap={nameMonsterMap}
          onCancel={onCancelEdit}
          onOk={onSubmitEdit}
          onRemoveCount={onRemoveCount}
          onRemoveRecord={onRemoveRecord}
          onUpdateCount={onUpdateCount}
          onUpdateRecord={onUpdateRecord}
          open={editModalOpen}
        />
      </div>
    </AntdApp>
  );
  // #endregion
};
// #endregion

export default App;
