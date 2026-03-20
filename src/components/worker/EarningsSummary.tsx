import React from "react";
import { Text, View } from "react-native";
import { Card } from "../ui/Card";

interface EarningsSummaryProps {
  daily: string;
  weekly: string;
  monthly: string;
}

export function EarningsSummary({ daily, weekly, monthly }: EarningsSummaryProps) {
  const data = [
    { label: "Today", value: daily, color: "#4F9CFF" },
    { label: "Weekly", value: weekly, color: "#9D5BFF" },
    { label: "Monthly", value: monthly, color: "#5B6BF9" },
  ];

  return (
    <Card className="p-6 mb-10">
      <Text className="text-white text-lg font-bold mb-4">Earnings Summary</Text>
      
      <View className="flex-row justify-between items-end h-24 mb-6 px-2">
        {data.map((item, index) => (
          <View key={index} className="items-center flex-1">
            <View 
              style={{ 
                height: index === 0 ? "40%" : index === 1 ? "70%" : "100%", 
                backgroundColor: item.color,
                width: 12,
                borderRadius: 6,
                opacity: 0.8
              }} 
            />
            <Text className="text-white/40 text-[10px] mt-2 uppercase tracking-tighter">
              {item.label}
            </Text>
            <Text className="text-white font-bold text-xs mt-0.5">{item.value}</Text>
          </View>
        ))}
      </View>

      <View className="border-t border-white/5 pt-4 flex-row justify-between items-center">
        <View>
          <Text className="text-white/40 text-[10px] uppercase font-bold tracking-widest">
            Total Balance
          </Text>
          <Text className="text-white text-2xl font-bold mt-1">₹4,250.00</Text>
        </View>
        <View className="bg-[#5B6BF9] px-4 py-2 rounded-xl">
          <Text className="text-white font-bold text-xs">Withdraw</Text>
        </View>
      </View>
    </Card>
  );
}
