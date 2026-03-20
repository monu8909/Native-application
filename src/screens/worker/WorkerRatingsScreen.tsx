import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { ScrollView, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";

const REVIEWS = [
  { id: "1", customer: "Amit Singh", rating: "5.0", comment: "Excellent work! John was very professional and fixed the AC issue quickly.", date: "昨天" },
  { id: "2", customer: "Priya Sharma", rating: "4.5", comment: "Very good service. On time and efficient.", date: "2 days ago" },
  { id: "3", customer: "Rajesh Kumar", rating: "5.0", comment: "Highly recommend! Best electrician I have worked with.", date: "1 week ago" },
];

export function WorkerRatingsScreen({ navigation }: any) {
  return (
    <SafeAreaView className="flex-1 bg-[#050B14]" edges={["top"]}>
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} className="flex-1">
        <View className="px-6 py-6 flex-row items-center border-b border-white/5">
          <Pressable onPress={() => navigation.goBack()} className="mr-4">
            <Feather name="arrow-left" size={24} color="#FFF" />
          </Pressable>
          <Text className="text-white text-2xl font-bold">Ratings & Reviews</Text>
        </View>

        <ScrollView className="flex-1 px-6 pt-6" showsVerticalScrollIndicator={false}>
          {/* Summary Card */}
          <Card className="p-8 mb-8 items-center bg-[#1A1A2E]/60 border-white/5 shadow-2xl shadow-[#5B6BF9]/10">
            <Text className="text-white/40 text-xs font-bold uppercase tracking-widest mb-2">Average Rating</Text>
            <View className="flex-row items-center">
              <Text className="text-white text-6xl font-black mr-4">4.9</Text>
              <View>
                <View className="flex-row mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Feather key={s} name="star" size={16} color="#FFD700" style={{ marginRight: 2 }} fill="#FFD700" />
                  ))}
                </View>
                <Text className="text-white/40 text-xs font-medium">48 total reviews</Text>
              </View>
            </View>
          </Card>

          <Text className="text-white text-xl font-bold mb-6">Recent Feedback</Text>
          
          {REVIEWS.map((review) => (
            <Card key={review.id} className="p-5 mb-4 bg-white/5 border-white/5">
              <View className="flex-row justify-between items-start mb-3">
                <Text className="text-white font-bold">{review.customer}</Text>
                <View className="flex-row items-center bg-white/5 px-2 py-0.5 rounded-full">
                  <Feather name="star" size={10} color="#FFD700" fill="#FFD700" />
                  <Text className="text-white/60 text-[10px] font-bold ml-1">{review.rating}</Text>
                </View>
              </View>
              <Text className="text-white/60 text-xs leading-5 mb-3 italic">&quot;{review.comment}&quot;</Text>
              <Text className="text-white/20 text-[10px] uppercase font-bold tracking-widest">{review.date}</Text>
            </Card>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}
