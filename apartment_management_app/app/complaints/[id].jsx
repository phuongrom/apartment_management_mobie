import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { format } from "date-fns";
import apiService from "@/services/apiService";

export default function ComplaintDetailScreen() {
  const { id } = useLocalSearchParams();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (id) {
      fetchComplaint(id);
    }
  }, [id]);

  const fetchComplaint = async (complaintId) => {
    try {
      const data = await apiService.ComplaintById(complaintId);
      setComplaint(data);
    } catch (error) {
      console.error("Lỗi khi fetch khiếu nại:", error);
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

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (!complaint) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy khiếu nại</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Chi tiết Khiếu Nại</Text>

      <DetailItem label="Tiêu đề" value={complaint.title} />
      <DetailItem label="Nội dung" value={complaint.content} />
      <DetailItem label="Trạng thái" value={renderStatus(complaint.status)} />
      <DetailItem
        label="Ngày tạo"
        value={format(new Date(complaint.created_at), "dd/MM/yyyy HH:mm")}
      />
      <DetailItem
        label="Cập nhật lần cuối"
        value={format(new Date(complaint.updated_at), "dd/MM/yyyy HH:mm")}
      />
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => router.replace(`/complaints/edit/${id}`)}
      >
        <Text style={styles.editText}>✏️ Chỉnh sửa</Text>
      </TouchableOpacity>
    </View>
  );
}

function DetailItem({ label, value }) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}:</Text>
      <Text style={styles.text}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  label: {
    fontWeight: "600",
    fontSize: 16,
    color: "#444",
  },
  text: {
    fontSize: 16,
    color: "#111",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  editButton: {
    marginTop: 24,
    backgroundColor: "#50c878",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  editText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
