import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { useAuthStore } from "../../store/authStore";

const SETTINGS_OPTIONS = [
  { id: "s1", title: "Account Settings", icon: "user", color: "#5B6BF9" },
  { id: "s2", title: "App Preferences", icon: "settings", color: "#4F9CFF" },
  { id: "s3", title: "Security", icon: "lock", color: "#9D5BFF" },
  { id: "s4", title: "Privacy Policy", icon: "shield", color: "#4ADE80" },
  { id: "s5", title: "Support", icon: "help-circle", color: "#FFB038" },
];

export function WorkerSettingsScreen({ navigation }: any) {
  const { clear } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-[#050B14]" edges={["top"]}>
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} className="flex-1">
        <View className="px-6 py-6 flex-row items-center border-b border-white/5">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Feather name="arrow-left" size={24} color="#FFF" />
          </Pressable>
          <Text className="text-white text-2xl font-bold">Settings</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {SETTINGS_OPTIONS.map((item) => (
            <Pressable key={item.id} className="mb-4">
              <Card className="p-4 flex-row items-center justify-between bg-white/5 border-white/5">
                <View className="flex-row items-center">
                  <View className="p-3 rounded-2xl mr-4" style={{ backgroundColor: `${item.color}15` }}>
                    <Feather name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text className="text-white font-bold">{item.title}</Text>
                </View>
                <Feather name="chevron-right" size={20} color="rgba(255,255,255,0.2)" />
              </Card>
            </Pressable>
          ))}

          <Pressable 
            onPress={() => clear()}
            className="mt-10 mb-20"
          >
            <Card className="p-4 px-6 flex-row items-center justify-center bg-red-500/10 border-red-500/20">
              <Feather name="log-out" size={20} color="#F87171" style={{ marginRight: 10 }} />
              <Text className="text-red-400 font-bold uppercase tracking-widest text-xs">Sign Out</Text>
            </Card>
          </Pressable>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
