import React from "react";
import { FlatList, SafeAreaView, Text, View, RefreshControl } from "react-native";

import { useServices } from "../../hooks/useServices";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { Skeleton } from "../../components/ui/Skeleton";
import { EmptyState } from "../../components/ui/EmptyState";

export function ServicesScreen({ navigation }: any) {
  const q = useServices();

  return (
    <SafeAreaView className="flex-1 bg-ink-950">
      <View className="px-5 pt-6 pb-2">
        <Header title="Services" subtitle="Choose a category and book in seconds." />
      </View>

      {q.isLoading ? (
        <View className="px-5 gap-3 mt-4">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </View>
      ) : !q.data?.length ? (
        <EmptyState title="No services" description="Try again in a moment." />
      ) : (
        <FlatList
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, gap: 12 }}
          data={q.data}
          keyExtractor={(i) => i.id}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} />}
          renderItem={({ item }) => (
            <Card className="p-4">
              <Text className="text-white font-semibold text-lg">{item.title}</Text>
              <Text className="text-white/70 mt-1">{item.subtitle}</Text>
              <Text className="text-white/80 mt-2">From ₹{item.baseFrom}/sqft</Text>
              <View className="mt-4">
                <Button title="Book" onPress={() => navigation.getParent()?.navigate("Booking", { serviceType: item.key })} />
              </View>
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

