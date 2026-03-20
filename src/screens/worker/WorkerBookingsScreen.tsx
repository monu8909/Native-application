import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { JobCard } from "../../components/worker/JobCard";

const TABS = ["Pending", "Accepted", "Completed", "Cancelled"];

const MOCK_BOOKINGS = [
  { id: "101", customerName: "Siddharth Malhotra", serviceType: "Deep Cleaning", time: "10:00 AM", date: "22 Mar 2026", location: "Bandra West, Mumbai", status: "Pending", price: "₹2,500" },
  { id: "102", customerName: "Ananya Pandey", serviceType: "Pest Control", time: "12:30 PM", date: "21 Mar 2026", location: "Juhu Scheme, Vile Parle", status: "Accepted", price: "₹1,800" },
  { id: "103", customerName: "Varun Dhawan", serviceType: "AC Service", time: "09:00 AM", date: "19 Mar 2026", location: "Seven Bungalows, Andheri", status: "Completed", price: "₹800" },
];

export function WorkerBookingsScreen() {
  const [activeTab, setActiveTab] = useState("Pending");

  const filteredBookings = MOCK_BOOKINGS.filter(b => b.status === activeTab);

  return (
    <SafeAreaView className="flex-1 bg-[#050B14]" edges={["top"]}>
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} className="flex-1">
        
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-white text-3xl font-bold">My Bookings</Text>
          <Text className="text-white/50 text-sm mt-1">Manage your work history</Text>
        </View>

        {/* Custom Tabs */}
        <View className="px-6 mb-6">
          <View className="flex-row bg-white/5 p-1 rounded-2xl">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;
              return (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-3 rounded-xl items-center ${isActive ? 'bg-[#5B6BF9]' : ''}`}
                >
                  <Text className={`text-[10px] font-bold uppercase tracking-tighter ${isActive ? 'text-white' : 'text-white/40'}`}>
                    {tab}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Bookings List */}
        <FlatList
          data={filteredBookings}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <JobCard 
              {...item}
              isRequest={activeTab === "Pending"}
              onAccept={() => console.log("Accepted", item.id)}
              onReject={() => console.log("Rejected", item.id)}
              onStart={() => console.log("Started", item.id)}
              onComplete={() => console.log("Completed", item.id)}
            />
          )}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center mt-20">
              <View className="bg-white/5 p-6 rounded-full mb-4">
                <Feather name="calendar" size={40} color="rgba(255,255,255,0.2)" />
              </View>
              <Text className="text-white/40 font-medium">No {activeTab.toLowerCase()} bookings</Text>
            </View>
          }
        />

      </LinearGradient>
    </SafeAreaView>
  );
}
