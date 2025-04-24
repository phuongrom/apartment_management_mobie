import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import apiService from "@/services/apiService";
import LoadingModal from "@/components/LoadingModal";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function SurveyList() {
  const [surveys, setSurveys] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();

  const fetchSurveys = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await apiService.listSurveys(page);
      const results = res.results || [];
      console.log(results);

      setSurveys((prev) => [...prev, ...results]);

      if (res.next) {
        setPage((prev) => prev + 1);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Không thể tải danh sách khảo sát.");
    } finally {
      setLoading(false);
    }
  };

  const handleClickRow = (id) => {
    router.push(`/surveys/${id}`);
  };

  useEffect(() => {
    fetchSurveys();
  }, []);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchSurveys();
    }
  };

  const renderSurvey = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => handleClickRow(item.id)}
      activeOpacity={0.8}
    >
      <View style={styles.surveyCard}>
        <Ionicons
          name="clipboard-outline"
          size={30}
          color="#3B82F6"
          style={styles.icon}
        />
        <View style={styles.surveyInfo}>
          <Text style={styles.surveyTitle}>{item.title}</Text>
          <Text style={styles.surveyDescription}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={surveys}
      keyExtractor={(item, index) => `${item.id}-${index}`}
      renderItem={renderSurvey}
      contentContainerStyle={styles.container}
      ListHeaderComponent={<Text style={styles.title}>Danh sách khảo sát</Text>}
      ListFooterComponent={<LoadingModal visible={loading} />}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.5}
      ListEmptyComponent={
        <Text style={styles.emptyMessage}>
          Hiện không có khảo sát nào trong danh sách.
        </Text>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    backgroundColor: "#F3F4F6",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    color: "#111827",
  },
  surveyCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 16,
    marginBottom: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  icon: {
    marginRight: 20,
    alignSelf: "center",
  },
  surveyInfo: {
    flex: 1,
    justifyContent: "center",
  },
  surveyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 6,
  },
  surveyDescription: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
  },
  surveyStatus: {
    fontSize: 14,
    color: "#10B981",
  },
  emptyMessage: {
    textAlign: "center",
    color: "#888",
    marginTop: 20,
  },
});
