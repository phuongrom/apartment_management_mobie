import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAuth } from "../authContext";
import AvatarImage from "@/services/getImage";

export default function ProfileScreen() {
  const { currentUser } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollInner}>
        <Text style={styles.title}>Hồ sơ cá nhân</Text>

        {currentUser?.avatar ? (
          <AvatarImage uri={currentUser.avatar} style={styles.avatar} />
        ) : null}

        <Text style={styles.name}>
          {currentUser?.lastName} {currentUser?.firstName}
        </Text>
        <Text style={styles.roleText}>{currentUser?.role}</Text>
        <Text style={styles.email}>{currentUser?.email}</Text>
        <Text style={styles.phone}>{currentUser?.phoneNumber}</Text>

        <TouchableOpacity
          onPress={() => router.replace("/users/updateProfile")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Cập nhật hồ sơ</Text>
        </TouchableOpacity>

        <Text style={styles.subTitle}>Căn hộ đang ở</Text>

        {currentUser?.apartments.length > 0 ? (
          currentUser?.apartments?.map((apt) => (
            <View key={apt.id} style={styles.apartmentCard}>
              {apt.image ? (
                <AvatarImage uri={apt.image} style={styles.apartmentImage} />
              ) : null}
              <View style={styles.apartmentInfo}>
                <Text style={styles.apartmentName}>{apt.name}</Text>
                <Text style={styles.apartmentAddress}>{apt.address}</Text>
                <Text style={styles.apartmentRole}>
                  {apt.owner?.id === currentUser.id ? "Chủ hộ" : "Thành viên"}
                </Text>
                <Text style={styles.apartmentCapacity}>
                  Số Thành Viên: {apt.users.length}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.apartmentName}>Không có căn hộ nào</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollInner: {
    padding: 24,
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 6,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
  },
  phone: {
    fontSize: 16,
    color: "#444",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 30,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  subTitle: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  apartmentCard: {
    flexDirection: "row",
    backgroundColor: "#f2f2f2",
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    width: "100%",
  },
  apartmentImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 12,
  },
  apartmentInfo: {
    flex: 1,
    justifyContent: "center",
  },
  apartmentName: {
    fontSize: 16,
    fontWeight: "600",
  },
  apartmentAddress: {
    fontSize: 14,
    color: "#666",
  },
  apartmentRole: {
    marginTop: 4,
    fontSize: 13,
    fontStyle: "italic",
    color: "#007AFF",
  },
  apartmentCapacity: {
    fontSize: 14,
    color: "#777",
  },
  roleText: {
    backgroundColor: "#4caf50",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    overflow: "hidden",
    alignSelf: "center",
  },
});
