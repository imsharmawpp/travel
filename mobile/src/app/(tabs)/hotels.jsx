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
import { Search, MapPin, Star, ArrowRight, Wifi, X } from "lucide-react-native";
import { useRouter } from "expo-router";

const HOTEL_IMAGES = [
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=600",
  "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=600",
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=600",
  "https://images.unsplash.com/photo-1520250297235-7564db0d4961?q=80&w=600",
  "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=600",
];

function HotelCard({ hotel, onPress }) {
  const amenities = Array.isArray(hotel.amenities)
    ? hotel.amenities
    : JSON.parse(hotel.amenities || "[]");
  const img = HOTEL_IMAGES[hotel.id % HOTEL_IMAGES.length];
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
        flexDirection: "row",
      }}
    >
      <Image
        source={{ uri: img }}
        style={{ width: 110, height: 120 }}
        resizeMode="cover"
      />
      <View style={{ flex: 1, padding: 12 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "700",
              color: "#111827",
              flex: 1,
              marginRight: 8,
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            {hotel.name}
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 2,
              backgroundColor: "#FFF7ED",
              borderRadius: 6,
              paddingHorizontal: 6,
              paddingVertical: 3,
            }}
          >
            <Star size={11} color="#F59E0B" fill="#F59E0B" />
            <Text style={{ fontSize: 11, fontWeight: "700", color: "#B45309" }}>
              {hotel.star_rating}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 4,
            marginBottom: 8,
          }}
        >
          <MapPin size={11} color="#9CA3AF" />
          <Text style={{ fontSize: 11, color: "#6B7280" }}>
            {hotel.city}, {hotel.country}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 4,
            marginBottom: 8,
          }}
        >
          {amenities.slice(0, 3).map((a) => (
            <View
              key={a}
              style={{
                backgroundColor: "#F3F4F6",
                borderRadius: 4,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              <Text
                style={{ fontSize: 9, color: "#6B7280", fontWeight: "500" }}
              >
                {a}
              </Text>
            </View>
          ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 9, color: "#9CA3AF" }}>From</Text>
            <Text style={{ fontSize: 15, fontWeight: "800", color: "#111827" }}>
              {hotel.min_room_price
                ? `₹${Number(hotel.min_room_price).toLocaleString()}`
                : "On Request"}
            </Text>
            <Text style={{ fontSize: 9, color: "#9CA3AF" }}>per night</Text>
          </View>
          <View
            style={{
              backgroundColor: "#111827",
              borderRadius: 8,
              paddingHorizontal: 10,
              paddingVertical: 6,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 11, fontWeight: "700" }}>
              View →
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HotelsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [stars, setStars] = useState("all");

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ["mobile-hotels", stars],
    queryFn: async () => {
      const p = new URLSearchParams();
      if (stars !== "all") p.set("stars", stars);
      if (search) p.set("search", search);
      const r = await fetch(`/api/hotels?${p}`);
      if (!r.ok) return [];
      return r.json();
    },
  });

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />
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
          Hotels & Resorts
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
            placeholder="Search hotels, city..."
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
        {/* Star Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0, marginTop: 16, marginBottom: 16 }}
          contentContainerStyle={{ paddingHorizontal: 20, gap: 8 }}
        >
          {[
            ["all", "All Hotels"],
            ["5", "5★ Luxury"],
            ["4", "4★ Premium"],
            ["3", "3★ Comfort"],
          ].map(([val, label]) => (
            <TouchableOpacity
              key={val}
              onPress={() => setStars(val)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: stars === val ? "#2563EB" : "#fff",
                borderWidth: 1,
                borderColor: stars === val ? "#2563EB" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "600",
                  color: stars === val ? "#fff" : "#374151",
                }}
              >
                {label}
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
            {hotels.length} properties found
          </Text>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#2563EB"
              style={{ marginTop: 40 }}
            />
          ) : hotels.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Text style={{ fontSize: 40, marginBottom: 12 }}>🏨</Text>
              <Text
                style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}
              >
                No hotels found
              </Text>
            </View>
          ) : (
            hotels.map((h) => (
              <HotelCard key={h.id} hotel={h} onPress={() => {}} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
