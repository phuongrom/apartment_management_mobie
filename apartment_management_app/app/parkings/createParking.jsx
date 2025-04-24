import React, { useRef, useState } from "react";
import {
  Text,
  TextInput,
  Alert,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import apiService from "@/services/apiService";
import { Ionicons } from "@expo/vector-icons";
import LoadingModal from "@/components/LoadingModal";

export default function AddParkingCardScreen() {
  const currentYear = new Date().getFullYear();
  const endOfCurrentYear = new Date(currentYear, 11, 31);
  const [licensePlate, setLicensePlate] = useState("");
  const [vehicleType, setVehicleType] = useState("motorbike");
  const [ownerName, setOwnerName] = useState("");
  const [expireDate, setExpireDate] = useState(
    new Date(endOfCurrentYear.toISOString().split("T")[0])
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeTimeoutRef = useRef(null);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") return;

    const currentDate = selectedDate || expireDate;
    setExpireDate(currentDate);

    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);

    closeTimeoutRef.current = setTimeout(() => {
      setShowDatePicker(false);
    }, 5000);
  };

  const handleSubmit = async () => {
    if (!licensePlate || !vehicleType || !ownerName || !expireDate) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin thẻ xe");
      return;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];
      const expireDateStr = expireDate.toISOString().split("T")[0];

      await apiService.createParkingCard({
        license_plate: licensePlate,
        vehicle_type: vehicleType,
        owner_name: ownerName,
        relative_name: ownerName,
        status: "active",
        start_date: today,
        expire_date: expireDateStr,
      });

      Alert.alert("Thành công", "Đã thêm thẻ xe mới!");
      router.replace("/parkings/listParking");
    } catch (error) {
      console.error("Lỗi thêm thẻ xe:", error);
      Alert.alert("Thất bại", "Không thể thêm thẻ xe mới");
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
            <Text style={styles.header}>Thêm thẻ xe mới</Text>
            <Text style={styles.label}>Biển số xe:</Text>
            <TextInput
              value={licensePlate}
              onChangeText={setLicensePlate}
              style={styles.input}
              placeholder="VD: 30A-123.45"
            />
            <Text style={styles.label}>Loại xe:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={vehicleType}
                itemStyle={styles.itemStyle}
                onValueChange={(itemValue) => setVehicleType(itemValue)}
              >
                <Picker.Item label="Xe máy" value="motorbike" />
                <Picker.Item label="Ô tô" value="car" />
              </Picker>
            </View>
            <Text style={styles.label}>Chủ sở hữu:</Text>
            <TextInput
              value={ownerName}
              onChangeText={setOwnerName}
              style={styles.input}
              placeholder="Tên chủ xe"
            />
            <Text style={styles.label}>Ngày hết hạn:</Text>
            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              style={styles.datePickerInput}
            >
              <Text style={styles.dateText}>
                {expireDate.toLocaleDateString("vi-VN")}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#555" />
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={expireDate}
                mode="date"
                display={Platform.OS === "ios" ? "spinner" : "calendar"}
                onChange={handleDateChange}
                minimumDate={new Date()}
                style={styles.dateTimePicker}
                themeVariant="light"
                textColor="#333"
              />
            )}
            <TouchableOpacity
              style={styles.button}
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? "Đang lưu..." : "Lưu thẻ xe"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.replace("/parkings/listParking")}
            >
              <Text style={styles.linkText}>← Quay lại danh sách</Text>
            </TouchableOpacity>
            <LoadingModal visible={loading} />
          </ScrollView>
        </TouchableWithoutFeedback>
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
  button: {
    height: 50,
    borderRadius: 25,
    backgroundColor: "#50c878",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 15,
    backgroundColor: "#f8f8f8",
  },
  datePickerInput: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 16,
    color: "#333",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  itemStyle: {
    fontSize: 16,
    color: "#333",
  },
  dateTimePicker: {
    width: "100%",
    backgroundColor: "transparent",
    marginTop: 10,
    borderRadius: 10,
    color: "#333",
  },
});
