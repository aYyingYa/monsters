import { Divider, Form } from "antd";
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
    countHistory,
    defaultMonsterCount,
    editMonster,
    editModalOpen,
    elapsedMs,
    eliteMonsterCount,
    filteredInfo,
    form,
    mode,
    monsters,
    nameHistory,
    sortInfo,
    onCancelEdit,
    onCancelRecord,
    onConfirmRecord,
    onDeleteMonster,
    onEditMonster,
    onPauseTimer,
    onResumeTimer,
    onSelectDate,
    onStartTimer,
    onSubmitEdit,
    onTableChange,
  } = useMonsterPage();
  // #endregion

  // #region 渲染
  return (
    <div className={styles.home}>
      <MonsterCountSummary
        defaultMonsterCount={defaultMonsterCount}
        eliteMonsterCount={eliteMonsterCount}
        form={form}
        monsters={monsters}
      />
      <Form form={form} layout="vertical">
        <FormItems
          countHistory={countHistory}
          elapsedMs={elapsedMs}
          mode={mode}
          nameHistory={nameHistory}
          onCancelRecord={onCancelRecord}
          onConfirmRecord={onConfirmRecord}
          onPauseTimer={onPauseTimer}
          onResumeTimer={onResumeTimer}
          onStartTimer={onStartTimer}
        />
      </Form>
      <Divider />
      <DateFileSelect
        activeDate={activeDate}
        availableDates={availableDates}
        onSelect={onSelectDate}
      />
      <MonsterTable
        filteredInfo={filteredInfo}
        monsters={monsters}
        onDelete={onDeleteMonster}
        onEdit={onEditMonster}
        onTableChange={onTableChange}
        sortInfo={sortInfo}
      />
      <MonsterEditModal
        countHistory={countHistory}
        initialValues={editMonster}
        nameHistory={nameHistory}
        onCancel={onCancelEdit}
        onOk={onSubmitEdit}
        open={editModalOpen}
      />
    </div>
  );
  // #endregion
};
// #endregion

export default App;
