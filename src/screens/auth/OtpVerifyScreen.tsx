import { Feather } from "@expo/vector-icons";
import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React from "react";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, View } from "react-native";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { verifyOtp } from "../../services/mutations";
import { setAuthTokens } from "../../store/authStore";

cssInterop(LinearGradient, { className: "style" });

export function OtpVerifyScreen({ route, navigation }: any) {
  const phone = route?.params?.phone ?? "";
  const [code, setCode] = React.useState("");

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
    <SafeAreaView className="flex-1 bg-[#050B14]">
      <LinearGradient
        colors={["#050B14", "#09091A", "#130A24"]}
        className="flex-1"
      >
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
          <View className="flex-1 px-6 justify-center pb-24">
            
            {/* Verify OTP Card */}
            <View className="bg-[#1A1A2E]/80 border border-white/5 rounded-3xl p-6">
              <Pressable onPress={() => navigation.goBack()} className="flex-row items-center mb-6">
                <Feather name="arrow-left" size={16} color="rgba(255,255,255,0.7)" />
                <Text className="text-white/70 ml-2 font-medium">Back</Text>
              </Pressable>

              <Text className="text-white text-3xl font-bold mb-1 tracking-tight">
                Verify OTP
              </Text>
              <Text className="text-white/60 text-sm mb-8">
                Enter the 6-digit code sent to your phone
              </Text>

              {/* Pseudo 6-digit input spacing using letter-spacing */}
              <Input 
                value={code} 
                onChangeText={setCode} 
                keyboardType="number-pad" 
                placeholder="1 2 3 4 5 6" 
                maxLength={6}
                textAlign="center"
                className="text-1.5xl tracking-[0.5em] font-bold"
              />

              <Text className="text-center text-white/50 text-xs mt-6 mb-6">
                Resend code in <Text className="text-[#4F9CFF]">29s</Text>
              </Text>

              <Button
                title="Verify & Continue"
                loading={mutation.isPending}
                onPress={() => mutation.mutate({ phone, code: code.trim() })}
              />
            </View>

          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}

