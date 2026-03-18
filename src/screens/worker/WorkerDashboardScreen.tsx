import React from "react";
import { SafeAreaView, Text, View } from "react-native";

import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";

export function WorkerDashboardScreen() {
  return (
    <SafeAreaView className="flex-1 bg-ink-950">
      <View className="px-5 pt-6 gap-4">
        <Header title="Worker" subtitle="Today’s overview" />
        <Card className="p-4">
          <Text className="text-white font-semibold">Assigned jobs</Text>
          <Text className="text-white/70 mt-1">Integrating tasks API next.</Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

