import Constants from "expo-constants";

// Dynamically get the host IP from Expo manifest to support physical devices/emulators
const debuggerHost = Constants.expoConfig?.hostUri;
const localIp = debuggerHost?.split(":")[0] || "localhost";

export const env = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL ?? `http://${localIp}:4000`,
};

