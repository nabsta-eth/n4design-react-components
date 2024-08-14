import { IconName, IconPrefix, dom } from "@fortawesome/fontawesome-svg-core";
import UIkit from "uikit";
type UiKitStatus = "success" | "warning" | "danger";
type HandleStatus = "success" | "pending" | "info" | "error";

export type TransactionNotificationStatus =
  | "awaitingApproval"
  | "pending"
  | "success"
  | "error";

export type TransactionNotification = Record<
  TransactionNotificationStatus,
  string
>;

dom.watch();

export type Notify = {
  status: HandleStatus;
  message: string;
  timeoutInSeconds?: number;
  showProgressBar?: boolean;
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  icon?: {
    prefix: IconPrefix;
    name: IconName;
  };
};

export type Notification = {
  close: () => void;
};

const MAP_TO_UI_KIT_STATUS: { [key in HandleStatus]: UiKitStatus } = {
  success: "success",
  pending: "warning",
  info: "warning",
  error: "danger",
};

const MAP_TO_ICON: { [key in HandleStatus]: string } = {
  success: "fa-check-circle",
  info: "fa-exclamation-triangle",
  pending: "fa-clock",
  error: "fa-ban",
};

const DEFAULT_INFO_NOTIFICATION_TIMEOUT: number = 20;
const DEFAULT_PENDING_NOTIFICATION_TIMEOUT: number = 0;
const DEFAULT_ERROR_NOTIFICATION_TIMEOUT: number = 10;
const DEFAULT_SUCCESS_NOTIFICATION_TIMEOUT: number = 10;
const MAP_TO_TIMEOUT_IN_SECONDS: { [key in HandleStatus]: number } = {
  success: DEFAULT_SUCCESS_NOTIFICATION_TIMEOUT,
  info: DEFAULT_INFO_NOTIFICATION_TIMEOUT,
  pending: DEFAULT_PENDING_NOTIFICATION_TIMEOUT,
  error: DEFAULT_ERROR_NOTIFICATION_TIMEOUT,
};

export const showNotification = ({
  status,
  message,
  timeoutInSeconds,
  showProgressBar = true,
  position = "bottom-right",
  icon,
}: Notify): Notification => {
  const timeoutInSecondsToUse =
    timeoutInSeconds !== undefined && timeoutInSeconds >= 0
      ? timeoutInSeconds
      : MAP_TO_TIMEOUT_IN_SECONDS[status];
  const progressBar =
    showProgressBar && timeoutInSecondsToUse > 0
      ? `<span role="progressbar" aria-hidden="false" aria-label="notification timer" class="uk-notification-progress-bar" style="animation-duration: ${timeoutInSecondsToUse}s" ></span>`
      : "";
  const iconPrefixToUse = icon ? icon.prefix : "fas";
  const iconNameToUse = icon ? `fa-${icon.name}` : MAP_TO_ICON[status];
  const messageWithIcon = `<i class="${iconPrefixToUse} ${iconNameToUse}"></i> ${message} ${progressBar}`;
  return UIkit.notification({
    status: MAP_TO_UI_KIT_STATUS[status],
    message: messageWithIcon,
    timeout: timeoutInSecondsToUse * 1000,
    pos: position,
  });
};

export const showTransactionNotification = (
  status: TransactionNotificationStatus,
  notification: TransactionNotification,
  timeoutInSeconds?: number,
) =>
  showNotification({
    status: transactionNotificationStatusToHandleStatus(status),
    message: notification[status],
    timeoutInSeconds,
  });

const transactionNotificationStatusToHandleStatus = (
  status: TransactionNotificationStatus,
): HandleStatus => {
  switch (status) {
    case "awaitingApproval":
    case "pending":
      return "pending";
    case "success":
      return "success";
    case "error":
      return "error";
    default:
      throw new Error(`No HandleStatus notification mapping for "${status}"`);
  }
};

export const closeAllNotifications = () => UIkit.notification.closeAll();
