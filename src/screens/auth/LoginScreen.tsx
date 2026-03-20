import { useMutation } from "@tanstack/react-query";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, Text, View } from "react-native";
import Toast from "react-native-toast-message";

import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { loginPassword, requestOtp } from "../../services/mutations";
import { setAuthTokens } from "../../store/authStore";

cssInterop(LinearGradient, { className: "style" });

export function LoginScreen({ navigation }: any) {
  const [mode, setMode] = useState<"customer" | "worker" | "admin">("customer");
  
  // States for Customer (OTP)
  const [phone, setPhone] = useState("+918433203463");
  
  // States for Worker/Admin (Password)
  const [identifier, setIdentifier] = useState("+918433203463");
  const [password, setPassword] = useState("123456");

  const otpMutation = useMutation({
    mutationFn: requestOtp,
    onSuccess: (data) => {
      if (data?.devCode)
        Toast.show({ type: "info", text1: "Dev OTP", text2: data.devCode });
      navigation.navigate("OtpVerify", { phone });
    },
    onError: (err: any) => {
      Toast.show({ type: "error", text1: "Error", text2: err?.response?.data?.message || err.message });
    }
  });

  const loginMutation = useMutation({
    mutationFn: loginPassword,
    onSuccess: async (data) => {
      await setAuthTokens(data);
      Toast.show({ type: "success", text1: "Welcome back!" });
      // Navigation is handled implicitly by RootNavigator observing `user` state
    },
    onError: (err: any) => {
      Toast.show({ type: "error", text1: "Login failed", text2: err?.response?.data?.message || err.message });
    }
  });

  function handleLogin() {
    if (mode === "customer") {
      if (!phone.trim()) return Toast.show({ type: "error", text1: "Enter phone number" });
      otpMutation.mutate({ phone: phone.trim() });
    } else {
      if (!identifier.trim() || !password.trim()) {
        return Toast.show({ type: "error", text1: "Missing fields", text2: "Enter phone/email and password" });
      }
      console.log("888888888888888");
      
      loginMutation.mutate({ phoneOrEmail: identifier.trim(), password,mode });
    }
  }

  const isCustomer = mode === "customer";
  const title = isCustomer ? "Welcome Back" : `${mode.charAt(0).toUpperCase() + mode.slice(1)} Login`;
  const subtitle = isCustomer ? "Sign in to continue" : "Enter your credentials to manage tasks";

  return (
    <SafeAreaView className="flex-1 bg-[#050B14]">
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} className="flex-1">
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
          <View className="flex-1 px-6 justify-center pb-24">
            
            {/* Top Logo */}
            <View className="items-center mb-10 mt-10">
              <Text className="text-5xl font-bold tracking-tight">
                <Text className="text-[#4F9CFF]">Home</Text>
                <Text className="text-[#9D5BFF]">Lux</Text>
              </Text>
              <Text className="text-white/50 text-sm mt-3 font-medium">
                Premium Interior Design
              </Text>
            </View>

            {/* Login Card */}
            <View className="bg-[#1A1A2E]/80 border border-white/5 rounded-3xl p-6 mb-10">
              <Text className="text-white text-2xl font-bold mb-1 tracking-tight">{title}</Text>
              <Text className="text-white/60 text-sm mb-8">{subtitle}</Text>
              
              {isCustomer ? (
                <Input
                  label="Phone Number"
                  leftIcon="phone"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                  placeholder="Enter your phone number"
                />
              ) : (
                <>
                  <Input
                    label="Email or Phone"
                    leftIcon="user"
                    value={identifier}
                    onChangeText={setIdentifier}
                    placeholder="Enter your email or phone"
                    autoCapitalize="none"
                  />
                  <View className="mt-4">
                    <Input
                      label="Password"
                      leftIcon="lock"
                      value={password}
                      onChangeText={setPassword}
                      placeholder="Enter your password"
                      secureTextEntry
                    />
                  </View>
                </>
              )}

              <View className="mt-6">
                <Button
                  title={isCustomer ? "Send OTP" : "Login"}
                  loading={otpMutation.isPending || loginMutation.isPending}
                  onPress={handleLogin}
                />
              </View>

              <Text className="text-center text-white/50 text-xs mt-6">
                By continuing, you agree to our{" "}
                <Text className="text-[#4F9CFF]">Terms of Service</Text>
              </Text>
            </View>
          </View>

          {/* Footer Quick Access */}
          <View className="absolute bottom-12 left-0 right-0 items-center">
            <Text className="text-white/40 text-xs mb-4">Quick Access</Text>
            
            <View className="flex-row gap-4">
              {isCustomer ? (
                <>
                  <Pressable 
                    onPress={() => setMode("worker")}
                    className="border border-white/10 rounded-full px-5 py-2"
                  >
                    <Text className="text-white/80 text-xs font-medium">Worker Login</Text>
                  </Pressable>
                  <Pressable 
                    onPress={() => setMode("admin")}
                    className="border border-white/10 rounded-full px-5 py-2"
                  >
                    <Text className="text-white/80 text-xs font-medium">Admin Login</Text>
                  </Pressable>
                </>
              ) : (
                <Pressable 
                  onPress={() => setMode("customer")}
                  className="border border-white/10 rounded-full px-5 py-2"
                >
                  <Text className="text-white/80 text-xs font-medium">Customer Login</Text>
                </Pressable>
              )}
            </View>
            
          </View>

        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
}