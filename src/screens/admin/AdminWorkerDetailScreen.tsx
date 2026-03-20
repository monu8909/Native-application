import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchWorkerStats } from "../../services/queries";
import { recordWorkerPayment } from "../../services/mutations";
import { LinearGradient } from "expo-linear-gradient";

const { width: SCREEN_W } = Dimensions.get("window");

export function AdminWorkerDetailScreen({ route, navigation }: any) {
  const { workerId } = route.params;
  const qc = useQueryClient();

  const [payModalVisible, setPayModalVisible] = useState(false);
  const [payAmount, setPayAmount] = useState("");
  const [payNotes, setPayNotes] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin", "worker", workerId, "stats"],
    queryFn: () => fetchWorkerStats(workerId),
  });

  const payMutation = useMutation({
    mutationFn: (input: { amount: number; notes: string }) =>
      recordWorkerPayment(workerId, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "worker", workerId, "stats"] });
      setPayModalVisible(false);
      setPayAmount("");
      setPayNotes("");
      Alert.alert("Success", "Payment recorded successfully");
    },
    onError: (err: any) => {
      Alert.alert("Error", err?.message || "Failed to record payment");
    },
  });

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#5B6BF9" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: "#fff" }}>Error loading worker details</Text>
      </View>
    );
  }

  const { worker, stats, payments, attendanceHistory } = data;

  const handlePay = () => {
    const amt = parseFloat(payAmount);
    if (isNaN(amt) || amt <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount");
      return;
    }
    payMutation.mutate({ amount: amt, notes: payNotes });
  };

  const renderAttendanceCalendar = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const monthName = date.toLocaleString("default", { month: "long" });
    const days = [];
    while (date.getMonth() === month) {
      const dStr = date.toISOString().split("T")[0];
      const record = attendanceHistory?.find((a: any) => a.date.split("T")[0] === dStr);
      days.push({ day: date.getDate(), status: record?.status || "none" });
      date.setDate(date.getDate() + 1);
    }

    return (
      <View style={styles.calendarMonth}>
        <Text style={styles.calendarMonthTitle}>{monthName} {year}</Text>
        <View style={styles.calendarGrid}>
          {days.map((d, i) => (
            <View 
              key={i} 
              style={[
                styles.calendarDay, 
                d.status === "present" ? styles.bgGreenLight : d.status === "leave" ? styles.bgRedLight : styles.bgNone
              ]}
            >
              <Text style={[styles.calendarDayText, d.status !== "none" && { color: "#fff" }]}>{d.day}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Worker Details</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Card */}
        <LinearGradient colors={["#1A1A2E", "#16213E"]} style={styles.profileCard}>
          <View style={styles.profileInfo}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarText}>{worker.name?.[0]?.toUpperCase() || "W"}</Text>
            </View>
            <View style={{ marginLeft: 16, flex: 1 }}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <Text style={styles.workerSub}>{worker.phone}</Text>
              <Text style={styles.workerSub}>Code: {worker.workerProfile?.employeeCode || "N/A"}</Text>
            </View>
            <View style={[styles.statusBadge, worker.isActive ? styles.bgGreen : styles.bgGray]}>
              <Text style={styles.statusText}>{worker.isActive ? "Active" : "Inactive"}</Text>
            </View>
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Total Services</Text>
              <Text style={styles.statValue}>{stats.tasksCount}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Present Days</Text>
              <Text style={styles.statValue}>{stats.attendanceDays}</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>Daily Wage</Text>
              <Text style={styles.statValue}>₹{worker.dailyWage || 0}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* Financial Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Financial Summary</Text>
          <View style={styles.glassCard}>
            <View style={styles.financeRow}>
              <Text style={styles.financeLabel}>Total Earned</Text>
              <Text style={styles.financeValue}>₹{stats.totalEarned}</Text>
            </View>
            <View style={styles.financeRow}>
              <Text style={styles.financeLabel}>Total Paid</Text>
              <Text style={[styles.financeValue, { color: "#27AE60" }]}>₹{stats.totalPaid}</Text>
            </View>
            
            {stats.advance > 0 && (
              <View style={[styles.financeRow, { backgroundColor: "rgba(91, 107, 249, 0.1)", padding: 8, borderRadius: 8, marginTop: 8 }]}>
                <Text style={[styles.financeLabel, { color: "#5B6BF9", fontWeight: "700" }]}>Advance Taken</Text>
                <Text style={[styles.financeValue, { color: "#5B6BF9", fontWeight: "700" }]}>₹{stats.advance}</Text>
              </View>
            )}

            <View style={[styles.financeRow, { borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", paddingTop: 12, marginTop: 12 }]}>
              <Text style={styles.financeLabelBold}>Remaining Balance</Text>
              <Text style={styles.financeValueBold}>₹{stats.balance}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.payNowBtn}
              onPress={() => setPayModalVisible(true)}
            >
              <Feather name="dollar-sign" size={18} color="#fff" />
              <Text style={styles.payNowText}>Pay Money to Worker</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Attendance Calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attendance Calendar</Text>
          <View style={styles.glassCard}>
            {renderAttendanceCalendar(currentYear, currentMonth)}
            <View style={{ height: 20 }} />
            {renderAttendanceCalendar(lastMonthYear, lastMonth)}
            
            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.bgGreen]} />
                <Text style={styles.legendText}>Present</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.bgRed]} />
                <Text style={styles.legendText}>Leave</Text>
              </View>
            </View>
          </View>
        </View>


        {/* Payment History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {payments.length === 0 ? (
            <Text style={styles.emptyText}>No payment history found.</Text>
          ) : (
            payments.map((p: any) => (
              <View key={p._id} style={styles.historyItem}>
                <View style={styles.historyIcon}>
                   <Feather name="arrow-up-right" size={20} color="#27AE60" />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.historyAmount}>₹{p.amount}</Text>
                  <Text style={styles.historyDate}>{new Date(p.paymentDate).toLocaleDateString()} • {p.method}</Text>
                  {p.notes && <Text style={styles.historyNote}>{p.notes}</Text>}
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Pay Modal */}
      <Modal
        visible={payModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setPayModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Record Payment</Text>
              <TouchableOpacity onPress={() => setPayModalVisible(false)}>
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>Amount (₹)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter amount"
              placeholderTextColor="rgba(255,255,255,0.3)"
              keyboardType="numeric"
              value={payAmount}
              onChangeText={setPayAmount}
            />

            <Text style={styles.inputLabel}>Notes</Text>
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="Add payment notes..."
              placeholderTextColor="rgba(255,255,255,0.3)"
              multiline
              value={payNotes}
              onChangeText={setPayNotes}
            />

            <TouchableOpacity 
              style={styles.confirmBtn}
              onPress={handlePay}
              disabled={payMutation.isPending}
            >
              {payMutation.isPending ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.confirmBtnText}>Confirm Payment</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F0F1E" },
  centered: { flex: 1, backgroundColor: "#0F0F1E", justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 60,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  backBtn: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  scrollContent: { padding: 20, paddingBottom: 40 },
  
  profileCard: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  profileInfo: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#5B6BF9",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontSize: 28, fontWeight: "700" },
  workerName: { color: "#fff", fontSize: 22, fontWeight: "700" },
  workerSub: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 2 },
  
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  bgGreen: { backgroundColor: "#27AE60" },
  bgRed: { backgroundColor: "#E74C3C" },
  bgGray: { backgroundColor: "#444" },
  bgGreenLight: { backgroundColor: "rgba(39, 174, 96, 0.8)" },
  bgRedLight: { backgroundColor: "rgba(231, 76, 60, 0.8)" },
  bgNone: { backgroundColor: "rgba(255,255,255,0.05)" },
  
  calendarMonth: { marginBottom: 10 },
  calendarMonthTitle: { color: "rgba(255,255,255,0.7)", fontSize: 14, fontWeight: "600", marginBottom: 12 },
  calendarGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  calendarDay: {
    width: (SCREEN_W - 100) / 7,
    aspectRatio: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarDayText: { color: "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: "600" },
  calendarLegend: { flexDirection: "row", marginTop: 20, gap: 16, borderTopWidth: 1, borderTopColor: "rgba(255,255,255,0.1)", paddingTop: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendText: { color: "rgba(255,255,255,0.5)", fontSize: 12 },

  statsGrid: { flexDirection: "row", justifyContent: "space-between", gap: 12 },

  statBox: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: 12,
    alignItems: "center",
  },
  statLabel: { color: "rgba(255,255,255,0.4)", fontSize: 10, fontWeight: "600", marginBottom: 4, textAlign: "center" },
  statValue: { color: "#fff", fontSize: 16, fontWeight: "700" },

  section: { marginBottom: 24 },
  sectionTitle: { color: "#fff", fontSize: 18, fontWeight: "700", marginBottom: 16 },
  glassCard: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  financeRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  financeLabel: { color: "rgba(255,255,255,0.6)", fontSize: 15 },
  financeValue: { color: "#fff", fontSize: 16, fontWeight: "600" },
  financeLabelBold: { color: "#fff", fontSize: 16, fontWeight: "700" },
  financeValueBold: { color: "#5B6BF9", fontSize: 20, fontWeight: "800" },
  
  payNowBtn: {
    backgroundColor: "#5B6BF9",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 20,
    gap: 8,
  },
  payNowText: { color: "#fff", fontSize: 16, fontWeight: "700" },

  historyItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  historyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(39, 174, 96, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  historyAmount: { color: "#fff", fontSize: 16, fontWeight: "700" },
  historyDate: { color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 2 },
  historyNote: { color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 4, fontStyle: "italic" },
  emptyText: { color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: 20 },

  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.8)", justifyContent: "center", padding: 20 },
  modalContent: { backgroundColor: "#1A1A2E", borderRadius: 24, padding: 24, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  modalTitle: { color: "#fff", fontSize: 20, fontWeight: "700" },
  inputLabel: { color: "rgba(255,255,255,0.6)", fontSize: 14, marginBottom: 8, marginLeft: 4 },
  input: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 14,
    color: "#fff",
    fontSize: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  confirmBtn: {
    backgroundColor: "#27AE60",
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
  },
  confirmBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
