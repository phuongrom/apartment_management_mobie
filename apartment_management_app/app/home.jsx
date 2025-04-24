import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
  SafeAreaView,
  BackHandler,
} from "react-native";
import apartmentImg from "@/assets/images/apartmentImg.jpeg";
import { Link, useRouter } from "expo-router";
import { useAuth } from "./authContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { useCallback, useState } from "react";
import LoadingModal from "@/components/LoadingModal";
import { useFocusEffect } from "@react-navigation/native";

const HomeScreen = () => {
  const { logout } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        return true;
      };
  
      BackHandler.addEventListener("hardwareBackPress", onBackPress);
  
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
      };
    }, [])
  );

  const handleLogout = async () => {
    setLoading(true);
    await logout()
    router.replace("/login");
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={apartmentImg}
        resizeMode="cover"
        style={styles.image}
      >
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safeArea}>
          <Pressable style={styles.logoutTopButton} onPress={handleLogout}>
            <Icon name="sign-out" size={24} color="#fff" />
          </Pressable>

          <View style={styles.content}>
            <Text style={styles.title}>Apartment{`\n`}Management</Text>
          </View>

          <View style={styles.bottomBar}>
            <Link href="/apartments/listApartment" asChild>
              <Pressable style={styles.iconButton}>
                <Icon name="building" size={28} color="#fff" />
                <Text style={styles.iconText}>Căn Hộ</Text>
              </Pressable>
            </Link>

            <Link href="/parkings/listParking" asChild>
              <Pressable style={styles.iconButton}>
                <Icon name="car" size={28} color="#fff" />
                <Text style={styles.iconText}>Thẻ Xe</Text>
              </Pressable>
            </Link>

            <Link href="/users/profile" asChild>
              <Pressable style={styles.iconButton}>
                <Icon name="user" size={28} color="#fff" />
                <Text style={styles.iconText}>Hồ Sơ</Text>
              </Pressable>
            </Link>

            <Link href="/lockers/listLockers" asChild>
              <Pressable style={styles.iconButton}>
                <Icon name="archive" size={28} color="#fff" />
                <Text style={styles.iconText}>Tủ Đồ</Text>
              </Pressable>
            </Link>

            <Link href="/complaints/listComplaint" asChild>
              <Pressable style={styles.iconButton}>
                <Icon name="bullhorn" size={28} color="#fff" />
                <Text style={styles.iconText}>Khiếu Nại</Text>
              </Pressable>
            </Link>

            <Link href="/surveys/listSurvey" asChild>
              <Pressable style={styles.iconButton}>
                <Icon name="book" size={28} color="#fff" />
                <Text style={styles.iconText}>Khảo Sát</Text>
              </Pressable>
            </Link>
          </View>
        </SafeAreaView>
      </ImageBackground>

      <LoadingModal visible={loading} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  safeArea: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 48,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 38,
    fontWeight: "bold",
    textAlign: "center",
    lineHeight: 46,
    textShadowColor: "rgba(0, 0, 0, 0.6)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  bottomBar: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 16,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#50c878",
    padding: 12,
    borderRadius: 16,
    width: 100,
    height: 100,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
  },
  iconText: {
    color: "#fff",
    marginTop: 6,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  logoutTopButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#e53935",
    padding: 12,
    borderRadius: 16,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },
});
