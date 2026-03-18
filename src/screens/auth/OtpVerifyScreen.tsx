import React from "react";
import { SafeAreaView, View } from "react-native";
import { useMutation } from "@tanstack/react-query";

import { verifyOtp } from "../../services/mutations";
import { setAuthTokens } from "../../store/authStore";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Header } from "../../components/ui/Header";
import { Input } from "../../components/ui/Input";

export function OtpVerifyScreen({ route }: any) {
  const phone = route?.params?.phone ?? "";
  const [code, setCode] = React.useState("");
  const [name, setName] = React.useState("");

  const mutation = useMutation({
    mutationFn: verifyOtp,
    onSuccess: async (data) => {
      await setAuthTokens({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        user: data.user,
      });
    },
  });

  return (
    <SafeAreaView className="flex-1 bg-ink-950">
      <View className="flex-1 px-5 pt-6 gap-5">
        <Header title="Verify OTP" subtitle={phone} />
        <Card className="p-4 gap-4">
          <Input label="Name (first time)" value={name} onChangeText={setName} placeholder="Your name" />
          <Input label="OTP Code" value={code} onChangeText={setCode} keyboardType="number-pad" placeholder="123456" />
        </Card>
        <Button
          title="Continue"
          loading={mutation.isPending}
          onPress={() => mutation.mutate({ phone, code: code.trim(), name: name.trim() || undefined })}
        />
      </View>
    </SafeAreaView>
  );
}

