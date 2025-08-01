import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../../helpers/context/AuthContext";
import { useToast } from "../../../helpers/context/ToastContext";
import useFetchJobs from "../use-job";
import { useHistory } from "react-router";

const SEND_APPLICATION_URL = import.meta.env.VITE_APP_API_URL + "application";

const useSendApplication = (jobId?: string) => {
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showToast } = useToast();
  const sendApplication = async () => {
    if (!user?._id || !jobId) {
      const errMsg = "Missing user ID or job ID";
      setError(errMsg);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await axios.post(SEND_APPLICATION_URL, {
        jobId,
        userId: user._id,
      });
      if (res.status == 201) {
        showToast("Application sent successfully", "success");
      } else {
        showToast(JSON.stringify(res), "danger");
      }
      return res.data;
    } catch (err: any) {
      const message = err?.response?.data?.message || "An error occurred";
      console.error("Error sending application:", err);
      showToast(err, "danger");
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendApplication, isLoading, error };
};

export default useSendApplication;
