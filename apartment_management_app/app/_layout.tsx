import { useFonts } from "expo-font";
import { Stack, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { Appearance, TouchableOpacity } from "react-native";

import { Colors } from "@/constants/Colors";
import { AuthProvider } from "./authContext";
import { Ionicons } from "@expo/vector-icons";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = Appearance.getColorScheme();
  const theme = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });
  const router = useRouter();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const renderHomeButton = () => (
    <TouchableOpacity
      onPress={() => router.replace("/home")}
      style={{ marginRight: 16 }}
    >
      <Ionicons name="home-outline" size={24} color={theme.text} />
    </TouchableOpacity>
  );

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: theme.headerBackground },
            headerTintColor: theme.text,
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen
            name="index"
            options={{ headerShown: false, title: "Quay lại" }}
          />
          <Stack.Screen
            name="contact"
            options={{
              headerShown: true,
              title: "Contact",
              headerTitle: "Contact Us",
            }}
          />
          <Stack.Screen
            name="login"
            options={{
              headerShown: true,
              title: "Đăng Nhập",
              headerTitle: "Đăng Nhập",
            }}
          />
          <Stack.Screen
            name="home"
            options={{
              headerShown: false,
              title: "Home",
              headerTitle: "Home Apartment",
            }}
          />
          <Stack.Screen
            name="users/updateProfile"
            options={{
              title: "Cập nhật hồ sơ",
              headerTitle: "Cập nhật hồ sơ",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="forgotPassword"
            options={{
              headerShown: true,
              title: "Quên Mật Khẩu",
              headerTitle: "Quên Mật Khẩu",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="users/profile"
            options={{
              headerShown: true,
              title: "My Profile",
              headerTitle: "My Profile",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="apartments/listApartment"
            options={{
              headerShown: true,
              title: "Các căn Hộ",
              headerTitle: "Các căn Hộ",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="parkings/listParking"
            options={{
              headerShown: true,
              title: "Thẻ xe",
              headerTitle: "Thẻ xe",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="parkings/createParking"
            options={{
              headerShown: true,
              title: "Tạo Phiếu giữ xe mới",
              headerTitle: "Tạo Phiếu giữ xe mới",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="lockers/listLockers"
            options={{
              headerShown: true,
              title: "Tủ đồ",
              headerTitle: "Tủ đồ của tôi",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="complaints/listComplaint"
            options={{
              headerShown: true,
              title: "Khiếu nại",
              headerTitle: "Khiếu nại của tôi",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="complaints/createComplaint"
            options={{
              headerShown: true,
              title: "Tạo khiếu nại",
              headerTitle: "Tạo khiếu nại",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="complaints/[id]"
            options={{
              headerShown: true,
              title: "Chi tiết khiếu nại",
              headerTitle: "Chi tiết khiếu nại",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="complaints/edit/[id]"
            options={{
              headerShown: true,
              title: "Cập nhật khiếu nại",
              headerTitle: "Cập nhật khiếu nại",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="surveys/listSurvey"
            options={{
              headerShown: true,
              title: "Khảo sát",
              headerTitle: "Khảo sát",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen
            name="surveys/[id]"
            options={{
              headerShown: true,
              title: "Chi tiết khảo sát",
              headerTitle: "Chi tiết khảo sát",
              headerRight: renderHomeButton,
            }}
          />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
        </Stack>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
