import "../global.css";
import "react-native-reanimated";
import { AppRoot } from "@/src/AppRoot";

export default function RootLayout() {
  // We keep expo-router as the entry, but run React Navigation ourselves from `src/`.
  // The file-based routes under `app/` are no longer used.
  return <AppRoot />;
}
