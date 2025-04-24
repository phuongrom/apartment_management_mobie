import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import apiService from "@/services/apiService";
import { Ionicons } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SurveyDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [survey, setSurvey] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const res = await apiService.getSurveyDetail(id);
        setSurvey(res);
      } catch (err) {
        console.error("Lỗi khi tải khảo sát:", err);
        Alert.alert("Lỗi", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [id]);

  const handleSelectChoice = (questionId, choiceId) => {
    setAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleTextChange = (questionId, text) => {
    setAnswers((prev) => ({ ...prev, [questionId]: text }));
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(answers)
      .map(([questionId, value]) => {
        const question = survey.questions.find(
          (q) => q.id === parseInt(questionId)
        );
        if (!question) return null;

        if (question.question_type === "MC") {
          return {
            question_id: question.id,
            choice_id: value,
          };
        } else if (question.question_type === "TXT") {
          return {
            question_id: question.id,
            answer_text: value,
          };
        }
        return null;
      })
      .filter(Boolean);

    setSubmitting(true);
    try {
      await apiService.submitSurveyResponse(survey.id, {
        survey: survey.id,
        answers: formattedAnswers,
      });

      Alert.alert("Thành công", "Cảm ơn bạn đã gửi phản hồi!");
      router.back();
    } catch (err) {
      console.error("Lỗi gửi phản hồi:", err);
      Alert.alert("Lỗi", err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const renderQuestion = (question) => (
    <View key={question.id} style={styles.questionBlock}>
      <Text style={styles.questionText}>{question.question_text}</Text>
      {question.question_type === "MC" &&
        question.choices.map((choice) => (
          <TouchableOpacity
            key={choice.id}
            style={[
              styles.choice,
              answers[question.id] === choice.id && styles.choiceSelected,
            ]}
            onPress={() => handleSelectChoice(question.id, choice.id)}
          >
            <Text
              style={[
                styles.choiceText,
                answers[question.id] === choice.id && styles.choiceTextSelected,
              ]}
            >
              {choice.choice_text}
            </Text>
          </TouchableOpacity>
        ))}
      {question.question_type === "TXT" && (
        <TextInput
          style={styles.input}
          placeholder="Nhập câu trả lời..."
          value={answers[question.id] || ""}
          onChangeText={(text) => handleTextChange(question.id, text)}
          multiline
        />
      )}
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  if (!survey) {
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy khảo sát.</Text>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.OS === "ios" ? 130 : 150}
      enableOnAndroid={true}
    >
      <View style={styles.header}>
        <Ionicons name="clipboard-outline" size={30} color="#3B82F6" />
        <View style={{ marginLeft: 12 }}>
          <Text style={styles.title}>{survey.title}</Text>
          <Text style={styles.description}>{survey.description}</Text>
        </View>
      </View>

      {survey.questions.map(renderQuestion)}

      <TouchableOpacity
        style={styles.submitButton}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitButtonText}>Gửi phản hồi</Text>
        )}
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 50,
    backgroundColor: "#F9FAFB",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  questionBlock: {
    marginBottom: 24,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2937",
    marginBottom: 12,
  },
  choice: {
    padding: 12,
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    marginBottom: 10,
  },
  choiceSelected: {
    backgroundColor: "#2563EB",
  },
  choiceText: {
    color: "#1F2937",
  },
  choiceTextSelected: {
    color: "#fff",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#fff",
    borderColor: "#D1D5DB",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
