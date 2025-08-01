import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuthToken } from "../../hooks/auth/use-auth-token";
import {
  LoginResponse,
  LogoutResponse,
  User,
} from "../../interfaces/User/auth";
import axios from "axios";

type AuthContextType = {
  user: User | null;
  token: string | null;
  error: string | null;
  loading: boolean;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  setToken: React.Dispatch<React.SetStateAction<string | null>>;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  initialize: () => Promise<void>; // ✅ ADD THIS LINE
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const CURRENT_USER_URL =
  import.meta.env.VITE_APP_API_URL + "user/current-user-mobile";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { getToken, setToken: saveToken } = useAuthToken();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const initialize = async () => {
    setLoading(true);
    setError(null);
    try {
      const RAW_TOKEN = await getToken();
      console.log("[INIT] Got raw token:", RAW_TOKEN);

      if (RAW_TOKEN) {
        const response = await axios.post<LoginResponse>(
          CURRENT_USER_URL,
          {},
          {
            headers: {
              Authorization: `Bearer ${RAW_TOKEN}`,
            },
          }
        );
        setUser(response.data.user);
        setToken(response.data.token);
        await saveToken(response.data.token);
      } else {
        console.log("[INIT] No token found");
      }
    } catch (err: any) {
      setError("Failed to load user");
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false); // 🔥 critical: make sure this always runs
    }
  };

  useEffect(() => {
    initialize();
  }, [getToken, saveToken]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        error,
        loading,
        initialize,
        // SETTERS
        setUser,
        setToken,
        setError,
        setLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
