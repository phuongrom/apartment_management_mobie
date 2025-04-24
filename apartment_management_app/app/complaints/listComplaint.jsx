import React, { useEffect, useRef, useState } from "react";
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
import SwipeableRow from "@/components/SwipeableRow";

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const openedRowRef = useRef(null);
  const closePreviousRow = () => {
    if (openedRowRef.current) {
      openedRowRef.current.close();
    }
  };

  const setOpenedRow = (ref) => {
    openedRowRef.current = ref;
  };

  const fetchComplaints = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await apiService.listComplaints(page);
      const results = res.results || [];

      setComplaints((prev) => {
        const existingIds = new Set(prev.map((c) => c.id));
        const newItems = results.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });

      if (res.next) {
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError("Không thể tải danh sách khiếu nại.");
    } finally {
      setLoading(false);
    }
  };

  const renderStatus = (status) => {
    switch (status) {
      case "in_progress":
        return "Đang xử lý";
      case "resolved":
        return "Đã giải quyết";
      case "pending":
        return "Đang chờ xử lý";
      case "rejected":
        return "Từ chối giải quyết";
      case "closed":
        return "Kết thúc";
      case "received":
        return "Đã nhận";
      default:
        return "Không rõ";
    }
  };

  const handleClickRow = (id) => {
    closePreviousRow();
    router.replace(`/complaints/${id}`);
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const renderComplaint = ({ item }) => {
    let swipeableRowRef = null;
    return (
      <SwipeableRow
        onPress={() => router.replace(`/complaints/${item.id}`)}
        onDelete={() => handleDelete(item.id)}
        closeOthers={() => {
          closePreviousRow();
          setOpenedRow(swipeableRowRef);
        }}
        ref={(ref) => {
          swipeableRowRef = ref;
        }}
      >
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleClickRow(item.id)}
          activeOpacity={0.8}
        >
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.content}>{item.content}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.status}>
              Trạng thái: {renderStatus(item.status)}
            </Text>
            <Text style={styles.date}>
              {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
      </SwipeableRow>
    );
  };

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchComplaints();
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
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => router.replace("/complaints/createComplaint")}
      >
        <Text style={styles.createText}>＋ Tạo Khiếu Nại</Text>
      </TouchableOpacity>
      <FlatList
        data={complaints}
        keyExtractor={(item, index) => item?.id?.toString() ?? `index-${index}`}
        renderItem={renderComplaint}
        contentContainerStyle={styles.listContent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={<LoadingModal visible={loading} />}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>Không có khiếu nại nào.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#f5f5f5",
  },
  listContent: {
    paddingBottom: 24,
  },
  createButton: {
    backgroundColor: "#50c878",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 16,
  },
  createText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 6,
  },
  content: {
    fontSize: 14,
    color: "#444",
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  status: {
    fontSize: 13,
    color: "#2196F3",
    fontWeight: "500",
  },
  date: {
    fontSize: 12,
    color: "#888",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#888",
    marginTop: 50,
    fontSize: 15,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
