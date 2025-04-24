import React, { useState } from "react";
import {
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import apiService from "@/services/apiService";
import { useAuth } from "../authContext";
import AvatarImage from "@/services/getImage";
import { transformUser } from "@/services/transform";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { STORAGE_KEYS } from "@/constants/StorageKey";
import LoadingModal from "@/components/LoadingModal";

export default function UpdateProfileScreen() {
  const { currentUser, setCurrentUser } = useAuth();

  const [firstName, setFirstName] = useState(currentUser?.firstName || "");
  const [lastName, setLastName] = useState(currentUser?.lastName || "");
  const [avatar, setAvatar] = useState(currentUser?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      setAvatar(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!firstName || !lastName) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ họ và tên");
      return;
    }

    if ((!password || !confirmPassword) && currentUser?.isFirstLogin) {
      Alert.alert("Lỗi", "Vui lòng nhập Password và xác nhận Password");
      return;
    }

    try {
      setLoading(true);
      await apiService.updateProfile({
        first_name: firstName,
        last_name: lastName,
        avatar,
        password: password,
        confirm_password: confirmPassword,
        is_first_login: false,
      });
      const rawUser = await apiService.getCurrentUser();
      const updatedUser = transformUser(rawUser);
      await AsyncStorage.setItem(
        STORAGE_KEYS.USER,
        JSON.stringify(updatedUser)
      );
      setCurrentUser(updatedUser);
      Alert.alert("Thành công", "Cập nhật hồ sơ thành công!");
      if (currentUser && currentUser.isFirstLogin) {
        router.replace("/home");
      } else {
        router.replace("users/profile");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      Alert.alert("Thất bại", "Không thể cập nhật hồ sơ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.header}>Cập nhật hồ sơ</Text>

            <Text style={styles.label}>Họ:</Text>
            <TextInput
              value={lastName}
              onChangeText={setLastName}
              style={styles.input}
            />

            <Text style={styles.label}>Tên:</Text>
            <TextInput
              value={firstName}
              onChangeText={setFirstName}
              style={styles.input}
            />

            <Text style={styles.label}>Mật khẩu mới:</Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              textContentType="oneTimeCode"
              style={styles.input}
            />

            <Text style={styles.label}>Xác nhận mật khẩu:</Text>
            <TextInput
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              textContentType="oneTimeCode"
              style={styles.input}
            />

            <Text style={styles.label}>Ảnh đại diện:</Text>
            {avatar ? <AvatarImage uri={avatar} style={styles.avatar} /> : null}
            <Button title="Chọn ảnh" onPress={pickImage} />

            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Đang lưu..." : "Lưu hồ sơ"}
              </Text>
            </TouchableOpacity>
            {currentUser?.isFirstLogin ? (
              <TouchableOpacity onPress={() => router.replace("/login")}>
                <Text style={styles.linkText}>← Quay lại đăng nhập</Text>
              </TouchableOpacity>
            ) : null}
          </ScrollView>
        </TouchableWithoutFeedback>
        <LoadingModal visible={loading} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 5,
    marginLeft: 5,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
    color: "#333",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 15,
    alignSelf: "center",
  },
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#50c878",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  linkText: {
    color: "#50c878",
    fontSize: 14,
    marginTop: 20,
    textAlign: "center",
  },
});
