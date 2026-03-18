import React from "react";
import { SafeAreaView, Text, View } from "react-native";

import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";

export function WorkerTasksScreen() {
  return (
    <SafeAreaView className="flex-1 bg-ink-950">
      <View className="px-5 pt-6 gap-4">
        <Header title="Tasks" subtitle="Start & complete your assigned jobs." />
        <Card className="p-4">
          <Text className="text-white/70">
            Next step: hook this screen to `GET /api/workers/me/tasks` with TanStack Query and add mutations for start/complete.
          </Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}

