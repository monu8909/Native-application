import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import { ScrollView, Text, View, Pressable, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";

const ALL_SERVICES = [
  { id: "1", name: "AC Repair", price: "₹450", enabled: true },
  { id: "2", name: "Deep Cleaning", price: "₹1,200", enabled: true },
  { id: "3", name: "Plumbing", price: "₹300", enabled: false },
  { id: "4", name: "Electrical", price: "₹250", enabled: true },
  { id: "5", name: "Pest Control", price: "₹800", enabled: false },
];

export function WorkerServiceManagementScreen({ navigation }: any) {
  const [services, setServices] = useState(ALL_SERVICES);

  const toggleService = (id: string) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s));
  };

  return (
    <SafeAreaView className="flex-1 bg-[#050B14]" edges={["top"]}>
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} className="flex-1">
        
        <View className="px-6 py-6 flex-row items-center border-b border-white/5">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Feather name="arrow-left" size={24} color="#FFF" />
          </Pressable>
          <Text className="text-white text-2xl font-bold">Manage Services</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          <Text className="text-white/40 text-xs font-bold uppercase tracking-widest mb-6">Your Skills & Pricing</Text>
          
          {services.map((service) => (
            <Card key={service.id} className={`p-5 mb-4 border-white/5 bg-white/5 ${!service.enabled ? 'opacity-50' : ''}`}>
              <View className="flex-row justify-between items-center">
                <View className="flex-1">
                  <Text className="text-white font-bold text-lg">{service.name}</Text>
                  <Text className="text-[#5B6BF9] font-bold text-xs mt-1">Starting from {service.price}</Text>
                </View>
                <Switch 
                  value={service.enabled} 
                  onValueChange={() => toggleService(service.id)}
                  trackColor={{ false: "#3E3E3E", true: "#5B6BF9" }}
                  thumbColor={service.enabled ? "#FFF" : "#F4F3F4"}
                />
              </View>
            </Card>
          ))}

          <Pressable className="mt-6 mb-20">
            <LinearGradient
              colors={["#5B6BF9", "#9D5BFF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="rounded-2xl p-4 items-center justify-center flex-row"
            >
              <Feather name="plus" size={20} color="#FFF" style={{ marginRight: 10 }} />
              <Text className="text-white font-bold">Add New Service</Text>
            </LinearGradient>
          </Pressable>

        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
