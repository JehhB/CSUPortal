import useAuth from "@/auth/useAuth";
import ScrollView from "@/shared/components/ScrollView";
import Surface from "@/shared/components/Surface";
import useStudentCompletion from "@/student/completion/useStudentCompletion";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Snackbar from "@/shared/components/Snackbar";
import Donut from "@/graphs/Donut";
import { theme } from "@/shared/constants/themes";

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<ParamListBase>>();
  const [hasError, showError] = useState(false);

  const { accessToken } = useAuth();
  const { completionQuery } = useStudentCompletion(accessToken);

  function dismissError() {
    showError(false);
  }

  function refetch() {
    completionQuery.refetch();
  }

  useEffect(() => {
    if (!completionQuery.isError) return;
    showError(true);
  }, [completionQuery.isError]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabLongPress", () => {
      refetch();
    });

    return unsubscribe;
  }, [navigation]);

  const completion = completionQuery.data;
  const progress = completion
    ? completion.FinishedSubjects / completion.SubjectCount
    : 0;
  const progressCount = completion
    ? `${completion.FinishedSubjects}/${completion.SubjectCount}`
    : "No subject found";
  const curriculum = completion ? completion.CurriculumCode : "No curriculum";

  const progressPercentage = `${Math.round(progress * 100)} %`;

  return (
    <>
      <ScrollView refreshing={completionQuery.isFetching} onRefresh={refetch}>
        <Surface>
          <Text variant="titleLarge" style={styles.titles}>
            Current Progress
          </Text>
          <View style={styles.completion}>
            <Donut
              style={styles.completionGraph}
              progress={progress}
              content={progressPercentage}
              subContent="Completion"
            />
            <View style={styles.completionInfo}>
              <Text variant="titleMedium" style={styles.completionInfoLabel}>
                Curriculum
              </Text>
              <Text variant="labelLarge" style={styles.completionInfoData}>
                {curriculum}
              </Text>
              <Text variant="titleMedium" style={styles.completionInfoLabel}>
                Finished Subject
              </Text>
              <Text variant="labelLarge" style={styles.completionInfoData}>
                {progressCount}
              </Text>
            </View>
          </View>
        </Surface>
      </ScrollView>
      <Snackbar
        visible={hasError}
        onDismiss={dismissError}
        content={
          completionQuery.error?.message ??
          "Unknown error encountered while fetching"
        }
      />
    </>
  );
}

const styles = StyleSheet.create({
  titles: {
    textAlign: "center",
    color: theme.colors.primary,
    marginBottom: 8,
  },
  completion: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 16,
    marginTop: 8,
  },
  completionGraph: {
    paddingHorizontal: 8,
    flexShrink: 1,
  },
  completionInfo: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 140,
  },
  completionInfoLabel: {
    textAlign: "center",
    fontSize: 20,
  },
  completionInfoData: {
    textAlign: "center",
    color: "#292524",
    fontSize: 16,
    marginBottom: 12,
  },
});
