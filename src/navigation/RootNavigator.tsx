import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import { useColorScheme } from "react-native";

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
import { WorkerTasksScreen } from "../screens/worker/WorkerTasksScreen";

export type RootStackParamList = {
  Auth: undefined;
  Customer: undefined;
  Worker: undefined;
  Admin: undefined;
  Booking: { serviceType?: string } | undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tabs = createBottomTabNavigator();

function CustomerTabs() {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "rgba(0,0,0,0.75)",
          borderTopColor: "rgba(255,255,255,0.08)",
        },
        tabBarActiveTintColor: "#38BDF8",
        tabBarInactiveTintColor: "rgba(255,255,255,0.55)",
      }}
    >
      <Tabs.Screen name="Home" component={CustomerHomeScreen} />
      <Tabs.Screen name="Services" component={ServicesScreen} />
      <Tabs.Screen name="Bookings" component={MyBookingsScreen} />
      <Tabs.Screen name="Profile" component={ProfileScreen} />
    </Tabs.Navigator>
  );
}

function WorkerTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Dashboard" component={WorkerDashboardScreen} />
      <Tabs.Screen name="Tasks" component={WorkerTasksScreen} />
    </Tabs.Navigator>
  );
}

function AdminTabs() {
  return (
    <Tabs.Navigator screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Dashboard" component={AdminDashboardScreen} />
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
  const scheme = useColorScheme();
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
        <Stack.Screen name="Worker" component={WorkerTabs} />
      ) : (
        <Stack.Screen name="Admin" component={AdminTabs} />
      )}
    </Stack.Navigator>
  );
}
