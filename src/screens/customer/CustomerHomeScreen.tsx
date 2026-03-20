import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useQuery } from "@tanstack/react-query";
import { useMyBookings } from "../../hooks/useBookings";
import { useServices } from "../../hooks/useServices";
import { fetchDesigns, fetchGallery } from "../../services/queries";
import { useAuthStore } from "../../store/authStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const SERVICE_ICONS: Record<string, { icon: string; lib: "feather" | "mci"; bg: string }> = {
  wall_design: { icon: "brush",        lib: "mci", bg: "#5B6BF9" },
  pop:         { icon: "ceiling-light",lib: "mci", bg: "#9B59B6" },
  putty:       { icon: "sofa",         lib: "mci", bg: "#3498DB" },
  ceiling:     { icon: "lightbulb-on", lib: "mci", bg: "#F39C12" },
  other:       { icon: "tools",        lib: "mci", bg: "#c8ccca" },
};

const SERVICE_LABELS: Record<string, string> = {
  wall_design: "Wall Design",
  pop:         "POP Ceiling",
  putty:       "Furniture",
  ceiling:     "Lighting",
  other:       "Other",
};



const STATUS_COLORS: Record<string, string> = {
  pending:     "#F39C12",
  assigned:    "#3498DB",
  in_progress: "#9B59B6",
  completed:   "#27AE60",
  cancelled:   "#E74C3C",
};

function StatusBadge({ status }: { status: string }) {
  const key = status.toLowerCase().replace(" ", "_");
  const color = STATUS_COLORS[key] ?? "#5B6BF9";
  const label = status
    .replace("_", " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return (
    <View style={[styles.badge, { backgroundColor: color + "33", borderColor: color }]}>
      <Text style={[styles.badgeText, { color }]}>{label}</Text>
    </View>
  );
}

