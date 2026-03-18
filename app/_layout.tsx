import "react-native-reanimated";

export default function RootLayout() {
  // We keep expo-router as the entry, but run React Navigation ourselves from `src/`.
  // The file-based routes under `app/` are no longer used.
  const { AppRoot } = require("@/src/AppRoot");
  return <AppRoot />;
}
