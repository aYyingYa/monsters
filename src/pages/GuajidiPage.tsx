import type { AccountFormValues, AccountRecord } from "../types/App";
import {
  DELETE_SUCCESS_MESSAGE,
  EDIT_SUCCESS_MESSAGE,
  GUAJIDI_ADD_BUTTON_TEXT,
  GUAJIDI_ADD_SUCCESS_MESSAGE,
  GUAJIDI_DUPLICATE_UID_MESSAGE,
  GUAJIDI_EMPTY_DESCRIPTION,
  GUAJIDI_PAGE_TITLE,
  ZERO,
} from "../configs";
import { Button, Empty, Spin, Typography } from "antd";
import AccountCard from "../components/AccountCard";
import AccountEditModal from "../components/AccountEditModal";
import { PlusOutlined } from "@ant-design/icons";
import React, { useState } from "react";
import useAccountStorage from "../hooks/useAccountStorage";
import styles from "./GuajidiPage.module.less";
import useSafeMessage from "../hooks/useSafeMessage";
import { v4 as uuidv4 } from "uuid";

// #region 呱唧地页面组件
/**
 * 呱唧地页面（账号卡片增删改查）
 * @returns 呱唧地页面组件
 */
const GuajidiPage: React.FC = () => {
  // #region 状态与数据处理
  const
    message = useSafeMessage(),
    { accounts, addAccount, loading, removeAccount, updateAccount } = useAccountStorage(),
    [modalOpen, setModalOpen] = useState(false),
    [editingAccount, setEditingAccount] = useState<AccountRecord | null>(null),
    /** 打开新增弹窗 */
    handleOpenAdd = (): void => {
      setEditingAccount(null);
      setModalOpen(true);
    },
    /** 打开编辑弹窗 */
    handleOpenEdit = (account: AccountRecord): void => {
      setEditingAccount(account);
      setModalOpen(true);
    },
    /** 关闭弹窗 */
    handleCloseModal = (): void => {
      setModalOpen(false);
      setEditingAccount(null);
    },
    /** 判断uid是否已被其他记录占用 */
    isUidDuplicate = (uid: string): boolean =>
      accounts.some((item) => item.uid === uid && item.id !== editingAccount?.id),
    /** 新增账号 */
    handleCreate = async (values: AccountFormValues): Promise<void> => {
      const newAccount: AccountRecord = { ...values, id: uuidv4() };
      await addAccount(newAccount);
      message.success(GUAJIDI_ADD_SUCCESS_MESSAGE);
      handleCloseModal();
    },
    /** 更新账号 */
    handleUpdate = async (values: AccountFormValues): Promise<void> => {
      if (editingAccount) {
        await updateAccount({ ...editingAccount, ...values });
        message.success(EDIT_SUCCESS_MESSAGE);
      }
      handleCloseModal();
    },
    /** 提交表单（新增或更新），拦截重复uid */
    handleSubmit = (values: AccountFormValues): Promise<void> => {
      if (isUidDuplicate(values.uid)) {
        message.warning(GUAJIDI_DUPLICATE_UID_MESSAGE);
        return Promise.resolve();
      }
      if (editingAccount) {
        return handleUpdate(values);
      }
      return handleCreate(values);
    },
    /** 删除账号 */
    handleDelete = async (id: string): Promise<void> => {
      await removeAccount(id);
      message.success(DELETE_SUCCESS_MESSAGE);
    },
    /** 渲染内容区（加载中 / 空列表 / 卡片网格） */
    renderContent = (): React.ReactNode => {
      if (loading) {
        return (
          <div className={styles.loadingWrap}>
            <Spin />
          </div>
        );
      }
      if (accounts.length === ZERO) {
        return <Empty description={GUAJIDI_EMPTY_DESCRIPTION} />;
      }
      return (
        <div className={styles.cardGrid}>
          {accounts.map((account) => (
            <AccountCard
              account={account}
              key={account.id}
              onDelete={() => {
                handleDelete(account.id).catch((): void => {
                  // 删除失败时保持现状，由用户重试
                });
              }}
              onEdit={handleOpenEdit}
            />
          ))}
        </div>
      );
    };
  // #endregion

  // #region 渲染
  return (
    <div className={styles.guajidi}>
      <div className={styles.header}>
        <Typography.Title
          className={styles.title}
          level={3}
        >
          {GUAJIDI_PAGE_TITLE}
        </Typography.Title>
        <Button
          icon={<PlusOutlined />}
          onClick={handleOpenAdd}
          type="primary"
        >
          {GUAJIDI_ADD_BUTTON_TEXT}
        </Button>
      </div>
      {renderContent()}
      <AccountEditModal
        initialValues={editingAccount}
        onCancel={handleCloseModal}
        onOk={handleSubmit}
        open={modalOpen}
      />
    </div>
  );
  // #endregion
};
// #endregion

export default GuajidiPage;