export function CustomerHomeScreen({ navigation }: any) {
  const { user } = useAuthStore();
  const bookingsQuery = useMyBookings();
  const servicesQuery = useServices();
  const designsQuery = useQuery({ queryKey: ["designs"], queryFn: fetchDesigns });
  const galleryQuery = useQuery({ queryKey: ["gallery"], queryFn: fetchGallery });
  const [search, setSearch] = useState("");

  const firstName = user?.name?.split(" ")[0] ?? "User";
  const recentBookings = bookingsQuery.data?.slice(0, 3) ?? [];
  const services = servicesQuery.data ?? [];
  const designs = designsQuery.data ?? [];
  const galleryItems = galleryQuery.data ?? [];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header ── */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.greeting}>
              Hello, {firstName} 👋
            </Text>
            <Text style={styles.subtitle}>Lets design your dream space</Text>
          </View>
          <TouchableOpacity style={styles.notifBtn} activeOpacity={0.7}>
            <Feather name="bell" size={20} color="#fff" />
            <View style={styles.notifDot} />
          </TouchableOpacity>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchWrap}>
          <Feather name="search" size={16} color="rgba(255,255,255,0.35)" style={{ marginRight: 8 }} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search for services..."
            placeholderTextColor="rgba(255,255,255,0.35)"
            style={styles.searchInput}
          />
        </View>

        {/* ── Popular Services ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Services</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}  onPress={() => navigation.navigate("Services")}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.servicesGrid}>
          {services.map((s, index) => {

            const meta = SERVICE_ICONS[s._id] ?? SERVICE_ICONS["other"];
            const label = SERVICE_LABELS[s._id] ?? s.title;
            const imagesURl = s?.image
            return (
              <TouchableOpacity
                key={`service-${index}`}
                style={styles.serviceItem}
                activeOpacity={0.8}
                onPress={() => navigation.getParent()?.navigate("Booking", { serviceType: s._id })}
              >
                <LinearGradient
                  colors={[meta.bg, meta.bg + "AA"]}
                  style={styles.serviceIcon}
                >
                  <Image source={{uri:imagesURl}} style={styles.servicesimages}/>
                </LinearGradient>
                <Text style={styles.serviceLabel}>{label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Featured Designs ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Designs</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        >
          {designsQuery.isLoading ? (
            <Text style={{ color: "#fff", marginLeft: 20 }}>Loading designs...</Text>
          ) : designs.length === 0 ? (
            <Text style={{ color: "rgba(255,255,255,0.5)", marginLeft: 20 }}>No designs available.</Text>
          ) : (
            designs.map((d: any) => (
              <TouchableOpacity key={d?._id} style={styles.featuredCard} activeOpacity={0.85}>
                <Image source={{ uri: d?.imageUrl }} style={styles.featuredImage} />
                <View style={styles.ratingBadge}>
                  <Feather name="star" size={11} color="#F39C12" />
                  <Text style={styles.ratingText}>New</Text>
                </View>
                <View style={styles.featuredInfo}>
                  <Text style={styles.featuredTitle} numberOfLines={1}>{d?.title || "Untitled Design"}</Text>
                  {!!d?.description && <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }} numberOfLines={1}>{d?.description}</Text>}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* ── Gallery ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gallery</Text>
          <TouchableOpacity activeOpacity={0.7}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.galleryList}
        >
          {galleryQuery.isLoading ? (
            <ActivityIndicator color="#5B6BF9" style={{ marginLeft: 20 }} />
          ) : galleryItems.length === 0 ? (
            <Text style={{ color: "rgba(255,255,255,0.5)", marginLeft: 20 }}>No images yet.</Text>
          ) : (
            galleryItems.map((d: any) => (
              <TouchableOpacity key={`gallery-${d?._id}`} style={styles.galleryItem} activeOpacity={0.9}>
                <Image source={{ uri: d?.imageUrl }} style={styles.galleryImage} />
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* ── Recent Bookings ── */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Bookings</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Bookings")}>
            <Text style={styles.seeAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {bookingsQuery.isLoading ? (
          [1, 2].map((k) => <View key={k} style={styles.skeletonCard} />)
        ) : recentBookings.length === 0 ? (
          <View style={styles.emptyBooking}>
            <MaterialCommunityIcons name="calendar-blank-outline" size={36} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptyText}>No bookings yet</Text>
          </View>
        ) : (
          recentBookings.map((b) => (
            <View key={b?._id} style={styles.bookingCard}>
              <View style={styles.bookingLeft}>
                <View style={styles.bookingIconWrap}>
                  <MaterialCommunityIcons name="brush" size={20} color="#5B6BF9" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bookingTitle}>
                    {b?.serviceType 
                      ? b?.serviceType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) 
                      : "Requested Service"}
                  </Text>
                  <View style={styles.bookingMeta}>
                    <Feather name="clock" size={11} color="rgba(255,255,255,0.45)" />
                    <Text style={styles.bookingDate}>
                      {" "}
                      {new Date(b?.scheduledAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </Text>
                  </View>
                </View>
              </View>
              <StatusBadge status={b?.status} />
            </View>
          ))
        )}

        {/* bottom padding for floating tab bar */}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  /* header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.50)",
    marginTop: 2,
  },
  notifBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#1A1A2E",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#5B6BF9",
    borderWidth: 1.5,
    borderColor: "#0D0D1A",
  },
  /* search */
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginBottom: 28,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  /* sections */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  seeAll: {
    fontSize: 13,
    color: "#5B6BF9",
    fontWeight: "600",
  },
  /* services grid */
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 28,
  },
  serviceItem: {
    width: (SCREEN_WIDTH - 40 - 36) / 4,
    alignItems: "center",
    gap: 8,
  },
  serviceIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  serviceLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    textAlign: "center",
    fontWeight: "500",
  },
  /* featured */
  featuredList: {
    paddingBottom: 4,
    gap: 14,
    marginBottom: 28,
  },
  featuredCard: {
    width: 180,
    borderRadius: 18,
    backgroundColor: "#1A1A2E",
    overflow: "hidden",
  },
  featuredImage: {
    width: "100%",
    height: 130,
    resizeMode: "cover",
  },
  ratingBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.55)",
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    gap: 3,
  },
  ratingText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "700",
  },
  featuredInfo: {
    padding: 12,
  },
  featuredTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  featuredPrice: {
    fontSize: 13,
    color: "#5B6BF9",
    fontWeight: "700",
  },
  /* bookings */
  bookingCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#1A1A2E",
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  bookingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  bookingIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#5B6BF922",
    alignItems: "center",
    justifyContent: "center",
  },
  bookingTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 3,
  },
  bookingMeta: {
    flexDirection: "row",
    alignItems: "center",
  },
  bookingDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.45)",
  },
  /* badge */
  badge: {
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderWidth: 1,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  /* skeleton */
  skeletonCard: {
    height: 72,
    borderRadius: 16,
    backgroundColor: "#1A1A2E",
    marginBottom: 12,
    opacity: 0.6,
  },
  /* empty */
  emptyBooking: {
    alignItems: "center",
    paddingVertical: 28,
    gap: 8,
  },
  emptyText: {
    color: "rgba(255,255,255,0.30)",
    fontSize: 13,
  },
  servicesimages:{
    height:50,
    width:50,
    borderRadius:50,
    resizeMode:"cover"
  },
  /* gallery */
  galleryList: {
    paddingBottom: 4,
    gap: 10,
    marginBottom: 28,
  },
  galleryItem: {
    width: 100,
    height: 100,
    borderRadius: 14,
    backgroundColor: "#1A1A2E",
    overflow: "hidden",
  },
  galleryImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
