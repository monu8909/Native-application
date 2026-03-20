import { Feather } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";
import { Card } from "../ui/Card";
import { Button } from "../ui/Button";

interface JobCardProps {
  id: string;
  customerName: string;
  serviceType: string;
  time: string;
  date: string;
  location: string;
  price?: string;
  isRequest?: boolean;
  onAccept?: () => void;
  onReject?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
}

export function JobCard({
  customerName,
  serviceType,
  time,
  date,
  location,
  price,
  isRequest,
  onAccept,
  onReject,
  onStart,
  onComplete,
}: JobCardProps) {
  return (
    <Card className="p-5 mb-4 border-l-4 border-l-[#5B6BF9]">
      <View className="flex-row justify-between items-start mb-4">
        <View className="flex-1">
          <Text className="text-white text-lg font-bold">{customerName}</Text>
          <Text className="text-[#5B6BF9] font-semibold text-xs mt-0.5 uppercase tracking-wider">
            {serviceType}
          </Text>
        </View>
        {price && (
          <View className="bg-green-500/10 px-3 py-1 rounded-full">
            <Text className="text-green-400 font-bold">{price}</Text>
          </View>
        )}
      </View>

      <View className="flex-row items-center mb-3">
        <Feather name="clock" size={14} color="#FFF" style={{ opacity: 0.5 }} />
        <Text className="text-white/60 text-xs ml-2">{date} • {time}</Text>
      </View>

      <View className="flex-row items-center mb-5">
        <Feather name="map-pin" size={14} color="#FFF" style={{ opacity: 0.5 }} />
        <Text className="text-white/60 text-xs ml-2" numberOfLines={1}>{location}</Text>
      </View>

      <View className="flex-row gap-3">
        {isRequest ? (
          <>
            <Button 
              title="Reject" 
              variant="ghost" 
              onPress={onReject} 
              className="flex-1 border-red-500/30 h-10" 
            />
            <Button 
              title="Accept" 
              onPress={onAccept} 
              className="flex-1 h-10" 
            />
          </>
        ) : (
          <>
            <Button 
              title="Start" 
              variant="ghost" 
              onPress={onStart} 
              className="flex-1 h-10 border-[#5B6BF9]/30" 
            />
            <Button 
              title="Done" 
              onPress={onComplete} 
              className="flex-1 h-10" 
            />
          </>
        )}
      </View>
    </Card>
  );
}
