import { useMutation } from "@tanstack/react-query";
import React from "react";
import { SafeAreaView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Input } from "../../components/ui/Input";
import { requestOtp } from "../../services/mutations";

export function LoginScreen({ navigation }: any) {
  const [phone, setPhone] = React.useState("");

  const otpMutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: (data) => {
      if (data?.devCode)
        Toast.show({ type: "info", text1: "Dev OTP", text2: data.devCode });
      navigation.navigate("OtpVerify", { phone });
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-ink-950">
      <View className="flex-1 px-5 pt-6">
        <Header title="Welcome back" subtitle="OTP login for customers" />

        <View className="mt-8 gap-4">
          <Card className="p-4">
            <Input
              label="Phone"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="+919999999999"
            />
            <Text className="text-white/60 text-xs mt-2">
              Tip: set `EXPO_PUBLIC_API_URL` to your backend URL (LAN IP for
              device).
            </Text>
          </Card>

          <Button
            title="Send OTP"
            loading={otpMutation.isPending}
            onPress={() => otpMutation.mutate({ phone: phone.trim() })}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
