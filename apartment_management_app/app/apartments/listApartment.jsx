import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import apiService from "@/services/apiService";
import AvatarImage from "@/services/getImage";
import LoadingModal from "@/components/LoadingModal";

export default function ApartmentList() {
  const [apartments, setApartments] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchApartments = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await apiService.listApartments(page);
      const results = res.results || [];
      setApartments((prev) => [...prev, ...results]);

      if (res.next) {
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Không thể tải danh sách căn hộ.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApartments(1);
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchApartments();
    }
  };

  const renderApartment = ({ item }) => (
    <View style={styles.apartmentCard}>
      {item?.image && (
        <AvatarImage uri={item.image} style={styles.apartmentImage} />
      )}
      <View style={styles.apartmentInfo}>
        <Text style={styles.apartmentName}>{item.name}</Text>
        <Text style={styles.apartmentAddress}>{item.address}</Text>
        <Text style={styles.apartmentOwner}>
          Chủ hộ: {item.owner?.first_name} {item.owner?.last_name}
        </Text>
        <Text style={styles.apartmentCapacity}>
          Số Thành Viên: {item.users.length} / {item.max_capacity}
        </Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={apartments}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={renderApartment}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.title}>Danh sách căn hộ</Text>}
      ListFooterComponent={<LoadingModal visible={loading} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <Text style={styles.emptyMessage}>
          Hiện không có căn hộ nào trong danh sách.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  apartmentCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  apartmentImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 20,
  },
  apartmentInfo: {
    flex: 1,
    justifyContent: "center",
  },
  apartmentName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  apartmentAddress: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },
  apartmentOwner: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#2563EB",
    marginBottom: 6,
  },
  apartmentCapacity: {
    fontSize: 14,
    color: "#4B5563",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
