import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator, Alert,
  Dimensions, Image,
  Modal,
  ScrollView, StatusBar, StyleSheet, Text,
  TextInput,
  TouchableOpacity, View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { api } from "../../services/apiClient";
import { markWorkerAttendance, updateAdminBookingStatus, uploadDesign, uploadGalleryImage } from "../../services/mutations";
import {
  fetchAdminBookings,
  fetchAdminDashboard,
  fetchAdminPayments,
  fetchAdminWorkers,
  fetchDesigns,
  fetchGallery
} from "../../services/queries";
import { useAuthStore } from "../../store/authStore";

function getInitials(name?: string) {
  if (!name) return "A";
  const parts = name.trim().split(" ");
  return parts.length >= 2
    ? (parts[0][0] + parts[1][0]).toUpperCase()
    : parts[0][0].toUpperCase();
}

const { width: SCREEN_W } = Dimensions.get("window");

export function AdminDashboardScreen({ navigation }: any) {
  const { user, clear } = useAuthStore();
  const [activeTab, setActiveTab] = useState("Dashboard");

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: () => void clear() },
    ]);
  };

  // State for Image Upload Modal
  const [modalVisible, setModalVisible] = useState(false);
  const [designTitle, setDesignTitle] = useState("");
  const [designDesc, setDesignDesc] = useState("");
  const [uploadType, setUploadType] = useState<"Design" | "Gallery">("Design");
  const [selectedImage, setSelectedImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [workerSearch, setWorkerSearch] = useState("");

  
  const qc = useQueryClient();

  // Queries
  const { data: dashboard, isLoading: dashLoading } = useQuery({ queryKey: ["admin", "dashboard"], queryFn: fetchAdminDashboard });
  const { data: bookingsData, isLoading: bookLoading } = useQuery({ queryKey: ["admin", "bookings"], queryFn: () => fetchAdminBookings(1, 100) });
  
  const { data: workersData, isLoading: workLoading } = useQuery({ queryKey: ["admin", "workers"], queryFn: () => fetchAdminWorkers(1, 100) });
 
  const { data: paymentsData, isLoading: payLoading } = useQuery({ queryKey: ["admin", "payments"], queryFn: () => fetchAdminPayments(1, 100) });
  const { data: designsData, isLoading: desLoading } = useQuery({ queryKey: ["designs"], queryFn: fetchDesigns });
  const { data: galleryData, isLoading: galLoading } = useQuery({ queryKey: ["gallery"], queryFn: fetchGallery });

  const uploadMutation = useMutation({
    mutationFn: uploadDesign,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["designs"] });
      setModalVisible(false);
      setSelectedImage(null);
      setDesignTitle("");
      setDesignDesc("");
    },
    onError: (err: any) => {
      Alert.alert("Upload Error", err?.message || "Something went wrong automatically");
    }
  });

  const uploadGalleryMutation = useMutation({
    mutationFn: uploadGalleryImage,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery"] });
      setModalVisible(false);
      setSelectedImage(null);
      setDesignTitle("");
      setDesignDesc("");
    },
    onError: (err: any) => {
      Alert.alert("Upload Error", err?.message || "Something went wrong");
    }
  });

  const deleteDesignMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/designs/${id}`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["designs"] })
  });

  const deleteGalleryMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await api.delete(`/api/gallery/${id}`);
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gallery"] })
  });

  const updateBookingStatusMutation = useMutation({
    mutationFn: updateAdminBookingStatus,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      qc.invalidateQueries({ queryKey: ["admin", "bookings"] });
    },
    onError: (err: any) => {
      Alert.alert("Update Error", err?.message || "Failed to update status");
    }
  });

  const markAttendanceMutation = useMutation({
    mutationFn: markWorkerAttendance,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin", "workers"] });
      Alert.alert("Success", "Attendance marked");
    },
    onError: (err: any) => {
      Alert.alert("Attendance Error", err?.message || "Failed to mark attendance");
    }
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0]);
    }
  };

  const handleUploadSubmit = () => {
    if (!selectedImage) {
      Alert.alert("Error", "Please select an image first");
      return;
    }
    const formData = new FormData() as any;
    formData.append("image", {
      uri: selectedImage.uri,
      name: `upload_${Date.now()}.jpg`,
      type: "image/jpeg",
    });
    if (designTitle.trim()) formData.append("title", designTitle);
    if (designDesc.trim()) formData.append("description", designDesc);

    if (uploadType === "Design") {
      uploadMutation.mutate(formData);
    } else {
      uploadGalleryMutation.mutate(formData);
    }
  };

  const renderDashboard = () => {
    if (dashLoading) return <ActivityIndicator size="large" color="#5B6BF9" style={{ marginTop: 40 }} />;

    const stats = [
      { id: "1", label: "Total Bookings", value: dashboard?.bookingsTotal || 0, icon: "calendar-check", color: "#F39C12" },
      { id: "2", label: "Active Workers", value: dashboard?.workersTotal || 0, icon: "account-hard-hat", color: "#27AE60" },
    ];

    const bookings = bookingsData?.items || [];
    const workers = workersData?.items || [];
    const designs = designsData || [];
 
console.log("v90---->",workersData);

    return (
      <> 
        {/* Analytics Grid */}
        <View style={styles.section}>
          <View style={styles.grid}>
            {stats.map((stat) => (
              <View key={stat.id} style={styles.statCard}>
                <View style={[styles.statIconWrap, { backgroundColor: stat.color + "22" }]}>
                  <MaterialCommunityIcons name={stat.icon as any} size={22} color={stat.color} />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Bookings Snapshot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Bookings</Text>
            <TouchableOpacity onPress={() => setActiveTab("Bookings")}><Text style={styles.seeAllText}>View All</Text></TouchableOpacity>
          </View>
          {bookings.slice(0, 3).map((b: any) => (
            <View key={b._id} style={styles.glassCard}>
              <View style={styles.bookingRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{b.serviceID?.name || "Requested Service"}</Text>
                  <Text style={styles.cardSubtitle}>{b.customer?.name} • {new Date(b.scheduledAt).toLocaleDateString()}</Text>
                </View>
                <View style={[styles.statusBadge, b.status === "pending" ? styles.bgYellow : b.status === "completed" ? styles.bgGreen : styles.bgBlue]}>
                  <Text style={[styles.statusText, b.status === "pending" ? styles.textYellow : b.status === "completed" ? styles.textGreen : styles.textBlue]}>{b.status}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Worker Snapshot */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
             <Text style={styles.sectionTitle}>Workers</Text>
             <TouchableOpacity onPress={() => setActiveTab("Workers")}><Text style={styles.seeAllText}>Manage</Text></TouchableOpacity>
          </View>
          {workers.slice(0, 2).map((w: any) => (
            <View key={w._id} style={styles.glassCard}> 
              <View style={styles.workerRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{w?.firstName} {w?.lastName}</Text>
                  <Text style={styles.cardSubtitle}>{w?.phone}</Text>
                  <Text style={styles.cardSubtitle}>{w?.role}</Text>
                </View>
                <View style={[styles.statusDot, w.isActive ? { backgroundColor: "#27AE60" } : { backgroundColor: "#7F8C8D" }]} />
                <Text style={styles.workerStatus}>{w.isActive ? "Active" : "Inactive"}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Design Gallery */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Design Gallery</Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}><Text style={styles.seeAllText}>Upload</Text></TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
            <TouchableOpacity style={styles.uploadCard} onPress={() => setModalVisible(true)}>
              <Feather name="plus" size={24} color="#5B6BF9" />
              <Text style={styles.uploadText}>Add Photo</Text>
            </TouchableOpacity>
            
            {desLoading && <ActivityIndicator color="#fff" />}
            {designs.map((img: any) => (
              <View key={img._id} style={styles.galleryCard}>
                <Image source={{ uri: img.imageUrl }} style={StyleSheet.absoluteFillObject} />
                <View style={styles.galleryOverlay}>
                  <TouchableOpacity onPress={() => {
                    Alert.alert("Delete", "Are you sure?", [
                      { text: "Cancel", style: "cancel" },
                      { text: "Delete", style: "destructive", onPress: () => deleteDesignMutation.mutate(img._id) }
                    ])
                  }}><Feather name="trash-2" size={16} color="#FFF" /></TouchableOpacity>
                </View>
                {!!img.title && (
                  <View style={{ position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "rgba(0,0,0,0.6)", padding: 4 }}>
                    <Text style={{ color: "#fff", fontSize: 10 }} numberOfLines={1}>{img.title}</Text>
                  </View>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </>
    );
  };

  const renderBookingsTab = () => {
    if (bookLoading) return <ActivityIndicator size="large" color="#5B6BF9" style={{ marginTop: 40 }} />;
    const bookings = bookingsData?.items || [];
 
    
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>All Bookings</Text>
        {bookings.map((b: any) => (
          <View key={b._id} style={styles.glassCard}>
            <View style={styles.bookingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{b.serviceID?.name || "Requested Service"}</Text>
                <Text style={styles.cardSubtitle}>{b.customer?.name} • {b.customer?.phone}</Text>
                <Text style={styles.cardSubtitle}>{new Date(b.scheduledAt).toLocaleString()}</Text>
              </View>
              <View style={[styles.statusBadge, b.status === "pending" ? styles.bgYellow : b.status === "completed" ? styles.bgGreen : styles.bgBlue]}>
                <Text style={[styles.statusText, b.status === "pending" ? styles.textYellow : b.status === "completed" ? styles.textGreen : styles.textBlue]}>{b.status}</Text>
              </View>
            </View>

            {/* Admin Actions */}
            <View style={styles.bookingActions}>
              {b.status === "pending" && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.bgYellow]}
                  onPress={() => updateBookingStatusMutation.mutate({ id: b._id, status: "confirmed" })}
                >
                  <Text style={[styles.actionBtnText, styles.textYellow]}>Confirm</Text>
                </TouchableOpacity>
              )}
              {b.status === "confirmed" && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.bgBlue]}
                  onPress={() => updateBookingStatusMutation.mutate({ id: b._id, status: "in_progress" })}
                >
                  <Text style={[styles.actionBtnText, styles.textBlue]}>Make Active</Text>
                </TouchableOpacity>
              )}
              {b.status === "in_progress" && (
                <TouchableOpacity
                  style={[styles.actionBtn, styles.bgGreen]}
                  onPress={() => updateBookingStatusMutation.mutate({ id: b._id, status: "completed" })}
                >
                  <Text style={[styles.actionBtnText, styles.textGreen]}>Complete</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderWorkersTab = () => {
    if (workLoading) return <ActivityIndicator size="large" color="#5B6BF9" style={{ marginTop: 40 }} />;
    let workers = workersData?.items || [];
    
    if (workerSearch.trim()) {
      const q = workerSearch.toLowerCase();
      workers = workers.filter((w: any) => 
        (w.name || `${w.firstName} ${w.lastName}`).toLowerCase().includes(q) ||
        (w.phone || "").includes(q)
      );
    }

    return (
      <View style={styles.section}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <Text style={styles.sectionTitle}>All Workers</Text>
        </View>

        <TextInput
          style={[styles.input, { marginBottom: 16, height: 48 }]}
          placeholder="Search workers by name or phone..."
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={workerSearch}
          onChangeText={setWorkerSearch}
        />

        {workers.length === 0 && (
          <Text style={{ color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: 20 }}>No workers found matching your search.</Text>
        )}

        {workers.map((w: any) => (
          <TouchableOpacity 
            key={w._id} 
            style={styles.glassCard}
            onPress={() => navigation.navigate("AdminWorkerDetail", { workerId: w._id })}
          >
            <View style={styles.workerRow}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                <Image source={{ uri: w.image || "https://i.pravatar.cc/150?u="+w._id }} style={styles.profilePicture} />
                <View>
                  <Text style={styles.cardTitle}>{w.name || `${w.firstName} ${w.lastName}`}</Text>
                  <Text style={styles.cardSubtitle}>{w.phone}</Text>
                  <Text style={[styles.cardSubtitle, { color: "#27AE60" }]}>₹{w.price || 0} / day</Text>
                </View>
              </View>
              <View style={{ alignItems: "flex-end",display:"flex",flexDirection:"row",gap:10 }}>
                <Text style={styles.workerStatus}>{w.isActive ? "Active" : "Inactive"}</Text>
                <View style={[styles.statusDot, w.isActive ? { backgroundColor: "#27AE60" } : { backgroundColor: "#7F8C8D" }]} />
              </View>
            </View>
            
            <View style={styles.workerActions}>
              <TouchableOpacity 
                style={[styles.attendBtn, { backgroundColor: "rgba(39, 174, 96, 0.15)" }]}
                onPress={() => markAttendanceMutation.mutate({ workerId: w._id, date: new Date().toISOString(), status: "present" })}
              >
                <Feather name="check-circle" size={14} color="#27AE60" />
                <Text style={[styles.attendBtnText, { color: "#27AE60" }]}>Present</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.attendBtn, { backgroundColor: "rgba(231, 76, 60, 0.15)" }]}
                onPress={() => markAttendanceMutation.mutate({ workerId: w._id, date: new Date().toISOString(), status: "leave" })}
              >
                <Feather name="x-circle" size={14} color="#E74C3C" />
                <Text style={[styles.attendBtnText, { color: "#E74C3C" }]}>Leave</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
 
  const renderPaymentsTab = () => {
    if (payLoading) return <ActivityIndicator size="large" color="#5B6BF9" style={{ marginTop: 40 }} />;
    const payments = paymentsData?.items || [];
    return (
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { marginBottom: 16 }]}>All Payments</Text>
        {payments.length === 0 && <Text style={{ color: "#fff", opacity: 0.6 }}>No payments found.</Text>}
        {payments.map((p: any) => (
          <View key={p._id} style={styles.glassCard}>
            <View style={styles.bookingRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>₹{p.amount}</Text>
                <Text style={styles.cardSubtitle}>{p.customer?.name} ({p.customer?.phone})</Text>
                <Text style={styles.cardSubtitle}>{p.booking?.serviceID?.name || "Requested Service"}</Text>
              </View>
              <View style={[styles.statusBadge, p.status === "pending" ? styles.bgYellow : p.status === "paid" ? styles.bgGreen : styles.bgBlue]}>
                <Text style={[styles.statusText, p.status === "pending" ? styles.textYellow : p.status === "paid" ? styles.textGreen : styles.textBlue]}>{p.status}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  };

  const renderGalleryTab = () => {
    if (galLoading) return <ActivityIndicator size="large" color="#5B6BF9" style={{ marginTop: 40 }} />;
    const items = galleryData || [];
    return (
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Gallery Items</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => { setUploadType("Gallery"); setModalVisible(true); }}>
            <Feather name="plus" size={16} color="#fff" />
            <Text style={styles.addBtnText}>Add Image</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.galleryGrid}>
          {items.map((item: any) => (
            <View key={item._id} style={styles.galleryCardItem}>
              <Image source={{ uri: item.imageUrl }} style={styles.galleryCardImage} />
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  Alert.alert("Delete", "Are you sure?", [
                    { text: "Cancel" },
                    { text: "Delete", style: "destructive", onPress: () => deleteGalleryMutation.mutate(item._id) }
                  ]);
                }}
              >
                <Feather name="trash-2" size={16} color="#E74C3C" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#050B14" />
      <LinearGradient colors={["#050B14", "#09091A", "#130A24"]} style={StyleSheet.absoluteFillObject} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
          <View style={styles.avatarMini}>
            <Text style={styles.avatarMiniText}>{getInitials(user?.name || "Admin")}</Text>
          </View>
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.headerTitle}>Hi, {user?.name || "Superadmin"} 👋</Text>
            <Text style={styles.headerSubtitle}>Manage your business efficiently</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.iconBtn} onPress={handleLogout}>
          <MaterialCommunityIcons name="logout" size={20} color="#E74C3C" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {activeTab === "Dashboard" && renderDashboard()}
        {activeTab === "Bookings" && renderBookingsTab()}
        {activeTab === "Workers" && renderWorkersTab()}
        {activeTab === "Payments" && renderPaymentsTab()}
        {activeTab === "Gallery" && renderGalleryTab()}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Bottom Navigation */}
      <View style={styles.bottomNav}>
        {["Dashboard", "Bookings", "Workers", "Payments", "Gallery"].map((tab) => {
          const isActive = activeTab === tab;
          let icon = "home";
          if (tab === "Bookings") icon = "calendar";
          if (tab === "Workers") icon = "users";
          if (tab === "Payments") icon = "credit-card";
          if (tab === "Gallery") icon = "image";

          return (
            <TouchableOpacity key={tab} style={styles.navItem} onPress={() => setActiveTab(tab)}>
              <Feather name={icon as any} size={20} color={isActive ? "#5B6BF9" : "rgba(255,255,255,0.4)"} />
              <Text style={[styles.navText, isActive && styles.navTextActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Upload Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Upload Design</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.imageSelector} onPress={pickImage}>
              {selectedImage ? (
                <Image source={{ uri: selectedImage.uri }} style={{ width: "100%", height: "100%", borderRadius: 12 }} />
              ) : (
                <>
                  <Feather name="image" size={32} color="rgba(255,255,255,0.5)" />
                  <Text style={{ color: "rgba(255,255,255,0.5)", marginTop: 8 }}>Select Image</Text>
                </>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Title (Optional)"
              placeholderTextColor="rgba(255,255,255,0.4)"
              value={designTitle}
              onChangeText={setDesignTitle}
            />
            
            <TextInput
              style={[styles.input, { height: 80, textAlignVertical: "top" }]}
              placeholder="Description (Optional)"
              placeholderTextColor="rgba(255,255,255,0.4)"
              multiline
              value={designDesc}
              onChangeText={setDesignDesc}
            />

            <View style={styles.tabToggle}>
              <TouchableOpacity
                style={[styles.toggleBtn, uploadType === "Design" && styles.toggleBtnActive]}
                onPress={() => setUploadType("Design")}
              >
                <Text style={[styles.toggleText, uploadType === "Design" && styles.toggleTextActive]}>Design</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, uploadType === "Gallery" && styles.toggleBtnActive]}
                onPress={() => setUploadType("Gallery")}
              >
                <Text style={[styles.toggleText, uploadType === "Gallery" && styles.toggleTextActive]}>Gallery</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadSubmit} disabled={uploadMutation.isPending || uploadGalleryMutation.isPending}>
              {uploadMutation.isPending || uploadGalleryMutation.isPending ? <ActivityIndicator color="#fff" /> : <Text style={styles.uploadBtnText}>Upload</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#050B14" },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: "800", color: "#FFF", letterSpacing: 0.2 },
  headerSubtitle: { fontSize: 12, color: "rgba(255,255,255,0.5)", marginTop: 2 },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: "rgba(231, 76, 60, 0.1)", borderWidth: 1, borderColor: "rgba(231, 76, 60, 0.3)", alignItems: "center", justifyContent: "center" },
  badge: { position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: "#E74C3C" },
  avatarMini: { width: 44, height: 44, borderRadius: 22, backgroundColor: "rgba(91, 107, 249, 0.15)", alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: "rgba(91, 107, 249, 0.4)" },
  avatarMiniText: { fontSize: 16, fontWeight: "700", color: "#5B6BF9" },
  
  scrollContent: { paddingHorizontal: 20, paddingTop: 10 },
  section: { marginBottom: 30 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#FFF" },
  seeAllText: { fontSize: 13, fontWeight: "600", color: "#5B6BF9" },

  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  statCard: { width: (SCREEN_W - 40 - 12) / 2, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)" },
  statIconWrap: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  statValue: { fontSize: 22, fontWeight: "800", color: "#FFF" },
  statLabel: { fontSize: 12, color: "rgba(255,255,255,0.6)", marginTop: 4, fontWeight: "500" },

  glassCard: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: 16, padding: 16, borderWidth: 1, borderColor: "rgba(255,255,255,0.08)", marginBottom: 12,position:"relative" },
  cardTitle: { fontSize: 15, fontWeight: "700", color: "#FFF" },
  cardSubtitle: { fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 },
  
  bookingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  bgYellow: { backgroundColor: "rgba(243, 156, 18, 0.15)" }, textYellow: { color: "#F39C12" },
  bgGreen: { backgroundColor: "rgba(39, 174, 96, 0.15)" }, textGreen: { color: "#27AE60" },
  bgBlue: { backgroundColor: "rgba(52, 152, 219, 0.15)" }, textBlue: { color: "#3498DB" },
  
  bookingActions: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 12,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },
  
  workerRow: { flexDirection: "row", alignItems: "center" },
  statusDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  workerStatus: { fontSize: 12, color: "rgba(255,255,255,0.7)", fontWeight: "500" },

  workerActions: {
    flexDirection: "row",
    marginTop: 16,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.05)",
    paddingTop: 12,
  },
  attendBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
    flex: 1,
    justifyContent: "center",
  },
  attendBtnText: {
    fontSize: 12,
    fontWeight: "700",
  },

  uploadCard: { width: 110, height: 110, borderRadius: 16, borderStyle: "dashed", borderWidth: 1.5, borderColor: "rgba(91, 107, 249, 0.5)", backgroundColor: "rgba(91, 107, 249, 0.05)", alignItems: "center", justifyContent: "center" },
  uploadText: { fontSize: 12, color: "#5B6BF9", fontWeight: "600", marginTop: 8 },
  galleryCard: { width: 110, height: 110, borderRadius: 16, overflow: "hidden" },
  galleryOverlay: { position: "absolute", top: 8, right: 8, backgroundColor: "rgba(0,0,0,0.6)", borderRadius: 8, padding: 6 },

  bottomNav: { position: "absolute", bottom: 20, left: 20, right: 20, height: 70, backgroundColor: "rgba(26, 26, 46, 0.95)", borderRadius: 24, flexDirection: "row", alignItems: "center", justifyContent: "space-around", borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  navItem: { alignItems: "center", justifyContent: "center", gap: 4 },
  navText: { fontSize: 10, fontWeight: "600", color: "rgba(255,255,255,0.4)" },
  navTextActive: { color: "#5B6BF9" },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.7)", justifyContent: "center", padding: 20 },
  modalContent: { backgroundColor: "#130A24", borderRadius: 20, padding: 20, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  modalTitle: { fontSize: 18, color: "#fff", fontWeight: "700" },
  imageSelector: { width: "100%", height: 150, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 16, borderStyle: "dashed", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.2)" },
  input: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 14, color: "#fff", marginBottom: 12, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)", fontSize: 15 },
  uploadBtn: { backgroundColor: "#5B6BF9", borderRadius: 12, padding: 16, alignItems: "center", marginTop: 8 },
  uploadBtnText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  profilePicture:{
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  /* Gallery Tab Styles */
  tabToggle: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 10,
  },
  toggleBtnActive: {
    backgroundColor: "#5B6BF9",
  },
  toggleText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 13,
    fontWeight: "600",
  },
  toggleTextActive: {
    color: "#fff",
  },
  galleryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    paddingTop: 10,
  },
  galleryCardItem: {
    width: (SCREEN_W - 52) / 2,
    aspectRatio: 1,
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#1A1A2E",
  },
  galleryCardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  deleteBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#5B6BF9",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
  },
  addBtnText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
