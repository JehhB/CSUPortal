import useAuth from "@/auth/useAuth";
import ScrollView from "@/shared/components/ScrollView";
import Surface from "@/shared/components/Surface";
import useStudentCompletion from "@/student/completion/useStudentCompletion";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Text } from "react-native-paper";
import Snackbar from "@/shared/components/Snackbar";
import Donut from "@/graphs/Donut";
import { RopaSansRegularItalic, theme } from "@/shared/constants/themes";
import useStudentGwa from "@/student/gwa/useStudentGwa";
import useShowQueryError from "@/shared/hooks/useShowQueryError";
import GwaBarGraph from "@/graphs/GwaBarGraph";
import useStudentChecklist from "@/student/checklist/useStudentChecklist";
import currentGrade from "@/student/checklist/currentGrade";

export default function HomeScreen() {
  const navigation = useNavigation<BottomTabNavigationProp<ParamListBase>>();

  const { accessToken } = useAuth();
  const { completionQuery } = useStudentCompletion(accessToken);
  const { gwaQuery, normalizedGwa } = useStudentGwa(accessToken);
  const { checklistQuery } = useStudentChecklist(accessToken);

  const { hasError, dismissError, errorMessage } = useShowQueryError([
    completionQuery,
    gwaQuery,
    checklistQuery,
  ]);

  const refetch = useCallback(() => {
    gwaQuery.refetch();
    completionQuery.refetch();
    checklistQuery.refetch();
  }, [gwaQuery, completionQuery, checklistQuery]);

  const isRefetching =
    gwaQuery.isRefetching ||
    completionQuery.isRefetching ||
    checklistQuery.isRefetching;

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabLongPress", () => {
      refetch();
    });

    return unsubscribe;
  }, [refetch, navigation]);

  const completion = completionQuery.data;
  const progress =
    completion && completion.SubjectCount > 0
      ? completion.FinishedSubjects / completion.SubjectCount
      : 0;
  const progressCount =
    completion && completion.SubjectCount > 0
      ? `${completion.FinishedSubjects}/${completion.SubjectCount}`
      : "No subject found";
  const curriculum = completion ? completion.CurriculumCode : "No curriculum";

  const progressPercentage = `${Math.round(progress * 100)} %`;

  return (
    <>
      <ScrollView refreshing={isRefetching} onRefresh={refetch}>
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
        <Surface>
          <Text variant="titleLarge" style={styles.titles}>
            General Weighted Average per Semester
          </Text>
          <GwaBarGraph gwa={normalizedGwa} maxWidth={350} />
        </Surface>
        <Surface>
          <Text variant="titleLarge" style={styles.titles}>
            Computed General Weighted Average
          </Text>
          {checklistQuery.data ? (
            <Text variant="headlineSmall" style={styles.gwaInfo}>
              {(() => {
                const [gwa, units] = currentGrade(checklistQuery.data);
                return `${gwa.toFixed(2)} (${units} units)`;
              })()}
            </Text>
          ) : (
            <Text variant="titleLarge" style={styles.gwaInfo}>
              No grade data
            </Text>
          )}
        </Surface>
      </ScrollView>
      <Snackbar
        visible={hasError}
        onDismiss={dismissError}
        content={errorMessage ?? "Unknown error encountered"}
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
    flex: 1,
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
  gwaInfo: {
    textAlign: "center",
    fontFamily: RopaSansRegularItalic,
    color: "#292524",
  },
});
