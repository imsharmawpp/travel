import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Pressable,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Search,
  MapPin,
  TrendingUp,
  Star,
  Clock,
  ArrowRight,
  Globe,
  Home as HomeIcon,
} from "lucide-react-native";
import { useRouter } from "expo-router";

const DEST_CATEGORIES = [
  { label: "Domestic", color: "#EFF6FF", border: "#BFDBFE", text: "#1D4ED8" },
  {
    label: "International",
    color: "#FFF7ED",
    border: "#FED7AA",
    text: "#C2410C",
  },
];

const DESTINATIONS = [
  {
    name: "Kashmir",
    image:
      "https://images.unsplash.com/photo-1598305372803-12000570b240?q=80&w=600",
    tag: "Trending",
  },
  {
    name: "Bali",
    image:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=600",
    tag: "Popular",
  },
  {
    name: "Dubai",
    image:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=600",
    tag: "Hot",
  },
  {
    name: "Goa",
    image:
      "https://images.unsplash.com/photo-1512783569644-77e269f164c0?q=80&w=600",
    tag: "",
  },
  {
    name: "Maldives",
    image:
      "https://images.unsplash.com/photo-1573843981267-be1999ff37cd?q=80&w=600",
    tag: "Luxury",
  },
  {
    name: "Kerala",
    image:
      "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=600",
    tag: "",
  },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [search, setSearch] = useState("");

  const { data: packages = [] } = useQuery({
    queryKey: ["mobile-packages-home"],
    queryFn: async () => {
      const r = await fetch("/api/packages?limit=6");
      if (!r.ok) return [];
      return r.json();
    },
  });

  const featured = packages.slice(0, 6);

  return (
    <View style={{ flex: 1, backgroundColor: "#F9FAFB" }}>
      <StatusBar style="light" />

      {/* Header */}
      <View
        style={{
          backgroundColor: "#2563EB",
          paddingTop: insets.top + 12,
          paddingHorizontal: 20,
          paddingBottom: 24,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <View>
            <Text style={{ color: "#BFDBFE", fontSize: 12, fontWeight: "500" }}>
              Good Morning ☀️
            </Text>
            <Text
              style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: "700",
                marginTop: 2,
              }}
            >
              NeoTravel
            </Text>
          </View>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 18,
              backgroundColor: "rgba(255,255,255,0.2)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "700" }}>
              NT
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#fff",
            borderRadius: 12,
            paddingHorizontal: 14,
            paddingVertical: 10,
            gap: 10,
          }}
        >
          <Search size={16} color="#9CA3AF" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Where do you want to go?"
            placeholderTextColor="#9CA3AF"
            style={{ flex: 1, fontSize: 14, color: "#111827" }}
            onSubmitEditing={() => router.push("/(tabs)/packages")}
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
      >
        {/* Destinations Grid */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
              Popular Destinations
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/packages")}>
              <Text
                style={{ fontSize: 12, color: "#2563EB", fontWeight: "600" }}
              >
                See All
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginHorizontal: -20 }}
            contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
          >
            {DESTINATIONS.map((dest) => (
              <TouchableOpacity
                key={dest.name}
                onPress={() => router.push("/(tabs)/packages")}
                style={{ width: 120 }}
              >
                <View
                  style={{
                    width: 120,
                    height: 100,
                    borderRadius: 12,
                    overflow: "hidden",
                    marginBottom: 8,
                  }}
                >
                  <Image
                    source={{ uri: dest.image }}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundColor: "rgba(0,0,0,0.2)",
                    }}
                  />
                  {dest.tag ? (
                    <View
                      style={{
                        position: "absolute",
                        top: 8,
                        left: 8,
                        backgroundColor: "#EA580C",
                        borderRadius: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 9,
                          fontWeight: "700",
                        }}
                      >
                        {dest.tag}
                      </Text>
                    </View>
                  ) : null}
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "600",
                    color: "#111827",
                    textAlign: "center",
                  }}
                >
                  {dest.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Packages */}
        <View style={{ paddingHorizontal: 20, paddingTop: 28 }}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 14,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#111827" }}>
              Featured Packages
            </Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/packages")}>
              <Text
                style={{ fontSize: 12, color: "#2563EB", fontWeight: "600" }}
              >
                View All
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{ gap: 14 }}>
            {featured.map((pkg) => (
              <TouchableOpacity
                key={pkg.id}
                onPress={() => router.push("/(tabs)/packages")}
                activeOpacity={0.9}
              >
                <View
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: 16,
                    overflow: "hidden",
                    borderWidth: 1,
                    borderColor: "#E5E7EB",
                  }}
                >
                  <Image
                    source={{ uri: pkg.banner_url }}
                    style={{ width: "100%", height: 160 }}
                    resizeMode="cover"
                  />
                  <View
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      backgroundColor: "rgba(255,255,255,0.9)",
                      borderRadius: 20,
                      paddingHorizontal: 10,
                      paddingVertical: 4,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <MapPin size={11} color="#6B7280" />
                    <Text
                      style={{
                        fontSize: 11,
                        color: "#374151",
                        fontWeight: "600",
                      }}
                    >
                      {pkg.destination}
                    </Text>
                  </View>
                  {pkg.offer_price && (
                    <View
                      style={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        backgroundColor: "#EA580C",
                        borderRadius: 20,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 10,
                          fontWeight: "700",
                        }}
                      >
                        {Math.round(
                          ((pkg.starting_price - pkg.offer_price) /
                            pkg.starting_price) *
                            100,
                        )}
                        % OFF
                      </Text>
                    </View>
                  )}
                  <View style={{ padding: 14 }}>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: "700",
                        color: "#111827",
                        marginBottom: 6,
                      }}
                      numberOfLines={2}
                    >
                      {pkg.name}
                    </Text>
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 12,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Clock size={12} color="#9CA3AF" />
                        <Text style={{ fontSize: 11, color: "#6B7280" }}>
                          {pkg.duration_nights}N/{pkg.duration_days}D
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 4,
                        }}
                      >
                        <Globe size={12} color="#9CA3AF" />
                        <Text style={{ fontSize: 11, color: "#6B7280" }}>
                          {pkg.package_type}
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
                        <Text
                          style={{
                            fontSize: 18,
                            fontWeight: "800",
                            color: "#111827",
                          }}
                        >
                          ₹
                          {Number(
                            pkg.offer_price || pkg.starting_price,
                          ).toLocaleString()}
                        </Text>
                        <Text style={{ fontSize: 10, color: "#9CA3AF" }}>
                          per person
                        </Text>
                      </View>
                      <View
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
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 12,
                            fontWeight: "700",
                          }}
                        >
                          View
                        </Text>
                        <ArrowRight size={13} color="#fff" />
                      </View>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Promo Banner */}
        <View
          style={{
            marginHorizontal: 20,
            marginTop: 24,
            backgroundColor: "#1E3A5F",
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text
            style={{
              color: "#BFDBFE",
              fontSize: 11,
              fontWeight: "600",
              marginBottom: 4,
            }}
          >
            LIMITED TIME OFFER
          </Text>
          <Text
            style={{
              color: "#fff",
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 8,
            }}
          >
            25% Advance Booking
          </Text>
          <Text
            style={{
              color: "#93C5FD",
              fontSize: 13,
              marginBottom: 16,
              lineHeight: 18,
            }}
          >
            Book your dream holiday with just 25% now. Pay the rest closer to
            your travel date.
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(tabs)/packages")}
            style={{
              backgroundColor: "#2563EB",
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 18,
              alignSelf: "flex-start",
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "700" }}>
              Explore Packages
            </Text>
            <ArrowRight size={14} color="#fff" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
