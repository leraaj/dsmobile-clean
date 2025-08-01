import { useEffect, useState } from "react";
import axios from "axios";
import { Job } from "../../interfaces/Job/Job";
import { useAuthContext } from "../../helpers/context/AuthContext";
import {
  Notification,
  NotificationResponse,
  Notifications,
} from "../../interfaces/Notification/notification";

const NOTIFICATIONS_URL = import.meta.env.VITE_APP_API_URL + "notifications/";

const useFetchNotifications = () => {
  const { user } = useAuthContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<NotificationResponse>(
        NOTIFICATIONS_URL + user?._id
      );
      const { applications = [], appointments = [] } = response.data;

      // Merge the arrays
      const combined = [...applications, ...appointments];

      setNotifications(combined);
    } catch (err: any) {
      setError(err?.message || "Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!user?._id) return;

    fetchJobs();
  }, []);

  return { notifications, refresh: fetchJobs, loading, error };
};

export default useFetchNotifications;
