import React from "react";
import { View, type ViewProps } from "react-native";

export function Card({ className = "", ...props }: ViewProps & { className?: string }) {
  return (
    <View
      {...props}
      className={[
        "rounded-2xl border border-white/10 bg-white/10 dark:bg-black/20 shadow-black/10 shadow-sm",
        className,
      ].join(" ")}
    />
  );
}

