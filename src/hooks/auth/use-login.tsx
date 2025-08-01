import { useAuthContext } from "../../helpers/context/AuthContext";
import { useAuthToken } from "../../hooks/auth/use-auth-token";
import axios from "axios";
import { LoginResponse } from "../../interfaces/User/auth";
import { useToast } from "../../helpers/context/ToastContext";

const LOGIN_URL = import.meta.env.VITE_APP_API_URL + "user/login";

export const useLogin = () => {
  const { setUser, setToken, setError, setLoading } = useAuthContext();
  const { setToken: saveToken } = useAuthToken();
  const { showToast } = useToast();
  const login = async (
    username: string,
    password: string
  ): Promise<LoginResponse | undefined> => {
    setLoading(true);
    setError(null);
    const trimmedUsername = username.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedPassword) {
      showToast("All fields are required", "warning");
      setLoading(false);
      return undefined;
    }
    const data = {
      username: username,
      password: password,
    };

    try {
      const response = await axios.post<LoginResponse>(LOGIN_URL, data);
      const { user, token } = response.data;
      if (user) {
        setUser(user);
        setToken(token);
        await saveToken(token);
        showToast("Login Successfully", "success");
        return response.data;
      } else {
        const errMsg = "Unauthorized user";
        setError(errMsg);
        throw new Error(errMsg);
      }
    } catch (err: any) {
      const msg = err?.response?.data?.message || err.message || "Login failed";
      setError(msg);
      showToast("Invalid username/password", "danger");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login };
};
