import AsyncStorage from "@react-native-async-storage/async-storage";

const TOKEN_KEY = "auth_token";

export type TokenPayload = {
  id: number;
  email: string;
  rol: string;
  iat?: number;
  exp?: number;
};

export const guardarToken = async (token: string): Promise<void> => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const obtenerToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const eliminarToken = async (): Promise<void> => {
  await AsyncStorage.removeItem(TOKEN_KEY);
};

export const decodificarToken = (token: string): TokenPayload | null => {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
};
