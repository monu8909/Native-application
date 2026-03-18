import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";

type Props = TextInputProps & {
  label?: string;
  error?: string;
};

export function Input({ label, error, className = "", ...props }: Props & { className?: string }) {
  return (
    <View className="gap-2">
      {label ? <Text className="text-white/80 text-sm">{label}</Text> : null}
      <TextInput
        placeholderTextColor="rgba(255,255,255,0.45)"
        {...props}
        className={[
          "h-12 rounded-2xl border border-white/10 bg-white/10 px-4 text-white",
          error ? "border-rose-400/60" : "",
          className,
        ].join(" ")}
      />
      {error ? <Text className="text-rose-300 text-xs">{error}</Text> : null}
    </View>
  );
}

