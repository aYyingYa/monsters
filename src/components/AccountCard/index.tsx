import type { AccountCardProps } from "./type";
import { CopyOutlined } from "@ant-design/icons";
import {
  ACCOUNT_CARD_ACCOUNT_TOOLTIP,
  ACCOUNT_CARD_COPY_ACCOUNT_FAILURE_MESSAGE,
  ACCOUNT_CARD_COPY_ACCOUNT_SUCCESS_MESSAGE,
  ACCOUNT_CARD_COPY_BUTTON_TOOLTIP,
  ACCOUNT_CARD_COPY_CREDENTIAL_FAILURE_MESSAGE,
  ACCOUNT_CARD_COPY_CREDENTIAL_SUCCESS_MESSAGE,
  ACCOUNT_CARD_COPY_UID_FAILURE_MESSAGE,
  ACCOUNT_CARD_COPY_UID_SUCCESS_MESSAGE,
  ACCOUNT_CARD_UID_TOOLTIP,
  ZERO,
} from "../../configs";
import { Button, Card, Tooltip, Typography } from "antd";
import ContextMenu from "../ContextMenu";
import React, { useState } from "react";
import { copyText } from "../../utils/clipboard";
import { maskAccount } from "../../utils/mask";
import styles from "./index.module.less";
import useSafeMessage from "../../hooks/useSafeMessage";

// #region 类型定义
/**
 * 右键菜单定位状态
 */
interface MenuState {
  /**
   * 菜单横坐标（像素）
   */
  clientX: number;
  /**
   * 菜单纵坐标（像素）
   */
  clientY: number;
}
// #endregion

// #region 账号卡片组件
/**
 * 呱唧地账号卡片（右键唤出编辑/删除菜单）
 * @param props 组件属性
 * @returns 账号卡片控件
 */
const AccountCard: React.FC<AccountCardProps> = (props) => {
  const
    { account, onDelete, onEdit } = props,
    message = useSafeMessage(),
    [menuState, setMenuState] = useState<MenuState | null>(null),
    /** 点击uid：仅复制uid */
    handleCopyUid = async (): Promise<void> => {
      const isCopied = await copyText(account.uid);
      if (isCopied) {
        message.success(ACCOUNT_CARD_COPY_UID_SUCCESS_MESSAGE);
      } else {
        message.error(ACCOUNT_CARD_COPY_UID_FAILURE_MESSAGE);
      }
    },
    /** 点击复制按钮：复制uid + 账号名 */
    handleCopyAccount = async (): Promise<void> => {
      const isCopied = await copyText(`${account.uid} ${account.accountName}`);
      if (isCopied) {
        message.success(ACCOUNT_CARD_COPY_ACCOUNT_SUCCESS_MESSAGE);
      } else {
        message.error(ACCOUNT_CARD_COPY_ACCOUNT_FAILURE_MESSAGE);
      }
    },
    /** 点击脱敏账号：复制账号 + 密码 */
    handleCopyCredential = async (): Promise<void> => {
      const isCopied = await copyText(`${account.account} ${account.password}`);
      if (isCopied) {
        message.success(ACCOUNT_CARD_COPY_CREDENTIAL_SUCCESS_MESSAGE);
      } else {
        message.error(ACCOUNT_CARD_COPY_CREDENTIAL_FAILURE_MESSAGE);
      }
    },
    /** 卡片右键：唤出编辑/删除菜单 */
    handleContextMenu = (event: React.MouseEvent): void => {
      event.preventDefault();
      setMenuState({ clientX: event.clientX, clientY: event.clientY });
    },
    /** 关闭右键菜单 */
    closeMenu = (): void => {
      setMenuState(null);
    },
    /** 菜单编辑：打开编辑弹窗 */
    handleMenuEdit = (): void => {
      onEdit(account);
      closeMenu();
    },
    /** 菜单删除确认 */
    handleMenuDelete = (): void => {
      onDelete();
      closeMenu();
    };

  // #region 渲染
  let infoExtraNode: React.ReactNode = null;
  if (account.extraInfo?.trim()) {
    infoExtraNode = (
      <div className={styles.infoExtra}>
        <Typography.Paragraph
          className={styles.extraText}
          ellipsis={{ rows: 2, tooltip: account.extraInfo }}
        >
          {account.extraInfo}
        </Typography.Paragraph>
      </div>
    );
  }
  return (
    <div onContextMenu={handleContextMenu}>
      <Card
        className={styles.accountCard}
        size="small"
      >
        <div className={styles.uidRow}>
          <Tooltip title={ACCOUNT_CARD_UID_TOOLTIP}>
            <Typography.Text
              className={styles.uidText}
              onClick={handleCopyUid}
            >
              {account.uid}
            </Typography.Text>
          </Tooltip>
          <Tooltip title={ACCOUNT_CARD_COPY_BUTTON_TOOLTIP}>
            <Button
              aria-label={ACCOUNT_CARD_COPY_BUTTON_TOOLTIP}
              icon={<CopyOutlined />}
              onClick={handleCopyAccount}
              shape="circle"
              size="small"
              type="text"
            />
          </Tooltip>
        </div>
        <div className={styles.infoGrid}>
          <div className={styles.infoMain}>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>账号名</span>
              <span className={styles.fieldValue}>{account.accountName}</span>
            </div>
            <div className={styles.fieldRow}>
              <span className={styles.fieldLabel}>账号</span>
              <Tooltip title={ACCOUNT_CARD_ACCOUNT_TOOLTIP}>
                <Typography.Text
                  className={styles.accountText}
                  onClick={handleCopyCredential}
                >
                  {maskAccount(account.account)}
                </Typography.Text>
              </Tooltip>
            </div>
          </div>
          {infoExtraNode}
        </div>
      </Card>
      <ContextMenu
        left={menuState?.clientX ?? ZERO}
        onClose={closeMenu}
        onDelete={handleMenuDelete}
        onEdit={handleMenuEdit}
        open={menuState !== null}
        top={menuState?.clientY ?? ZERO}
      />
    </div>
  );
  // #endregion
};
// #endregion

export default AccountCard;
