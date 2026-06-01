import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  ArrowRight,
  BookOpen,
  Plus,
} from "lucide-react-native";
import { useRouter } from "expo-router";

const STATUS_COLORS = {
  confirmed: { bg: "#DCFCE7", text: "#15803D" },
  new: { bg: "#DBEAFE", text: "#1D4ED8" },
  cancelled: { bg: "#FEE2E2", text: "#DC2626" },
  pending: { bg: "#FEF9C3", text: "#A16207" },
};
const PAY_COLORS = {
  paid: { bg: "#DCFCE7", text: "#15803D" },
  partial: { bg: "#FFEDD5", text: "#C2410C" },
  pending: { bg: "#F3F4F6", text: "#4B5563" },
};

function BookingCard({ booking }) {
  const statusColor = STATUS_COLORS[booking.booking_status] || {
    bg: "#F3F4F6",
    text: "#4B5563",
  };
  const payColor = PAY_COLORS[booking.payment_status] || {
    bg: "#F3F4F6",
    text: "#4B5563",
  };
  const travelDate = new Date(booking.travel_date);
  const isUpcoming = travelDate >= new Date();
  const balance =
    parseFloat(booking.total_price) - parseFloat(booking.amount_paid);

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E5E7EB",
        marginBottom: 14,
      }}
    >
      {booking.banner_url && (
        <View style={{ height: 100, position: "relative" }}>
          <Image
            source={{ uri: booking.banner_url }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <View
            style={{
              position: "absolute",
              inset: 0,
              backgroundColor: "rgba(0,0,0,0.35)",
            }}
          />
          <View style={{ position: "absolute", left: 14, bottom: 14 }}>
            <Text
              style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}
              numberOfLines={1}
            >
              {booking.package_name}
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 2,
              }}
            >
              <MapPin size={11} color="rgba(255,255,255,0.7)" />
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
                {booking.destination}
              </Text>
            </View>
          </View>
          <View
            style={{
              position: "absolute",
              right: 14,
              top: 12,
              backgroundColor: statusColor.bg,
              borderRadius: 20,
              paddingHorizontal: 8,
              paddingVertical: 3,
            }}
          >
            <Text
              style={{
                fontSize: 10,
                fontWeight: "700",
                color: statusColor.text,
                textTransform: "capitalize",
              }}
            >
              {booking.booking_status}
            </Text>
          </View>
        </View>
      )}
      <View style={{ padding: 14 }}>
        {!booking.banner_url && (
          <Text
            style={{
              fontSize: 14,
              fontWeight: "700",
              color: "#111827",
              marginBottom: 10,
            }}
          >
            {booking.package_name || "Booking"}
          </Text>
        )}
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            gap: 10,
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Calendar size={12} color="#9CA3AF" />
            <Text style={{ fontSize: 11, color: "#6B7280" }}>
              {travelDate.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "2-digit",
              })}
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Users size={12} color="#9CA3AF" />
            <Text style={{ fontSize: 11, color: "#6B7280" }}>
              {booking.guests_adults}A {booking.guests_children}C
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <BookOpen size={12} color="#9CA3AF" />
            <Text
              style={{
                fontSize: 11,
                color: "#6B7280",
                fontFamily: "monospace",
              }}
            >
              {booking.booking_id}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text style={{ fontSize: 16, fontWeight: "800", color: "#111827" }}>
              ₹{Number(booking.total_price).toLocaleString()}
            </Text>
            {balance > 0 && (
              <Text style={{ fontSize: 11, color: "#EA580C" }}>
                Balance: ₹{balance.toLocaleString()}
              </Text>
            )}
          </View>
          <View style={{ flexDirection: "row", gap: 6 }}>
            <View
              style={{
                backgroundColor: payColor.bg,
                borderRadius: 20,
                paddingHorizontal: 10,
                paddingVertical: 4,
              }}
            >
              <Text
                style={{
                  fontSize: 10,
                  fontWeight: "700",
                  color: payColor.text,
                  textTransform: "capitalize",
                }}
              >
                {booking.payment_status}
              </Text>
            </View>
            {balance > 0 && isUpcoming && (
              <View
                style={{
                  backgroundColor: "#EA580C",
                  borderRadius: 20,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                }}
              >
                <Text
                  style={{ fontSize: 10, fontWeight: "700", color: "#fff" }}
                >
                  Pay Now
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [tab, setTab] = useState("all");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["mobile-bookings"],
    queryFn: async () => {
      const r = await fetch("/api/bookings?limit=50");
      if (!r.ok) return [];
      return r.json();
    },
  });

  const today = new Date();
  const filtered = bookings.filter((b) => {
    if (tab === "upcoming") return new Date(b.travel_date) >= today;
    if (tab === "past") return new Date(b.travel_date) < today;
    return true;
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
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "700", color: "#111827" }}>
            My Trips
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/packages")}
            style={{
              backgroundColor: "#2563EB",
              borderRadius: 10,
              paddingHorizontal: 14,
              paddingVertical: 8,
              flexDirection: "row",
              alignItems: "center",
              gap: 4,
            }}
          >
            <Plus size={14} color="#fff" />
            <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>
              Book Trip
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Tab Pills */}
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            paddingHorizontal: 20,
            paddingVertical: 16,
          }}
        >
          {[
            ["all", "All"],
            ["upcoming", "Upcoming"],
            ["past", "Past"],
          ].map(([id, label]) => (
            <TouchableOpacity
              key={id}
              onPress={() => setTab(id)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: tab === id ? "#111827" : "#fff",
                borderWidth: 1,
                borderColor: tab === id ? "#111827" : "#E5E7EB",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: tab === id ? "#fff" : "#6B7280",
                }}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ paddingHorizontal: 20 }}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#2563EB"
              style={{ marginTop: 40 }}
            />
          ) : filtered.length === 0 ? (
            <View style={{ alignItems: "center", paddingVertical: 60 }}>
              <Text style={{ fontSize: 50, marginBottom: 16 }}>✈️</Text>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "700",
                  color: "#111827",
                  marginBottom: 8,
                }}
              >
                No trips yet
              </Text>
              <Text
                style={{
                  fontSize: 14,
                  color: "#9CA3AF",
                  textAlign: "center",
                  marginBottom: 24,
                }}
              >
                Book your first dream holiday
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/(tabs)/packages")}
                style={{
                  backgroundColor: "#2563EB",
                  borderRadius: 12,
                  paddingHorizontal: 24,
                  paddingVertical: 12,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 14, fontWeight: "700" }}
                >
                  Explore Packages
                </Text>
                <ArrowRight size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            filtered.map((b) => <BookingCard key={b.id} booking={b} />)
          )}
        </View>
      </ScrollView>
    </View>
  );
}
