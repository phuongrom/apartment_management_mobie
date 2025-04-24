import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import apiService from "@/services/apiService";
import { useRouter } from "expo-router";
import LoadingModal from "@/components/LoadingModal";

export default function ParkingList() {
  const [LockerItems, setLockerItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [lockerNumber, setLockerNumber] = useState("");

  const fetchLockerItems = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await apiService.listLockerItems(page);
      const results = res.results || [];
      setLockerItems((prev) => [...prev, ...results]);

      if (res.next) {
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.log(err);
      setError("Không thể tải danh sách vật phẩm trong tủ đồ điện tử");
    } finally {
      setLoading(false);
    }
  };

  const getLockerNumber = async () => {
    setLoading(true);
    try {
      const res = await apiService.lockerDetail();
      setLockerNumber(res.number);
    } catch (err) {
      console.log(err);
      setError("Không thể tải danh sách vật phẩm trong tủ đồ điện tử");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getLockerNumber();
  }, []);

  useEffect(() => {
    fetchLockerItems();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.item_name}</Text>
      <Text>Trạng thái: {item.status_display}</Text>
      <Text>Ngày nhận: {new Date(item.received_at).toLocaleString()}</Text>
    </View>
  );

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchLockerItems();
    }
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
        <Text style={styles.title}>Danh sách đơn hàng tủ {lockerNumber}</Text>
      </View>
      <FlatList
        data={LockerItems}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<LoadingModal visible={loading} />}
        contentContainerStyle={styles.container}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            Không có vật phẩm nào trong tủ đồ điện tử
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#F3F4F6",
    paddingBottom: 30,
  },
  header: {
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111827",
  },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginBottom: 6,
  },
  info: {
    fontSize: 15,
    color: "#6B7280",
    marginBottom: 2,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#10B981",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    shadowColor: "#10B981",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyMessage: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
