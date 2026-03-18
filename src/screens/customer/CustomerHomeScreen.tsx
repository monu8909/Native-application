import React from "react";
import { SafeAreaView, Text, View } from "react-native";

import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Button } from "../../components/ui/Button";
import { useServices } from "../../hooks/useServices";
import { Skeleton } from "../../components/ui/Skeleton";

export function CustomerHomeScreen({ navigation }: any) {
  const services = useServices();

  return (
    <SafeAreaView className="flex-1 bg-ink-950">
      <View className="px-5 pt-6">
        <Header title="Home Decor" subtitle="Premium interior finishes, on schedule." />
      </View>

      <View className="px-5 mt-6 gap-4">
        <Card className="p-4">
          <Text className="text-white/80">Quick booking</Text>
          <Text className="text-white text-xl font-semibold mt-1">Book your next upgrade</Text>
          <Text className="text-white/70 mt-2">
            Pick a service and schedule a visit. Live tracking updates once assigned.
          </Text>
          <Button className="mt-4" title="Browse Services" onPress={() => navigation.navigate("Services")} />
        </Card>

        <Text className="text-white/80 font-semibold">Popular services</Text>
        {services.isLoading ? (
          <View className="gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </View>
        ) : (
          <View className="gap-3">
            {services.data?.slice(0, 3).map((s) => (
              <Card key={s.id} className="p-4">
                <Text className="text-white font-semibold text-lg">{s.title}</Text>
                <Text className="text-white/70 mt-1">{s.subtitle}</Text>
                <Button
                  className="mt-4"
                  title="Book now"
                  onPress={() => navigation.getParent()?.navigate("Booking", { serviceType: s.key })}
                />
              </Card>
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

