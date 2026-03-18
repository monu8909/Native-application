import React from "react";
import { SafeAreaView, Text, View } from "react-native";

import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";

export function AdminDashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-ink-950">
      <View className="px-5 pt-6 gap-4">
        <Header title="Admin" subtitle="Analytics & operations" />
        <Card className="p-4">
          <Text className="text-white/70">
            Next step: integrate `GET /api/admin/dashboard` and add Workers CRUD + Booking management tabs.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

