import React from "react";
import { FlatList, RefreshControl, SafeAreaView, Text, View } from "react-native";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Header } from "../../components/ui/Header";
import { Skeleton } from "../../components/ui/Skeleton";
import { useMyBookings } from "../../hooks/useBookings";

export function MyBookingsScreen() {
  const q = useMyBookings();
    // console.log("bookings---------->",chalk.green(JSON.stringify(q.data, null, 2)));

  return (
    <SafeAreaView className="flex-1 bg-ink-950">
      <View className="px-5 pt-6 pb-2">
        <Header title="My Bookings" subtitle="Live status updates for your jobs." />
      </View>

      {q.isLoading ? (
        <View className="px-5 gap-3 mt-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </View>
      ) : !q.data?.length ? (
        <EmptyState title="No bookings yet" description="Book a service and it will show up here." />
      ) : (
        <FlatList
          data={q.data}
          keyExtractor={(i) => i._id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 24, gap: 12 }}
          refreshControl={<RefreshControl refreshing={q.isRefetching} onRefresh={() => q.refetch()} />}
          renderItem={({ item }) => (
            <Card className="p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-white font-semibold">
                  {item.serviceType 
                    ? item.serviceType.replace("_", " ").toUpperCase() 
                    : "REQUESTED SERVICE"}
                </Text>
                <Text className="text-sky-300 font-semibold">{item.status}</Text>
              </View>
              <Text className="text-white/70 mt-2">
                {item.address.line1}, {item.address.city}
              </Text>
              <Text className="text-white/60 mt-1">Scheduled: {new Date(item.scheduledAt).toLocaleString()}</Text>
              {typeof item.estimatedPrice === "number" ? (
                <Text className="text-white/80 mt-2">Estimate: ₹{item.estimatedPrice}</Text>
              ) : null}
            </Card>
          )}
        />
      )}
    </SafeAreaView>
  );
}

