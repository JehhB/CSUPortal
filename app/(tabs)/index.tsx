import useAuth from "@/auth/useAuth";
import ScrollView from "@/shared/components/ScrollView";
import Surface from "@/shared/components/Surface";
import useStudentCompletion from "@/student/completion/useStudentCompletion";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";

export default function HomeScreen() {
  const { accessToken } = useAuth();
  const { completionQuery } = useStudentCompletion(accessToken);

  return (
    <ScrollView
      refreshing={completionQuery.isFetching}
      onRefresh={() => completionQuery.refetch()}
    >
      <Surface>
        <Text variant="titleLarge" style={styles.titles}>
          Current Progress
        </Text>
        <Text>{JSON.stringify(completionQuery.data)}</Text>
      </Surface>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titles: {
    textAlign: "center",
  },
});
