import { useCallback, useState } from "react";
import { CapacitorCookies } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

const TOKEN_KEY = import.meta.env.VITE_APP_TOKEN_KEY || "Auth_Token";

export const useAuthToken = () => {
  const [tokenLoading, setTokenLoading] = useState(false);

  const setToken = useCallback(async (token: string) => {
    await Preferences.set({
      key: TOKEN_KEY,
      value: token,
    });
  }, []);

  const getToken = useCallback(async () => {
    const { value } = await Preferences.get({
      key: TOKEN_KEY,
    });
    return value; // This is your token or cookie string
  }, []);

  const deleteToken = useCallback(async () => {
    await Preferences.remove({ key: TOKEN_KEY });
  }, []);
  const cookiedump = useCallback(async () => {
    const { cookies } = await CapacitorCookies.getCookies();
    return cookies;
  }, []);
  return {
    setToken,
    getToken,
    deleteToken,
    cookiedump,
    tokenLoading,
  };
};
