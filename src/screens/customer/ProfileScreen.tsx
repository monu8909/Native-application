import React from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

import { useAuthStore } from "../../store/authStore";

/* ─── helpers ─── */
function getInitials(name?: string) {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

/* ─── reusable row ─── */
interface MenuRowProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  danger?: boolean;
}
function MenuRow({ icon, label, onPress, danger }: MenuRowProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[styles.menuRow, danger && styles.menuRowDanger]}
    >
      <View style={styles.menuLeft}>
        {icon}
        <Text style={[styles.menuLabel, danger && styles.menuLabelDanger]}>
          {label}
        </Text>
      </View>
      <Feather
        name="chevron-right"
        size={18}
        color={danger ? "#E74C3C" : "rgba(255,255,255,0.4)"}
      />
    </TouchableOpacity>
  );
}

/* ─── info row ─── */
function InfoRow({ icon, value }: { icon: React.ReactNode; value: string }) {
  return (
    <View style={styles.infoRow}>
      {icon}
      <Text style={styles.infoText}>{value}</Text>
    </View>
  );
}

/* ─── screen ─── */
export function ProfileScreen() {
  const { user, clear } = useAuthStore();

  const name = user?.name ?? "User Name";
  const phone = user?.phone ? `+91 ${user.phone}` : "+91 98765 43210";
  const email = user?.email ?? "user@example.com";
  const initials = getInitials(user?.name);

  function handleLogout() {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => void clear() },
    ]);
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* ── Page title ── */}
        <View style={styles.titleBlock}>
          <Text style={styles.pageTitle}>Profile</Text>
          <Text style={styles.pageSubtitle}>Manage your account</Text>
        </View>

        {/* ── Profile card ── */}
        <LinearGradient
          colors={["#2D2F6E", "#1A1A4E"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.profileCard}
        >
          {/* avatar + name row */}
          <View style={styles.avatarRow}>
            <LinearGradient
              colors={["#5B6BF9", "#3B82F6"]}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>{initials}</Text>
            </LinearGradient>
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{name}</Text>
              <Text style={styles.userRole}>Premium Member</Text>
            </View>
            <TouchableOpacity style={styles.editBtn} activeOpacity={0.7}>
              <Feather name="edit-2" size={15} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>

          {/* divider */}
          <View style={styles.divider} />

          {/* contact info */}
          <InfoRow
            icon={<Feather name="phone" size={15} color="rgba(255,255,255,0.55)" style={styles.infoIcon} />}
            value={phone}
          />
          <InfoRow
            icon={<Feather name="mail" size={15} color="rgba(255,255,255,0.55)" style={styles.infoIcon} />}
            value={email}
          />
          <InfoRow
            icon={<Feather name="map-pin" size={15} color="rgba(255,255,255,0.55)" style={styles.infoIcon} />}
            value="Gurgaon, India"
          />
        </LinearGradient>

        {/* ── Menu rows ── */}
        <View style={styles.menuBlock}>
          <MenuRow
            icon={
              <MaterialCommunityIcons
                name="cog-outline"
                size={20}
                color="rgba(255,255,255,0.7)"
                style={styles.menuIcon}
              />
            }
            label="Settings"
          />
        </View>

        <View style={styles.menuBlock}>
          <MenuRow
            icon={
              <MaterialCommunityIcons
                name="logout"
                size={20}
                color="#E74C3C"
                style={styles.menuIcon}
              />
            }
            label="Logout"
            onPress={handleLogout}
            danger
          />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },

  /* title */
  titleBlock: {
    marginBottom: 22,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  pageSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.45)",
    marginTop: 3,
  },

  /* profile card */
  profileCard: {
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
  },
  avatarRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
    color: "#fff",
  },
  userName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#fff",
  },
  userRole: {
    fontSize: 12,
    color: "rgba(255,255,255,0.55)",
    marginTop: 2,
  },
  editBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginBottom: 14,
  },

  /* info rows */
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoIcon: {
    marginRight: 12,
    width: 18,
  },
  infoText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.75)",
  },

  /* menu */
  menuBlock: {
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
  },
  menuRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  menuRowDanger: {},
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuIcon: {},
  menuLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },
  menuLabelDanger: {
    color: "#E74C3C",
  },
});
