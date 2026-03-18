import React from "react";
import { Text, View } from "react-native";

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <View className="items-center justify-center py-10">
      <Text className="text-white font-semibold text-lg">{title}</Text>
      {description ? <Text className="text-white/70 mt-2 text-center">{description}</Text> : null}
    </View>
  );
}

