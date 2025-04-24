import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Linking,
} from "react-native";
import { router } from "expo-router";

export default function ForgotPasswordScreen() {
  const handleContactAdmin = () => {
    Linking.openURL("mailto:admin@example.com?subject=Reset Password Request");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Quên mật khẩu</Text>
        <Text style={styles.description}>
          Nếu bạn quên mật khẩu, vui lòng liên hệ quản trị viên để được hỗ trợ
          khôi phục tài khoản.
        </Text>

        <TouchableOpacity style={styles.button} onPress={handleContactAdmin}>
          <Text style={styles.buttonText}>Liên hệ Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.outlineButton]}
          onPress={() => router.replace("/login")}
        >
          <Text style={[styles.buttonText, styles.outlineButtonText]}>
            Quay lại đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#555",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  outlineButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  outlineButtonText: {
    color: "#007AFF",
  },
});
