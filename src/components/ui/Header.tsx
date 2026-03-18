import React from "react";
import { Text, View } from "react-native";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View className="gap-1">
      <Text className="text-white text-2xl font-semibold">{title}</Text>
      {subtitle ? <Text className="text-white/70">{subtitle}</Text> : null}
    </View>
  );
}

