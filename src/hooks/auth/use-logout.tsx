import { useAuthContext } from "../../helpers/context/AuthContext";
import { useAuthToken } from "../../hooks/auth/use-auth-token";
import axios from "axios";
import { LogoutResponse } from "../../interfaces/User/auth";
import { useToast } from "../../helpers/context/ToastContext";

const LOGOUT_URL = import.meta.env.VITE_APP_API_URL + "user/logout/";

export const useLogout = () => {
  const { user, setUser, setToken, setError, setLoading } = useAuthContext();
  const { deleteToken } = useAuthToken();
  const { showToast } = useToast();
  const logout = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      if (user?._id) {
        await axios.post<LogoutResponse>(`${LOGOUT_URL}${user._id}`);
      }
      await deleteToken();
      showToast("Logout Successfully", "danger");
      setUser(null);
      setToken(null);
    } catch (err: any) {
      setError(err.message || "Logout failed");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { logout };
};
