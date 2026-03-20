import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";

export function WorkerProfileScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-[#050B14]" edges={["top"]}>
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} className="flex-1">
        
        <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          
          {/* Profile Header */}
          <View className="items-center py-10">
            <View className="relative">
              <View className="w-28 h-28 rounded-full border-4 border-[#5B6BF9] p-1 shadow-2xl shadow-[#5B6BF9]/40">
                <Image 
                  source={{ uri: "https://i.pravatar.cc/150?u=worker1" }}
                  className="w-full h-full rounded-full"
                />
              </View>
              <Pressable className="absolute bottom-0 right-0 bg-[#5B6BF9] p-2 rounded-full border-2 border-[#050B14]">
                <Feather name="camera" size={16} color="#FFF" />
              </Pressable>
            </View>
            <Text className="text-white text-2xl font-bold mt-4">John Doe</Text>
            <Text className="text-white/50 text-sm font-medium">Professional Technician</Text>
            
            <View className="flex-row mt-4 gap-2">
              <View className="bg-white/5 px-4 py-1 rounded-full border border-white/5">
                <Text className="text-white/60 text-[10px] font-bold">4.9 ⭐</Text>
              </View>
              <View className="bg-white/5 px-4 py-1 rounded-full border border-white/5">
                <Text className="text-white/60 text-[10px] font-bold">5+ Yrs Exp</Text>
              </View>
            </View>
          </View>

          {/* Action Grid */}
          <View className="flex-row flex-wrap justify-between gap-y-4 mb-10">
            <Pressable onPress={() => navigation.navigate("Settings")} className="w-[48%] bg-white/5 p-4 rounded-3xl border border-white/5">
              <Feather name="settings" size={24} color="#FFF" />
              <Text className="text-white font-bold mt-3">Settings</Text>
              <Text className="text-white/40 text-[10px] mt-1">App & Privacy</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("Ratings")} className="w-[48%] bg-white/5 p-4 rounded-3xl border border-white/5">
              <Feather name="star" size={24} color="#FFF" />
              <Text className="text-white font-bold mt-3">Ratings</Text>
              <Text className="text-white/40 text-[10px] mt-1">48 Reviews</Text>
            </Pressable>
            <Pressable onPress={() => navigation.navigate("ServiceManagement")} className="w-[48%] bg-white/5 p-4 rounded-3xl border border-white/5">
              <Feather name="tool" size={24} color="#FFF" />
              <Text className="text-white font-bold mt-3">Services</Text>
              <Text className="text-white/40 text-[10px] mt-1">Manage Skills</Text>
            </Pressable>
            <Pressable className="w-[48%] bg-white/5 p-4 rounded-3xl border border-white/5">
              <Feather name="file-text" size={24} color="#FFF" />
              <Text className="text-white font-bold mt-3">Documents</Text>
              <Text className="text-green-400 text-[10px] mt-1 font-bold">Verified</Text>
            </Pressable>
          </View>

          {/* Information Section */}
          <Card className="p-6 mb-10 bg-white/5 border-white/10">
            <Text className="text-white text-lg font-bold mb-6">Personal Info</Text>
            
            <View className="gap-y-6">
              <View className="flex-row items-center">
                <View className="bg-white/5 p-3 rounded-2xl mr-4">
                  <Feather name="phone" size={18} color="#5B6BF9" />
                </View>
                <View>
                  <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Phone Number</Text>
                  <Text className="text-white font-medium mt-0.5">+91 98765 43210</Text>
                </View>
              </View>
              
              <View className="flex-row items-center">
                <View className="bg-white/5 p-3 rounded-2xl mr-4">
                  <Feather name="mail" size={18} color="#5B6BF9" />
                </View>
                <View>
                  <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Email Address</Text>
                  <Text className="text-white font-medium mt-0.5">john.technician@email.com</Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="bg-white/5 p-3 rounded-2xl mr-4">
                  <Feather name="map-pin" size={18} color="#5B6BF9" />
                </View>
                <View>
                  <Text className="text-white/40 text-[10px] font-bold uppercase tracking-widest">Location</Text>
                  <Text className="text-white font-medium mt-0.5">Mumbai, Maharashtra</Text>
                </View>
              </View>
            </View>
          </Card>

          {/* About Section */}
          <View className="mb-10">
            <Text className="text-white text-lg font-bold mb-4">About Me</Text>
            <Text className="text-white/60 leading-6 text-sm">
              Highly skilled and reliable service professional with over 5 years of experience in AC repair and electrical maintenance. Committed to providing premium quality service with a focus on customer satisfaction.
            </Text>
          </View>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
