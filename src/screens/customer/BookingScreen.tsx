import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import { useCreateBooking } from "../../hooks/useBookings";

const { width: SCREEN_W } = Dimensions.get("window");

/* ─── service metadata map ─────────────────────────────────────────────── */
const SERVICE_META: Record<
  string,
  {
    label: string;
    subtitle: string;
    description: string;
    price: number;
    rating: string;
    reviews: number;
    image: string;
  }
> = {
  wall_design: {
    label: "Modern Living Room Design",
    subtitle: "Wall Design",
    description:
      "Transform your living space with our expert interior design services. We provide complete consultation, 3D visualization, and professional execution.",
    price: 23600,
    rating: "4.9",
    reviews: 734,
    image:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=80",
  },
  pop: {
    label: "Elegant POP Ceiling",
    subtitle: "POP Ceiling",
    description:
      "Premium false ceiling solutions with cove lighting, intricate pop patterns and expert finishing to give your room a luxurious feel.",
    price: 18500,
    rating: "4.8",
    reviews: 519,
    image:
      "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=800&q=80",
  },
  putty: {
    label: "Premium Wall Putty Finish",
    subtitle: "Putty & Polish",
    description:
      "Smooth premium putty application with professional grade polish for a flawless crack-free finish that lasts for years.",
    price: 9500,
    rating: "4.7",
    reviews: 412,
    image:
      "https://images.unsplash.com/photo-1631889993959-41b4e9c6e3c5?w=800&q=80",
  },
  ceiling: {
    label: "Modern Ceiling Design",
    subtitle: "Ceiling",
    description:
      "Creative and contemporary ceiling designs including coffered, tray and gypsum ceilings to elevate your interiors.",
    price: 15000,
    rating: "4.8",
    reviews: 311,
    image:
      "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&q=80",
  },
  other: {
    label: "Custom Interior Service",
    subtitle: "Custom",
    description:
      "Tailored interior solutions designed to meet your unique requirements with quality materials and expert craftsmanship.",
    price: 12000,
    rating: "4.6",
    reviews: 198,
    image:
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80",
  },
};

const FEATURES = [
  { icon: "account-group", label: "Expert Team" },
  { icon: "shield-check", label: "1 Year Warranty" },
  { icon: "timer-outline", label: "7 Days Work" },
];

const TIME_SLOTS = [
  "09:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "02:00 PM", "03:00 PM",
  "04:00 PM", "05:00 PM",
];

