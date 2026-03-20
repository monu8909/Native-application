import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";

const MOCK_TRANSACTIONS = [
  { id: "t1", title: "Job Payout - AC Repair", amount: "+₹1,200", date: "20 Mar 2026", type: "credit" },
  { id: "t2", title: "Wallet Withdrawal", amount: "-₹3,000", date: "18 Mar 2026", type: "debit" },
  { id: "t3", title: "Job Payout - Cleaning", amount: "+₹2,500", date: "15 Mar 2026", type: "credit" },
  { id: "t4", title: "Job Payout - Plumbing", amount: "+₹850", date: "12 Mar 2026", type: "credit" },
];

export function WorkerWalletScreen() {
  return (
    <SafeAreaView className="flex-1 bg-[#050B14]" edges={["top"]}>
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} className="flex-1">
        
        {/* Header */}
        <View className="px-6 py-6">
          <Text className="text-white text-3xl font-bold">Earnings</Text>
          <Text className="text-white/50 text-sm mt-1">Manage your wallet & payouts</Text>
        </View>

        {/* Balance Card */}
        <View className="px-6 mb-8">
          <LinearGradient
            colors={["#5B6BF9", "#9D5BFF"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-3xl p-6 shadow-xl shadow-[#5B6BF9]/20"
          >
            <Text className="text-white/70 text-xs font-bold uppercase tracking-widest">Available Balance</Text>
            <Text className="text-white text-4xl font-black mt-2 tracking-tight">₹4,250.00</Text>
            
            <View className="flex-row mt-8 gap-3">
              <Button title="Withdraw to Bank" className="flex-1 bg-white/20 h-10 border-0" />
            </View>
          </LinearGradient>
        </View>

        {/* Transaction History */}
        <View className="flex-1 px-6">
          <Text className="text-white text-lg font-bold mb-4">Transaction History</Text>
          <FlatList
            data={MOCK_TRANSACTIONS}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            renderItem={({ item }) => (
              <Card className="p-4 mb-3 flex-row items-center justify-between border-white/5 bg-white/5">
                <View className="flex-row items-center">
                  <View className={`p-3 rounded-xl ${item.type === 'credit' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <Feather 
                      name={item.type === 'credit' ? 'arrow-down-left' : 'arrow-up-right'} 
                      size={18} 
                      color={item.type === 'credit' ? '#4ADE80' : '#F87171'} 
                    />
                  </View>
                  <View className="ml-4">
                    <Text className="text-white font-semibold text-sm">{item.title}</Text>
                    <Text className="text-white/40 text-[10px] mt-1 uppercase font-bold">{item.date}</Text>
                  </View>
                </View>
                <Text className={`font-bold ${item.type === 'credit' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.amount}
                </Text>
              </Card>
            )}
          />
        </View>

      </LinearGradient>
    </SafeAreaView>
  );
}
