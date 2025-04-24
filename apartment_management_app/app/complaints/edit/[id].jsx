import React, { useEffect, useState } from "react";
import { View, TextInput, Text, Button, StyleSheet, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import apiService from "@/services/apiService";
import LoadingModal from "@/components/LoadingModal";

export default function EditComplaint() {
  const { id } = useLocalSearchParams();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchComplaint(id);
    }
  }, [id]);

  const fetchComplaint = async (complaintId) => {
    try {
      const data = await apiService.ComplaintById(complaintId);
      setTitle(data.title);
      setContent(data.content);
    } catch (error) {
      console.error("Lỗi khi lấy khiếu nại:", error);
      setError("Không thể tải dữ liệu khiếu nại.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateComplaint = async () => {
    if (!title || !content) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setSubmitting(true);
    try {
      await apiService.updateComplaint(id, { title, content });
      Alert.alert("Thành công", "Đã cập nhật khiếu nại!");
      replace.push("/complaints/listComplaint");
    } catch (err) {
      console.log(err);
      setError("Không thể cập nhật khiếu nại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingModal visible={loading} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chỉnh Sửa Khiếu Nại</Text>
      <TextInput
        style={styles.input}
        placeholder="Tiêu đề"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Nội dung"
        value={content}
        onChangeText={setContent}
        multiline
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title={submitting ? "Đang cập nhật..." : "Cập Nhật Khiếu Nại"}
        onPress={handleUpdateComplaint}
        disabled={submitting}
      />
      <LoadingModal visible={submitting} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
});
