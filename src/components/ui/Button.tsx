import React from "react";
import { Pressable, Text, type PressableProps, ActivityIndicator } from "react-native";

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: "primary" | "ghost";
};

export function Button({ title, loading, disabled, variant = "primary", className = "", ...props }: Props & { className?: string }) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      disabled={isDisabled}
      {...props}
      className={[
        "h-12 items-center justify-center rounded-2xl px-4",
        variant === "primary"
          ? "bg-[#0EA5E9] shadow-black/20 shadow-md"
          : "bg-transparent border border-white/15",
        isDisabled ? "opacity-60" : "active:opacity-90",
        className,
      ].join(" ")}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className={variant === "primary" ? "text-white font-semibold" : "text-white font-semibold"}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

