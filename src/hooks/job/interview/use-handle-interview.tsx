import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../../helpers/context/AuthContext";

const useHandleInterview = () => {
  const { user } = useAuthContext();
  const BASE_URL = import.meta.env.VITE_APP_API_URL;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null); // ✅ new state

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
      alert(JSON.stringify(data));
      if (response.status === 200 || response.status === 201) {
        setMessage("Response sent successfully");
      } else {
        setError("Unexpected response received.");
      }
      console.log(response);
    } catch (err: any) {
      const errorMsg = "Request failed";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { handleInterview, loading, error, message };
};

export default useHandleInterview;
