import AsyncStorage from "@react-native-async-storage/async-storage";

const SESSION_KEY = "@session";
const LAST_SESSION_KEY = "@lastSession";

export async function saveSession(session) {
  await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(session));
  await AsyncStorage.setItem(LAST_SESSION_KEY, JSON.stringify(session));
}

export async function getSession() {
  let stored = await AsyncStorage.getItem(SESSION_KEY);
  if (!stored) stored = await AsyncStorage.getItem(LAST_SESSION_KEY);
  return stored ? JSON.parse(stored) : null;
}

export async function clearSession() {
  await AsyncStorage.removeItem(SESSION_KEY);
}

export async function saveLastSession(session) {
  await AsyncStorage.setItem(LAST_SESSION_KEY, JSON.stringify(session));
}