/* ─── screen ────────────────────────────────────────────────────────────── */
export function BookingScreen({ route, navigation }: any) {
  const serviceType = (route?.params?.serviceType ?? "wall_design") as string;
  const meta = SERVICE_META[serviceType] ?? SERVICE_META["other"];
  const ServiceId= route?.params?.serviceID;
  // console.log("ServiceId",ServiceId)

  const [line1, setLine1] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [pickedDate, setPickedDate] = useState<Date>(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const create = useCreateBooking();

  function onDateChange(_: DateTimePickerEvent, selected?: Date) {
    // On Android the picker closes itself after selection
    if (Platform.OS === "android") setShowPicker(false);
    if (selected) setPickedDate(selected);
  }

  async function handleConfirm() {
    if (!line1.trim() || !city.trim() || !state.trim()) {
      Toast.show({ type: "error", text1: "Missing fields", text2: "Please fill address details." });
      return;
    }
    const scheduledAt = pickedDate.toISOString();
// console.log("serviceType90---->",serviceType)
    await create.mutateAsync({
      serviceID:ServiceId,
      address: { line1: line1.trim(), city: city.trim(), state: state.trim() },
      scheduledAt,
      description: description.trim() || undefined,
    });
    Toast.show({ type: "success", text1: "Booking Confirmed! 🎉", text2: "We'll get back to you shortly." });
    navigation.goBack();
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

          {/* ── hero image ── */}
          <View style={styles.heroWrap}>
            <Image source={{ uri: meta.image }} style={styles.heroImage} />

            {/* top gradient + back button */}
            <LinearGradient
              colors={["rgba(0,0,0,0.55)", "transparent"]}
              style={styles.heroTopGrad}
            >
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => navigation.goBack()}
                activeOpacity={0.7}
              >
                <Feather name="arrow-left" size={20} color="#fff" />
              </TouchableOpacity>
            </LinearGradient>

            {/* bottom gradient fade into background */}
            <LinearGradient
              colors={["transparent", "#0D0D1A"]}
              style={styles.heroBottomGrad}
            />
          </View>

          <View style={styles.body}>
            {/* title + rating */}
            <Text style={styles.serviceTitle}>{meta.label}</Text>
            <View style={styles.ratingRow}>
              <Feather name="star" size={14} color="#F39C12" />
              <Text style={styles.ratingText}>
                {meta.rating} ({meta.reviews} reviews)
              </Text>
            </View>

            {/* ── Service Details card ── */}
            <View style={styles.detailCard}>
              <Text style={styles.cardHeading}>Service Details</Text>
              <Text style={styles.detailDesc}>{meta.description}</Text>

              {/* feature pills */}
              <View style={styles.featuresRow}>
                {FEATURES.map((f) => (
                  <View key={f.label} style={styles.featurePill}>
                    <MaterialCommunityIcons
                      name={f.icon as any}
                      size={22}
                      color="#5B6BF9"
                    />
                    <Text style={styles.featureLabel}>{f.label}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* ── Select Date ── */}
            <View style={styles.detailCard}>
              <View style={styles.cardRow}>
                <MaterialCommunityIcons
                  name="calendar-today"
                  size={18}
                  color="#5B6BF9"
                />
                <Text style={styles.cardHeading}>  Select Date</Text>
              </View>

              {/* pressable display row */}
              <TouchableOpacity
                style={styles.dateRow}
                onPress={() => setShowPicker(true)}
                activeOpacity={0.75}
              >
                <Feather name="calendar" size={15} color="rgba(255,255,255,0.55)" />
                <Text style={styles.dateText}>
                  {pickedDate.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </Text>
                <Feather name="chevron-down" size={15} color="rgba(255,255,255,0.35)" />
              </TouchableOpacity>

              {/* native picker */}
              {showPicker && (
                <DateTimePicker
                  value={pickedDate}
                  mode="date"
                  display={Platform.OS === "ios" ? "inline" : "default"}
                  minimumDate={new Date()}
                  onChange={onDateChange}
                  themeVariant="dark"
                  accentColor="#5B6BF9"
                />
              )}

              {/* iOS done button */}
              {showPicker && Platform.OS === "ios" && (
                <TouchableOpacity
                  style={styles.pickerDoneBtn}
                  onPress={() => setShowPicker(false)}
                >
                  <Text style={styles.pickerDoneText}>Done</Text>
                </TouchableOpacity>
              )}
            </View>

            {/* ── Select Time Slot ── */}
            <View style={styles.detailCard}>
              <View style={styles.cardRow}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={18}
                  color="#5B6BF9"
                />
                <Text style={styles.cardHeading}>  Select Time Slot</Text>
              </View>
              <View style={styles.slotsGrid}>
                {TIME_SLOTS.map((slot) => {
                  const active = slot === selectedSlot;
                  return (
                    <TouchableOpacity
                      key={slot}
                      style={[styles.slotChip, active && styles.slotChipActive]}
                      onPress={() => setSelectedSlot(slot)}
                      activeOpacity={0.75}
                    >
                      <Text
                        style={[styles.slotText, active && styles.slotTextActive]}
                      >
                        {slot}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* ── Address ── */}
            <View style={styles.detailCard}>
              <View style={styles.cardRow}>
                <MaterialCommunityIcons
                  name="map-marker-outline"
                  size={18}
                  color="#5B6BF9"
                />
                <Text style={styles.cardHeading}>  Address Details</Text>
              </View>
              <AddressInput
                placeholder="House no, area, street"
                value={line1}
                onChangeText={setLine1}
              />
              <AddressInput
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />
              <AddressInput
                placeholder="State"
                value={state}
                onChangeText={setState}
              />
              <AddressInput
                placeholder="Additional notes (optional)"
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            {/* ── Confirm button ── */}
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={handleConfirm}
              disabled={create.isPending}
              style={{ marginBottom: 110, marginTop: 6 }}
            >
              <LinearGradient
                colors={["#5B6BF9", "#7B4FE9"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.confirmBtn}
              >
                {create.isPending ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmText}>
                    Confirm Booking — ₹{meta.price.toLocaleString("en-IN")}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* ─── helper input ───────────────────────────────────────────────────────── */
function AddressInput({
  placeholder,
  value,
  onChangeText,
  multiline,
}: {
  placeholder: string;
  value: string;
  onChangeText: (t: string) => void;
  multiline?: boolean;
}) {
  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="rgba(255,255,255,0.30)"
      multiline={multiline}
      style={[styles.addressInput, multiline && { height: 72, textAlignVertical: "top" }]}
    />
  );
}

/* ─── styles ─────────────────────────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0D0D1A" },

  /* hero */
  heroWrap: { width: SCREEN_W, height: 280, position: "relative" },
  heroImage: { width: "100%", height: "100%", resizeMode: "cover" },
  heroTopGrad: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    paddingTop: 12,
    paddingLeft: 16,
    justifyContent: "flex-start",
    zIndex: 2,
  },
  heroBottomGrad: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    zIndex: 2,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* body */
  body: { paddingHorizontal: 20, paddingTop: 4 },

  serviceTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#fff",
    lineHeight: 30,
    marginBottom: 6,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 18 },
  ratingText: { fontSize: 13, color: "rgba(255,255,255,0.65)", fontWeight: "500" },

  /* cards */
  detailCard: {
    backgroundColor: "#1A1A2E",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  cardRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardHeading: { fontSize: 15, fontWeight: "700", color: "#fff" },
  detailDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.60)",
    lineHeight: 20,
    marginBottom: 16,
  },

  /* features */
  featuresRow: { flexDirection: "row", gap: 10 },
  featurePill: {
    flex: 1,
    backgroundColor: "#0D0D1A",
    borderRadius: 14,
    alignItems: "center",
    paddingVertical: 12,
    gap: 6,
  },
  featureLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    textAlign: "center",
    fontWeight: "600",
  },

  /* date */
  dateInput: {
    backgroundColor: "#0D0D1A",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
    marginTop: 4,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0D0D1A",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginTop: 4,
  },
  dateText: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
    marginLeft: 10,
  },
  pickerDoneBtn: {
    backgroundColor: "#5B6BF9",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 10,
  },
  pickerDoneText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "700",
  },

  /* time slots */
  slotsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 4,
  },
  slotChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: "#0D0D1A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  slotChipActive: {
    backgroundColor: "#5B6BF9",
    borderColor: "#5B6BF9",
  },
  slotText: { fontSize: 13, color: "rgba(255,255,255,0.55)", fontWeight: "600" },
  slotTextActive: { color: "#fff" },

  /* address */
  addressInput: {
    backgroundColor: "#0D0D1A",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: "#fff",
    fontSize: 14,
    marginTop: 10,
  },

  /* confirm */
  confirmBtn: {
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#fff",
    letterSpacing: 0.3,
  },
});
