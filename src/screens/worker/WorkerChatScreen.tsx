import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, Text, View, Pressable, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MOCK_MESSAGES = [
  { id: "1", text: "Hello John, are you on your way?", sender: "customer", time: "10:00 AM" },
  { id: "2", text: "Yes, I'll be there in 15 minutes.", sender: "worker", time: "10:02 AM" },
  { id: "3", text: "Great, I'll be waiting.", sender: "customer", time: "10:05 AM" },
];

export function WorkerChatScreen({ navigation, route }: any) {
  const [message, setMessage] = useState("");
  const customerName = route?.params?.customerName || "Customer";

  return (
    <SafeAreaView className="flex-1 bg-[#050B14]" edges={["top"]}>
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} className="flex-1">
        
        {/* Chat Header */}
        <View className="px-6 py-4 flex-row items-center border-b border-white/5">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Feather name="arrow-left" size={24} color="#FFF" />
          </Pressable>
          <View className="flex-row items-center">
            <View className="w-10 h-10 rounded-full bg-[#5B6BF9] items-center justify-center mr-3">
              <Text className="text-white font-bold">{customerName.charAt(0)}</Text>
            </View>
            <View>
              <Text className="text-white font-bold text-lg">{customerName}</Text>
              <Text className="text-green-400 text-[10px] font-bold uppercase tracking-widest">Online</Text>
            </View>
          </View>
        </View>

        {/* Messages List */}
        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {MOCK_MESSAGES.map((msg) => {
            const isWorker = msg.sender === "worker";
            return (
              <View 
                key={msg.id} 
                className={`mb-6 max-w-[80%] ${isWorker ? 'self-end' : 'self-start'}`}
              >
                <View 
                  className={`p-4 rounded-3xl ${isWorker ? 'bg-[#5B6BF9] rounded-tr-none' : 'bg-white/10 rounded-tl-none'}`}
                >
                  <Text className="text-white text-sm leading-5">{msg.text}</Text>
                </View>
                <Text 
                  className={`text-white/30 text-[9px] mt-1 font-bold ${isWorker ? 'text-right' : 'text-left'}`}
                >
                  {msg.time}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* Chat Input */}
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        >
          <View className="px-6 py-6 pb-12 flex-row items-center bg-[#1A1A2E]/50 border-t border-white/5">
            <Pressable className="bg-white/5 p-3 rounded-2xl mr-3">
              <Feather name="plus" size={20} color="#FFF" />
            </Pressable>
            <View className="flex-1 bg-white/5 rounded-2xl px-4 py-3 border border-white/5 mr-3">
              <TextInput 
                placeholder="Type a message..." 
                placeholderTextColor="rgba(255,255,255,0.3)" 
                className="text-white text-sm"
                value={message}
                onChangeText={setMessage}
              />
            </View>
            <Pressable 
              className={`p-3 rounded-2xl ${message.trim() ? 'bg-[#5B6BF9]' : 'bg-white/5'}`}
              disabled={!message.trim()}
            >
              <Feather name="send" size={20} color={message.trim() ? "#FFF" : "rgba(255,255,255,0.2)"} />
            </Pressable>
          </View>
        </KeyboardAvoidingView>

      </LinearGradient>
    </SafeAreaView>
  );
}
