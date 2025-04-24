import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import apartmentImg from "@/assets/images/apartmentImg.jpeg";
import { useRouter } from "expo-router";
import { useAuth } from "./authContext";

const App = () => {
  const router = useRouter();
  const { isAuthenticated, currentUser } = useAuth();

  useEffect(() => {
    if (isAuthenticated && !currentUser.isFirstLogin) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  return (
    <View style={styles.container}>
      <ImageBackground
        source={apartmentImg}
        resizeMode="cover"
        style={styles.image}
      >
        <Text style={styles.headerContent}>Apartment Management</Text>
        <Pressable style={styles.button} onPress={() => router.push("/login")}>
          <Text style={styles.buttonText}>Đăng Nhập</Text>
        </Pressable>
      </ImageBackground>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: { flex: 1 },
  image: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
  },
  headerContent: {
    color: "#fff",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 10,
  },
  button: {
    height: 55,
    borderRadius: 30,
    backgroundColor: "#50c878",
    paddingHorizontal: 25,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 15,
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 1,
  },
});
