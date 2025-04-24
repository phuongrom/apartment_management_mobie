import React from "react";
import { Modal, View, ActivityIndicator, StyleSheet } from "react-native";

interface LoadingModalProps {
  visible: boolean;
}
const LoadingModal: React.FC<LoadingModalProps> = ({ visible }) => {
  return (
    <Modal transparent={true} animationType="fade" visible={visible}>
      <View style={styles.container}>
        <View style={styles.modal}>
          <ActivityIndicator size="large" color="#007bff" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Background mờ
  },
  modal: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
});

export default LoadingModal;
