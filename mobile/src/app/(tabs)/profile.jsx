import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  User,
  BookOpen,
  Heart,
  Settings,
  HelpCircle,
  Phone,
  Star,
  Shield,
  ChevronRight,
  Globe,
} from "lucide-react-native";
import { useRouter } from "expo-router";

const MENU_ITEMS = [
  {
    icon: BookOpen,
    label: "My Bookings",
    sub: "View all your trips",
    href: "/(tabs)/trips",
    color: "#3B82F6",
  },
  {
    icon: Heart,
    label: "Wishlist",
    sub: "Saved packages & hotels",
    href: null,
    color: "#EF4444",
  },
  {
    icon: Star,
    label: "Reviews & Ratings",
    sub: "Your travel reviews",
    href: null,
    color: "#F59E0B",
  },
  {
    icon: Phone,
    label: "Contact Support",
    sub: "Call or WhatsApp us",
    href: null,
    color: "#10B981",
  },
  {
    icon: HelpCircle,
    label: "Help & FAQs",
    sub: "Common questions answered",
    href: null,
    color: "#8B5CF6",
  },
  {
    icon: Globe,
    label: "Website",
    sub: "Open full portal",
    href: null,
    color: "#6B7280",
  },
  {
    icon: Settings,
    label: "Settings",
    sub: "App preferences",
    href: null,
    color: "#374151",
  },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Profile Header */}
        <View
          style={{
            backgroundColor: "#fff",
            paddingTop: insets.top + 20,
            paddingHorizontal: 20,
            paddingBottom: 28,
            borderBottomWidth: 1,
            borderBottomColor: "#E5E7EB",
          }}
        >
          <View style={{ alignItems: "center" }}>
            <View
              style={{
                width: 72,
                height: 72,
                borderRadius: 36,
                backgroundColor: "#2563EB",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Text style={{ color: "#fff", fontSize: 28, fontWeight: "700" }}>
                G
              </Text>
            </View>
            <Text style={{ fontSize: 18, fontWeight: "700", color: "#111827" }}>
              Guest Traveller
            </Text>
            <Text style={{ fontSize: 13, color: "#9CA3AF", marginTop: 4 }}>
              Sign in to access all features
            </Text>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 16 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: "#2563EB",
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  borderWidth: 1,
                  borderColor: "#E5E7EB",
                  borderRadius: 10,
                  paddingVertical: 10,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "#374151", fontSize: 13, fontWeight: "600" }}
                >
                  Register
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Row */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingVertical: 16,
            gap: 12,
          }}
        >
          {[
            { label: "Trips", value: "0" },
            { label: "Reviews", value: "0" },
            { label: "Wishlist", value: "0" },
          ].map((s) => (
            <View
              key={s.label}
              style={{
                flex: 1,
                backgroundColor: "#fff",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#E5E7EB",
                padding: 14,
                alignItems: "center",
              }}
            >
              <Text
                style={{ fontSize: 22, fontWeight: "800", color: "#111827" }}
              >
                {s.value}
              </Text>
              <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 2 }}>
                {s.label}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Access */}
        <View style={{ marginHorizontal: 20, marginBottom: 20 }}>
          <View
            style={{
              backgroundColor: "#EFF6FF",
              borderRadius: 14,
              padding: 16,
              borderWidth: 1,
              borderColor: "#BFDBFE",
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: "#2563EB",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Shield size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontSize: 14, fontWeight: "700", color: "#1E40AF" }}
              >
                Secure Booking Platform
              </Text>
              <Text style={{ fontSize: 12, color: "#3B82F6", marginTop: 2 }}>
                GST compliant · 100% secure payments
              </Text>
            </View>
          </View>
        </View>

        {/* Menu */}
        <View
          style={{
            marginHorizontal: 20,
            backgroundColor: "#fff",
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "#E5E7EB",
            overflow: "hidden",
          }}
        >
          {MENU_ITEMS.map((item, idx) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => (item.href ? router.push(item.href) : null)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderBottomWidth: idx < MENU_ITEMS.length - 1 ? 1 : 0,
                borderBottomColor: "#F3F4F6",
              }}
              activeOpacity={0.7}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 10,
                  backgroundColor: item.color + "15",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 12,
                }}
              >
                <item.icon size={18} color={item.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 14, fontWeight: "600", color: "#111827" }}
                >
                  {item.label}
                </Text>
                <Text style={{ fontSize: 11, color: "#9CA3AF", marginTop: 1 }}>
                  {item.sub}
                </Text>
              </View>
              <ChevronRight size={16} color="#D1D5DB" />
            </TouchableOpacity>
          ))}
        </View>

        {/* App Version */}
        <View style={{ alignItems: "center", marginTop: 24, marginBottom: 8 }}>
          <Text style={{ fontSize: 11, color: "#D1D5DB" }}>
            NeoTravel Mobile v1.0.0
          </Text>
          <Text style={{ fontSize: 10, color: "#E5E7EB", marginTop: 2 }}>
            Built with ❤️ for Indian travellers
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
