import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { Image, ScrollView, Switch, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { StatCard } from "../../components/worker/StatCard";
import { EarningsSummary } from "../../components/worker/EarningsSummary";

const MOCK_STATS = [
  { title: "Total Earning", value: "₹32,500", icon: "dollar-sign" as const, color: "#4F9CFF", trend: "+18%", trendUp: true },
  { title: "Total Present", value: "22 Days", icon: "user-check" as const, color: "#22C55E", trend: "Month", trendUp: true },
  { title: "Total Leave", value: "2 Days", icon: "user-x" as const, color: "#EF4444", trend: "Month", trendUp: false },
];

// Removed mock job data as they are no longer used

export function WorkerDashboardScreen({ navigation }: any) {
  const [isOnline, setIsOnline] = useState(true);

  return (
    <SafeAreaView className="flex-1 bg-[#050B14]" edges={["top"]}>
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} className="flex-1">
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Header Section */}
          <View className="flex-row items-center justify-between px-6 py-6 mb-2">
            <View className="flex-row items-center">
              <View className="w-14 h-14 rounded-full border-2 border-[#5B6BF9] p-1">
                <Image 
                  source={{ uri: "https://i.pravatar.cc/150?u=worker1" }}
                  className="w-full h-full rounded-full"
                />
              </View>
              <View className="ml-4">
                <Text className="text-white/50 text-xs font-medium">Have a great day!</Text>
                <Text className="text-white text-xl font-bold">Good Morning, John</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-4">
              <Pressable 
                onPress={() => navigation.navigate("Notifications")}
                className="bg-white/5 p-2 rounded-xl relative"
              >
                <Feather name="bell" size={20} color="#FFF" />
                <View className="absolute top-2 right-2 w-2 h-2 bg-[#5B6BF9] rounded-full border border-[#050B14]" />
              </Pressable>
            </View>
          </View>

          {/* Availability Toggle Section */}
          <View className="mx-6 mb-8 px-5 py-3 bg-[#1A1A2E]/60 border border-white/5 rounded-2xl flex-row items-center justify-between">
            <View className="flex-row items-center">
              <View className={`w-3 h-3 rounded-full mr-3 ${isOnline ? 'bg-green-400' : 'bg-red-400'}`} />
              <Text className="text-white font-semibold">{isOnline ? 'You are Online' : 'You are Offline'}</Text>
            </View>
            <Switch 
              value={isOnline} 
              onValueChange={setIsOnline}
              trackColor={{ false: "#3E3E3E", true: "#5B6BF9" }}
              thumbColor={isOnline ? "#FFF" : "#F4F3F4"}
            />
          </View>

          {/* Overview Section */}
          <View className="px-6 mb-8">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-lg font-bold">Monthly Overview</Text>
            </View>
            <View className="flex-row flex-wrap justify-between">
              {MOCK_STATS.map((stat, i) => (
                <StatCard key={i} {...stat} />
              ))}
            </View>
          </View>

          {/* Earnings Summary Section */}
          <View className="px-6 mb-8">
            <EarningsSummary daily="₹1,250" weekly="₹8,400" monthly="₹32,500" />
          </View>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

