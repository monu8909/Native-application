import React from "react";
import { Pressable, Text, type PressableProps, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type Props = PressableProps & {
  title: string;
  loading?: boolean;
  variant?: "primary" | "ghost";
};

export function Button({ title, loading, disabled, variant = "primary", className = "", ...props }: Props & { className?: string }) {
  const isDisabled = disabled || loading;
  
  const content = (
    <>
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text className="text-white font-semibold">
          {title}
        </Text>
      )}
    </>
  );

  if (variant === "primary") {
    return (
      <Pressable
        disabled={isDisabled}
        {...props}
        className={[
          "rounded-xl overflow-hidden",
          isDisabled ? "opacity-60" : "active:opacity-90",
          className,
        ].join(" ")}
      >
        <LinearGradient
          colors={["#4F9CFF", "#9D5BFF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ height: 48, alignItems: "center", justifyContent: "center", paddingHorizontal: 16 }}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      disabled={isDisabled}
      {...props}
      className={[
        "h-12 items-center justify-center rounded-xl px-4",
        "bg-transparent border border-white/10",
        isDisabled ? "opacity-60" : "active:opacity-90",
        className,
      ].join(" ")}
    >
      {content}
    </Pressable>
  );
}

