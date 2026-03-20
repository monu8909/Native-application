import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";

const MOCK_NOTIFICATIONS = [
  { id: "1", title: "New Job Request", description: "You have a new request for AC Repair from Amit Singh.", time: "2 mins ago", icon: "briefcase", color: "#5B6BF9" },
  { id: "2", title: "Payment Received", description: "Your payout for the cleaning job has been processed.", time: "1 hour ago", icon: "dollar-sign", color: "#4ADE80" },
  { id: "3", title: "Rating Updated", description: "Priya Sharma gave you a 5-star rating!", time: "4 hours ago", icon: "star", color: "#FFD700" },
];

export function WorkerNotificationsScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-[#050B14]" edges={["top"]}>
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} className="flex-1">
        <View className="px-6 py-6 flex-row items-center border-b border-white/5">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Feather name="arrow-left" size={24} color="#FFF" />
          </Pressable>
          <Text className="text-white text-2xl font-bold">Notifications</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {MOCK_NOTIFICATIONS.map((notif) => (
            <Card key={notif.id} className="p-4 mb-4 bg-white/5 border-white/5">
              <View className="flex-row items-start">
                <View className="p-3 rounded-2xl mr-4" style={{ backgroundColor: `${notif.color}15` }}>
                  <Feather name={notif.icon as any} size={20} color={notif.color} />
                </View>
                <View className="flex-1">
                  <View className="flex-row justify-between items-start">
                    <Text className="text-white font-bold">{notif.title}</Text>
                    <Text className="text-white/30 text-[10px] uppercase font-bold">{notif.time}</Text>
                  </View>
                  <Text className="text-white/60 text-xs mt-1 leading-4">{notif.description}</Text>
                </View>
              </View>
            </Card>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
