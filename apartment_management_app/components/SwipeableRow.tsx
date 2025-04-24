import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef, useImperativeHandle, useRef } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  View,
} from "react-native";
import { Swipeable } from "react-native-gesture-handler";

type Props = {
  onDelete: () => void;
  onPress: () => void;
  children: React.ReactNode;
  containerStyle?: ViewStyle;
  closeOthers?: () => void;
};

const SwipeableRow = forwardRef<any, Props>(
  ({ onDelete, onPress, children, containerStyle, closeOthers }, ref) => {
    const swipeableRef = useRef<Swipeable>(null);

    useImperativeHandle(ref, () => ({
      close: () => {
        swipeableRef.current?.close();
      },
    }));

    const renderRightActions = () => (
      <View style={styles.rightActionWrapper}>
        <TouchableOpacity style={styles.deleteButton} onPress={onDelete}>
          <Ionicons
            name="trash-outline"
            size={20}
            color="#fff"
            style={styles.icon}
          />
          <Text style={styles.deleteText}>Xoá</Text>
        </TouchableOpacity>
      </View>
    );

    const handleSwipeableWillOpen = () => {
      if (closeOthers) {
        closeOthers();
      }
    };

    return (
      <Swipeable
        ref={swipeableRef}
        renderRightActions={renderRightActions}
        onSwipeableWillOpen={handleSwipeableWillOpen}
      >
        <TouchableOpacity
          style={[styles.container, containerStyle]}
          onPress={onPress}
          activeOpacity={0.85}
        >
          {children}
        </TouchableOpacity>
      </Swipeable>
    );
  }
);

export default SwipeableRow;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  rightActionWrapper: {
    justifyContent: "center",
    alignItems: "flex-end",
    marginBottom: 12,
    marginRight: 16,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    justifyContent: "center",
    minWidth: 100,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
  icon: {
    marginRight: 8,
  },
});
