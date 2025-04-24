import React, { useState } from "react";
import { View, TextInput, Text, Button, StyleSheet, Alert } from "react-native";
import apiService from "@/services/apiService";
import LoadingModal from "@/components/LoadingModal";
import { router } from "expo-router";

export default function CreateComplaint() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCreateComplaint = async () => {
    if (!title || !content) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    setLoading(true);
    try {
      const newComplaint = {
        title,
        content,
        status: "pending",
      };
      const res = await apiService.createComplaint(newComplaint);
      Alert.alert("Thành công", "Đã thêm 1 khiếu nại mới!");
      router.replace("/complaints/listComplaint");
    } catch (err) {
      console.log(err);
      setError("Không thể tạo khiếu nại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tạo Khiếu Nại Mới</Text>
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
        title={loading ? "Đang tạo..." : "Tạo Khiếu Nại"}
        onPress={handleCreateComplaint}
        disabled={loading}
      />
      <LoadingModal visible={loading} />
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
