import React from "react";
import { SafeAreaView, View } from "react-native";
import Toast from "react-native-toast-message";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Input } from "../../components/ui/Input";
import { useCreateBooking } from "../../hooks/useBookings";

export function BookingScreen({ route, navigation }: any) {
  const serviceType = (route?.params?.serviceType ?? "wall_design") as any;
  const [line1, setLine1] = React.useState("");
  const [city, setCity] = React.useState("");
  const [state, setState] = React.useState("");
  const [description, setDescription] = React.useState("");

  const create = useCreateBooking();

  return (
    <SafeAreaView className="flex-1 bg-ink-950">
      <View className="flex-1 px-5 pt-6 gap-5">
        <Header title="New Booking" subtitle={String(serviceType).replace("_", " ").toUpperCase()} />

        <Card className="p-4 gap-4">
          <Input label="Address" value={line1} onChangeText={setLine1} placeholder="House no, area, street" />
          <Input label="City" value={city} onChangeText={setCity} placeholder="City" />
          <Input label="State" value={state} onChangeText={setState} placeholder="State" />
          <Input label="Description (optional)" value={description} onChangeText={setDescription} placeholder="Any notes…" />
        </Card>

        <Button
          title="Confirm Booking"
          loading={create.isPending}
          onPress={async () => {
            await create.mutateAsync({
              serviceType,
              address: { line1: line1.trim(), city: city.trim(), state: state.trim() },
              scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
              description: description.trim() || undefined,
            });
            Toast.show({ type: "success", text1: "Booked", text2: "We’ll confirm shortly." });
            navigation.goBack();
          }}
        />
      </View>
    </SafeAreaView>
  );
}

