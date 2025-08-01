import { Preferences } from "@capacitor/preferences";

const TOKEN_KEY = import.meta.env.VITE_APP_TOKEN_KEY || "Auth_Token";

export const getToken = async () => {
  const { value } = await Preferences.get({
    key: TOKEN_KEY,
  });
  return value || null; // This is your token or cookie string
};

export const saveToken = async (token: string) => {
  await Preferences.set({
    key: TOKEN_KEY,
    value: token,
  });
};

export const removeToken = async () => {
  await Preferences.remove({ key: TOKEN_KEY });
};
