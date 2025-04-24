import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import apiService from "@/services/apiService";
import { useRouter } from "expo-router";
import LoadingModal from "@/components/LoadingModal";

export default function ParkingList() {
  const [parkings, setParkings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  const fetchParkings = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await apiService.listParkings(page);
      const results = res.results || [];
      setParkings((prev) => [...prev, ...results]);

      if (res.next) {
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
      setError("Không thể tải danh sách bãi đậu xe.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParkings();
  }, []);

  const renderParking = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.relative_name}</Text>
      <Text style={styles.info}>Loại xe: {item.vehicle_type_display}</Text>
      <Text style={styles.info}>Biển số: {item.license_plate}</Text>
      <Text style={styles.info}>Trạng thái: {item.status_display}</Text>
      {item.start_date && (
        <Text style={styles.info}>Bắt đầu: {item.start_date}</Text>
      )}
      {item.expire_date && (
        <Text style={styles.info}>Hết hạn: {item.expire_date}</Text>
      )}
    </View>
  );

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchParkings();
    }
  };

  const handleAddNew = () => {
    router.replace("/parkings/createParking");
  };

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "red" }}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách thẻ xe</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleAddNew}>
          <Text style={styles.addButtonText}>＋ Thêm mới</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={parkings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderParking}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<LoadingModal visible={loading} />}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Không Thẻ xe nào</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F9FAFB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  addButton: {
    backgroundColor: "#50c878",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  info: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 2,
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
