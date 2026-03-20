import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import React, { useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
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
import { fetchServices } from "../../services/queries";
 

const CATEGORIES = ["All", "Living Room", "Bedroom", "Kitchen", "Bathroom"];

const { width: SCREEN_W } = Dimensions.get("window");
const CARD_W = (SCREEN_W - 40 - 12) / 2; // 2 cols, 20px side padding, 12px gap

export function ServicesScreen({ navigation }: any) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
const  serviceApiData = useQuery({queryKey:["services"],queryFn:fetchServices}) 
// console.log("serviceApiData00------>",serviceApiData)
  const filtered = useMemo(() => {
    return serviceApiData?.data?.filter((item:any) => {
      const matchCat =
        activeCategory === "All" || item.category === activeCategory;
      const matchSearch =
        search.trim() === "" ||
        item.title.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0D0D1A" />

      {/* ── sticky header area ── */}
      <View style={styles.topSection}>
        {/* Page title */}
        <Text style={styles.pageTitle}>Our Services</Text>

        {/* Search + filter */}
        <View style={styles.searchRow}>
          <View style={styles.searchWrap}>
            <Feather
              name="search"
              size={15}
              color="rgba(255,255,255,0.35)"
              style={{ marginRight: 8 }}
            />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search services..."
              placeholderTextColor="rgba(255,255,255,0.35)"
              style={styles.searchInput}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn} activeOpacity={0.75}>
            <Feather name="sliders" size={17} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Category chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chips}
        >
          {CATEGORIES.map((cat) => {
            const active = cat === activeCategory;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setActiveCategory(cat)}
                activeOpacity={0.75}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── grid ── */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={32} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptyText}>No services found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() =>
              navigation
                .getParent()
                ?.navigate("Booking", { serviceID:item?._id })
            }
          >
            {/* image */}
            <View style={styles.imageWrap}>
              <Image source={{ uri: item.image }} style={styles.image} />

              {/* rating badge */}
              <View style={styles.ratingBadge}>
                <Feather name="star" size={10} color="#F39C12" />
                <Text style={styles.ratingText}>{item.rating}</Text>
              </View>

              {/* reviews tag at bottom */}
              <View style={styles.reviewsTag}>
                <Text style={styles.reviewsText}>{item.reviews} reviews</Text>
              </View>
            </View>

            {/* info */}
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0D0D1A",
  },

  /* top */
  topSection: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 14,
    letterSpacing: 0.2,
  },

  /* search */
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A2E",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 14,
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#5B6BF9",
    alignItems: "center",
    justifyContent: "center",
  },

  /* chips */
  chips: {
    gap: 8,
    paddingBottom: 12,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#1A1A2E",
    borderWidth: 1,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: "#5B6BF9",
    borderColor: "#5B6BF9",
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.55)",
  },
  chipTextActive: {
    color: "#fff",
  },

  /* grid */
  grid: {
    paddingHorizontal: 20,
    paddingBottom: 110,
    paddingTop: 4,
  },
  row: {
    gap: 12,
    marginBottom: 18,
  },

  /* card */
  card: {
    width: CARD_W,
    borderRadius: 18,
    backgroundColor: "#1A1A2E",
    overflow: "hidden",
  },
  imageWrap: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  ratingBadge: {
    position: "absolute",
    top: 9,
    left: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#fff",
  },
  reviewsTag: {
    position: "absolute",
    bottom: 8,
    left: 9,
    backgroundColor: "rgba(0,0,0,0.50)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  reviewsText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "500",
  },
  cardInfo: {
    padding: 12,
    gap: 4,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    lineHeight: 18,
  },
  cardPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#5B6BF9",
    marginTop: 2,
  },

  /* empty */
  empty: {
    marginTop: 60,
    alignItems: "center",
    gap: 10,
  },
  emptyText: {
    color: "rgba(255,255,255,0.30)",
    fontSize: 14,
  },
});
