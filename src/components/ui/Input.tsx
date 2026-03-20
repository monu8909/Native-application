import React from "react";
import { Text, TextInput, View, type TextInputProps } from "react-native";
import { Feather } from "@expo/vector-icons";

type Props = TextInputProps & {
  label?: string;
  error?: string;
  leftIcon?: keyof typeof Feather.glyphMap;
};

export function Input({ label, error, leftIcon, className = "", ...props }: Props & { className?: string }) {
  return (
    <View className="gap-2">
      {label ? <Text className="text-white text-sm font-medium">{label}</Text> : null}
      <View className="relative justify-center">
        {leftIcon && (
          <View className="absolute left-4 z-10">
            <Feather name={leftIcon} size={18} color="rgba(255,255,255,0.45)" />
          </View>
        )}
        <TextInput
          placeholderTextColor="rgba(255,255,255,0.3)"
          {...props}
          className={[
            "h-12 rounded-xl border border-white/10 bg-[#1A1A2E] px-4 text-white",
            leftIcon ? "pl-11" : "",
            error ? "border-rose-400/60" : "",
            className,
          ].join(" ")}
        />
      </View>
      {error ? <Text className="text-rose-300 text-xs">{error}</Text> : null}
    </View>
  );
}

