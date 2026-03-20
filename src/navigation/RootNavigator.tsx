import { Feather } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { Text, View } from "react-native";

import { LoginScreen } from "../screens/auth/LoginScreen";
import { OtpVerifyScreen } from "../screens/auth/OtpVerifyScreen";
import { useAuthStore } from "../store/authStore";

import { BookingScreen } from "../screens/customer/BookingScreen";
import { CustomerHomeScreen } from "../screens/customer/CustomerHomeScreen";
import { MyBookingsScreen } from "../screens/customer/MyBookingsScreen";
import { ProfileScreen } from "../screens/customer/ProfileScreen";
import { ServicesScreen } from "../screens/customer/ServicesScreen";

import { AdminDashboardScreen } from "../screens/admin/AdminDashboardScreen";
import { WorkerDashboardScreen } from "../screens/worker/WorkerDashboardScreen";
import { WorkerProfileScreen } from "../screens/worker/WorkerProfileScreen";
import { WorkerChatScreen } from "../screens/worker/WorkerChatScreen";
import { WorkerNotificationsScreen } from "../screens/worker/WorkerNotificationsScreen";
import { WorkerRatingsScreen } from "../screens/worker/WorkerRatingsScreen";
import { WorkerSettingsScreen } from "../screens/worker/WorkerSettingsScreen";
import { WorkerServiceManagementScreen } from "../screens/worker/WorkerServiceManagementScreen";

export type RootStackParamList = {
  Auth: undefined;
  Customer: undefined;
  Worker: undefined;
  Admin: undefined;
  AdminWorkerDetail: { workerId: string };
  Booking: { serviceType?: string } | undefined;
  Notifications: undefined;
  Ratings: undefined;
  Settings: undefined;
  Chat: { customerName?: string } | undefined;
  ServiceManagement: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

function CustomerTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          left: 20,
          right: 20,
          height: 72,
          backgroundColor: "#1A1A2E",
          borderTopWidth: 0,
          borderRadius: 24,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 10,
          paddingHorizontal: 8,
          // For iOS floating centering issues
          paddingTop: 8,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen 
        name="Home" 
        component={CustomerHomeScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={`w-14 h-14 justify-center items-center rounded-2xl ${focused ? 'bg-[#5B6BF9]' : ''}`}>
              <Feather name="home" size={20} color={focused ? "#FFF" : "rgba(255,255,255,0.6)"} />
              <Text className={`text-[10px] mt-1 font-semibold ${focused ? 'text-white' : 'text-white/60'}`}>Home</Text>
            </View>
          )
        }}
      />
      <Tabs.Screen 
        name="Services" 
        component={ServicesScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={`w-14 h-14 justify-center items-center rounded-2xl ${focused ? 'bg-[#5B6BF9]' : ''}`}>
              <Feather name="list" size={20} color={focused ? "#FFF" : "rgba(255,255,255,0.6)"} />
              <Text className={`text-[10px] mt-1 font-semibold ${focused ? 'text-white' : 'text-white/60'}`}>Services</Text>
            </View>
          )
        }}
      />
      <Tabs.Screen 
        name="Bookings" 
        component={MyBookingsScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={`w-14 h-14 justify-center items-center rounded-2xl ${focused ? 'bg-[#5B6BF9]' : ''}`}>
              <Feather name="calendar" size={20} color={focused ? "#FFF" : "rgba(255,255,255,0.6)"} />
              <Text className={`text-[10px] mt-1 font-semibold ${focused ? 'text-white' : 'text-white/60'}`}>Bookings</Text>
            </View>
          )
        }}
      />
      <Tabs.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={`w-14 h-14 justify-center items-center rounded-2xl ${focused ? 'bg-[#5B6BF9]' : ''}`}>
              <Feather name="user" size={20} color={focused ? "#FFF" : "rgba(255,255,255,0.6)"} />
              <Text className={`text-[10px] mt-1 font-semibold ${focused ? 'text-white' : 'text-white/60'}`}>Profile</Text>
            </View>
          )
        }}
      />
    </Tabs.Navigator>
  );
}

function WorkerTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 24,
          left: 20,
          right: 20,
          height: 72,
          backgroundColor: "#1A1A2E",
          borderTopWidth: 0,
          borderRadius: 24,
          elevation: 10,
          shadowColor: "#000",
          shadowOpacity: 0.3,
          shadowRadius: 10,
          paddingHorizontal: 8,
          paddingTop: 8,
          paddingBottom: 8,
        },
      }}
    >
      <Tabs.Screen 
        name="Dashboard" 
        component={WorkerDashboardScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={`w-14 h-14 justify-center items-center rounded-2xl ${focused ? 'bg-[#5B6BF9]' : ''}`}>
              <Feather name="grid" size={20} color={focused ? "#FFF" : "rgba(255,255,255,0.6)"} />
              <Text className={`text-[10px] mt-1 font-semibold ${focused ? 'text-white' : 'text-white/60'}`}>Home</Text>
            </View>
          )
        }}
      />
      <Tabs.Screen 
        name="Profile" 
        component={WorkerProfileScreen} 
        options={{
          tabBarIcon: ({ focused }) => (
            <View className={`w-14 h-14 justify-center items-center rounded-2xl ${focused ? 'bg-[#5B6BF9]' : ''}`}>
              <Feather name="user" size={20} color={focused ? "#FFF" : "rgba(255,255,255,0.6)"} />
              <Text className={`text-[10px] mt-1 font-semibold ${focused ? 'text-white' : 'text-white/60'}`}>Profile</Text>
            </View>
          )
        }}
      />
    </Tabs.Navigator>
  );
}



function AuthStack() {
  const A = createNativeStackNavigator();
  return (
    <A.Navigator screenOptions={{ headerShown: false }}>
      <A.Screen name="Login" component={LoginScreen} />
      <A.Screen name="OtpVerify" component={OtpVerifyScreen} />
    </A.Navigator>
  );
}

export function RootNavigator() {
  const { user, hydrated } = useAuthStore();

  React.useEffect(() => {
    if (!hydrated) void useAuthStore.getState().hydrate();
  }, [hydrated]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <Stack.Screen name="Auth" component={AuthStack} />
      ) : user.role === "customer" ? (
        <>
          <Stack.Screen name="Customer" component={CustomerTabs} />
          <Stack.Screen name="Booking" component={BookingScreen} />
        </>
      ) : user.role === "worker" ? (
        <>
          <Stack.Screen name="Worker" component={WorkerTabs} />
          <Stack.Screen name="Notifications" component={WorkerNotificationsScreen} />
          <Stack.Screen name="Ratings" component={WorkerRatingsScreen} />
          <Stack.Screen name="Chat" component={WorkerChatScreen} />
          <Stack.Screen name="Settings" component={WorkerSettingsScreen} />
          <Stack.Screen name="ServiceManagement" component={WorkerServiceManagementScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="Admin" component={AdminDashboardScreen} />
          <Stack.Screen name="AdminWorkerDetail" component={require("../screens/admin/AdminWorkerDetailScreen").AdminWorkerDetailScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
