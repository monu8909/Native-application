import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { Card } from "../ui/Card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: keyof typeof Feather.glyphMap;
  color: string;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon, color, trend, trendUp }: StatCardProps) {
  return (
    <Card className="flex-1 p-4 min-w-[45%] mb-4">
      <View className="flex-row justify-between items-start mb-2">
        <View className={`p-2 rounded-xl bg-${color}/10`}>
          <Feather name={icon} size={20} color={color} />
        </View>
        {trend && (
          <Text className={`text-[10px] font-bold ${trendUp ? 'text-green-400' : 'text-red-400'}`}>
            {trend}
          </Text>
        )}
      </View>
      <Text className="text-white/60 text-xs font-medium">{title}</Text>
      <Text className="text-white text-xl font-bold mt-1 tracking-tight">{value}</Text>
    </Card>
  );
}
