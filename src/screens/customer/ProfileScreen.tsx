import React from "react";
import { SafeAreaView, Text, View } from "react-native";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { useAuthStore } from "../../store/authStore";

export function ProfileScreen() {
  const { user } = useAuthStore();

  return (
    <SafeAreaView className="flex-1 bg-ink-950">
      <View className="px-5 pt-6 gap-4">
        <Header title="Profile" subtitle="Account & preferences" />
        <Card className="p-4">
          <Text className="text-white font-semibold">{user?.name ?? "—"}</Text>
          <Text className="text-white/70 mt-1">{user?.phone ?? user?.email ?? ""}</Text>
          <Text className="text-white/60 mt-2">Role: {user?.role}</Text>
        </Card>
        <Button title="Logout" variant="ghost" onPress={() => void useAuthStore.getState().clear()} />
      </View>
    </SafeAreaView>
  );
}

