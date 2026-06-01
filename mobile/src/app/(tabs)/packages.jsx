import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Search,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  TrendingUp,
  Globe,
  Home as HomeIcon,
  Filter,
  X,
} from "lucide-react-native";
import { useRouter } from "expo-router";

const CATEGORIES = ["All", "Domestic", "International"];
const TYPES = ["All", "Group Tour", "Private Tour", "Custom Tour"];

function PackageCard({ pkg, onPress }) {
  const savings = pkg.offer_price
    ? Math.round(
        ((pkg.starting_price - pkg.offer_price) / pkg.starting_price) * 100,
      )
    : 0;
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 14,
      }}
    >
      <View style={{ position: "relative", height: 160 }}>
        <Image
          source={{
            uri:
              pkg.banner_url ||
              "https://images.unsplash.com/photo-1469854523086?q=80&w=600",
          }}
          style={{ width: "100%", height: "100%" }}
          resizeMode="cover"
        />
        <View
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            backgroundColor: "rgba(255,255,255,0.92)",
            borderRadius: 20,
            paddingHorizontal: 10,
            paddingVertical: 4,
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
          }}
        >
          <MapPin size={10} color="#6B7280" />
          <Text style={{ fontSize: 10, color: "#374151", fontWeight: "600" }}>
            {pkg.destination}
          </Text>
        </View>
        {savings > 0 && (
          <View
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              backgroundColor: "#DC2626",
              borderRadius: 20,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>
              {savings}% OFF
            </Text>
          </View>
        )}
        <View
          style={{
            position: "absolute",
            bottom: 10,
            left: 10,
            backgroundColor: "#2563EB",
            borderRadius: 20,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 9, fontWeight: "600" }}>
            {pkg.package_type}
          </Text>
        </View>
      </View>
      <View style={{ padding: 14 }}>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "700",
            color: "#111827",
            marginBottom: 8,
            lineHeight: 20,
          }}
          numberOfLines={2}
        >
          {pkg.name}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 14,
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Clock size={12} color="#9CA3AF" />
            <Text style={{ fontSize: 11, color: "#6B7280" }}>
              {pkg.duration_nights}N/{pkg.duration_days}D
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <MapPin size={12} color="#9CA3AF" />
            <Text style={{ fontSize: 11, color: "#6B7280" }}>
              {pkg.city || pkg.destination}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "space-between",
            paddingTop: 12,
            borderTopWidth: 1,
            borderTopColor: "#F3F4F6",
          }}
        >
          <View>
            {pkg.offer_price && (
              <Text
                style={{
                  fontSize: 11,
                  color: "#9CA3AF",
                  textDecorationLine: "line-through",
                }}
              >
                ₹{Number(pkg.starting_price).toLocaleString()}
              </Text>
            )}
            <Text style={{ fontSize: 20, fontWeight: "800", color: "#111827" }}>
              ₹{Number(pkg.offer_price || pkg.starting_price).toLocaleString()}
            </Text>
            <Text style={{ fontSize: 10, color: "#9CA3AF" }}>per person</Text>
          </View>
          <View
            style={{
              backgroundColor: "#2563EB",
              borderRadius: 10,
              paddingHorizontal: 16,
              paddingVertical: 9,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
              View
            </Text>
            <ArrowRight size={13} color="#fff" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function PackagesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [type, setType] = useState("All");

  const { data: packages = [], isLoading } = useQuery({
    queryKey: ["mobile-packages", category],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (category !== "All") p.set("category", category);
      const r = await fetch(`/api/packages?${p}`);
      if (!r.ok) return [];
      return r.json();
    },
  });

  const filtered = packages.filter((pkg) => {
    const matchSearch =
      !search ||
      pkg.name.toLowerCase().includes(search.toLowerCase()) ||
      pkg.destination.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "All" || pkg.package_type === type;
    return matchSearch && matchType;
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#fff",
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 16,
          borderBottomWidth: 1,
          borderBottomColor: "#E5E7EB",
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontWeight: "700",
            color: "#111827",
            marginBottom: 14,
          }}
        >
          All Packages
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#F9FAFB",
            borderRadius: 10,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            gap: 8,
          }}
        >
          <Search size={16} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search packages..."
            placeholderTextColor="#9CA3AF"
            style={{ flex: 1, fontSize: 14, color: "#111827" }}
          />
          {search ? (
            <TouchableOpacity onPress={() => setSearch("")}>
              <X size={16} color="#9CA3AF" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Category Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginTop: 16 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c}
              onPress={() => setCategory(c)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: category === c ? "#2563EB" : "#fff",
                borderWidth: 1,
                borderColor: category === c ? "#2563EB" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: category === c ? "#fff" : "#374151",
                }}
              >
                {c}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Type Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginTop: 10, marginBottom: 16 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {TYPES.map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => setType(t)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor: type === t ? "#111827" : "#F9FAFB",
                borderWidth: 1,
                borderColor: type === t ? "#111827" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "600",
                  color: type === t ? "#fff" : "#6B7280",
                }}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 12,
              color: "#9CA3AF",
              marginBottom: 14,
              fontWeight: "500",
            }}
          >
            {filtered.length} packages found
          </Text>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#2563EB"
              style={{ marginTop: 40 }}
            />
          ) : filtered.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🗺️</Text>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 6,
                }}
              >
                No packages found
              </Text>
              <Text
                style={{ fontSize: 13, color: "#9CA3AF", textAlign: "center" }}
              >
                Try a different search or category
              </Text>
            </View>
          ) : (
            filtered.map((pkg) => (
              <PackageCard
                key={pkg.id}
                pkg={pkg}
                onPress={() => router.push("/(tabs)/packages")}
              />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
