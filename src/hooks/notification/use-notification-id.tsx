import { Notification } from "../../interfaces/Notification/notification";
import useFetchNotifications from "./use-notification";

const useNotificationById = (
  id: string
): {
  notification: Notification | undefined;
  loading: boolean;
  error: string | null;
} => {
  const { notifications, loading, error } = useFetchNotifications();
  const notification = notifications?.find((notif) => notif._id === id?.trim());

  return { notification, loading, error };
};

export default useNotificationById;
