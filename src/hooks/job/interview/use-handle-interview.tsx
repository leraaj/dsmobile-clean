import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../../helpers/context/AuthContext";
import { useToast } from "../../../helpers/context/ToastContext";
import { useHistory } from "react-router";

const useHandleInterview = () => {
  const { user } = useAuthContext();
  const BASE_URL = import.meta.env.VITE_APP_API_URL;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // ✅ new state
  const { showToast } = useToast();
  const history = useHistory();
  const handleInterview = async (data: object, appointmentId: string) => {
    if (!user?._id) {
      setError("User not authenticated");
      return;
    }

    if (!appointmentId) {
      setError("Appointment ID is required");
      return;
    }

    try {
      const response = await axios.put(
        `${BASE_URL}/appointment/${appointmentId}`,
        data
      );
      if (response) {
        showToast("Response handled successfully", "success");
        history.push("/tabs/notification");
      } else {
        showToast("Unexpected response received.", "danger");
      }
      console.log(response);
    } catch (err: any) {
      const errorMsg = "Request failed";
      showToast(errorMsg, "danger");
    } finally {
      setLoading(false);
    }
  };

  return { handleInterview, loading, error, message };
};

export default useHandleInterview;
