import useAuth from "@/auth/useAuth";
import ScrollView from "@/shared/components/ScrollView";
import Surface from "@/shared/components/Surface";
import useStudentCompletion from "@/student/completion/useStudentCompletion";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";
import { DataTable, Portal, Text } from "react-native-paper";
import Snackbar from "@/shared/components/Snackbar";
import Donut from "@/graphs/Donut";
import { RopaSansRegularItalic, theme } from "@/shared/constants/themes";
import useStudentGwa from "@/student/gwa/useStudentGwa";
import useShowQueryError from "@/shared/hooks/useShowQueryError";
import GwaBarGraph from "@/graphs/GwaBarGraph";
import useStudentChecklist from "@/student/checklist/useStudentChecklist";
import currentGrade from "@/student/checklist/currentGrade";
import uniqBySem from "@/student/checklist/uniqBySem";
import findLastIndex from "lodash/findLastIndex";
import semLabel from "@/student/checklist/semLabel";
import { AdvisedSubject } from "@/student/checklist/checklistService";
import SubjectInfo from "@/shared/components/SubjectInfo";

export default function HomeScreen() {
  const [currentSem, setCurrentSem] = useState(0);
  const navigation = useNavigation<BottomTabNavigationProp<ParamListBase>>();
  const [currentSubject, setCurrentSubject] = useState<AdvisedSubject | null>(
    null,
  );
  const [subjectDialogShown, showSubjectDialog] = useState(false);

  const { accessToken } = useAuth();
  const { completionQuery } = useStudentCompletion(accessToken);
  const { gwaQuery, normalizedGwa } = useStudentGwa(accessToken);
  const { checklistQuery } = useStudentChecklist(accessToken);

  const { hasError, dismissError, errorMessage } = useShowQueryError([
    completionQuery,
    gwaQuery,
    checklistQuery,
  ]);

  const refetch = useCallback(
    () => {
      gwaQuery.refetch();
      completionQuery.refetch();
      checklistQuery.refetch();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [gwaQuery.refetch, completionQuery.refetch, checklistQuery.refetch],
  );

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

  const advisedSubjects = checklistQuery.data;
  const sems = useMemo(
    () => uniqBySem(advisedSubjects ?? []),
    [advisedSubjects],
  );
  const numberOfSems = useMemo(() => sems.length, [sems]);

  useEffect(() => {
    const currentSem = findLastIndex(sems, (subj) => !!subj.PeriodTaken);
    if (currentSem !== -1) setCurrentSem(currentSem);
  }, [sems]);

  const currentSubjects = useMemo(() => {
    const sem = sems.at(currentSem);
    if (
      sem === undefined ||
      advisedSubjects === null ||
      advisedSubjects === undefined
    )
      return [];
    return advisedSubjects.filter(
      (subj) =>
        subj.SubjectYearDescription === sem.SubjectYearDescription &&
        subj.TermDescription === sem.TermDescription,
    );
  }, [advisedSubjects, sems, currentSem]);

  const { curriculum, progressPercentage, progress, progressCount } =
    useMemo(() => {
      const completion = completionQuery.data;
      const progress =
        completion && completion.SubjectCount > 0
          ? completion.FinishedSubjects / completion.SubjectCount
          : 0;
      const progressCount =
        completion && completion.SubjectCount > 0
          ? `${completion.FinishedSubjects}/${completion.SubjectCount}`
          : "No subject found";
      const curriculum = completion
        ? completion.CurriculumCode
        : "No curriculum";

      const progressPercentage = `${Math.round(progress * 100)} %`;

      return { curriculum, progress, progressPercentage, progressCount };
    }, [completionQuery.data]);

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
        <Surface>
          <Text variant="titleLarge" style={styles.titles}>
            Advised Subjects
          </Text>
          <DataTable>
            <DataTable.Header style={styles.dataTableThickBorder}>
              <DataTable.Title style={styles.dataTableShort}>
                <Text variant="labelMedium" style={styles.dataTableHeader}>
                  Code
                </Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text variant="labelMedium" style={styles.dataTableHeader}>
                  Subject Description
                </Text>
              </DataTable.Title>
              <DataTable.Title
                style={[styles.dataTableShort, styles.dataTableRight]}
              >
                <Text variant="labelMedium" style={styles.dataTableHeader}>
                  Units
                </Text>
              </DataTable.Title>
              <DataTable.Title
                style={[styles.dataTableShort, styles.dataTableRight]}
              >
                <Text variant="labelMedium" style={styles.dataTableHeader}>
                  Remarks
                </Text>
              </DataTable.Title>
            </DataTable.Header>
            {currentSubjects.map((subject, index, array) => (
              <DataTable.Row
                key={subject.SubjectCode}
                style={[
                  index === array.length - 1 && styles.dataTableThickBorder,
                ]}
                onPress={() => {
                  setCurrentSubject(subject);
                  showSubjectDialog(true);
                }}
              >
                <DataTable.Cell style={styles.dataTableShort}>
                  <Text variant="labelMedium">{subject.SubjectCode}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text variant="labelMedium">
                    {subject.SubjectDescription}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell
                  style={[styles.dataTableShort, styles.dataTableRight]}
                >
                  <Text variant="labelMedium">{subject.Units}</Text>
                </DataTable.Cell>
                <DataTable.Cell
                  style={[styles.dataTableShort, styles.dataTableRight]}
                >
                  <Text variant="labelMedium">{subject.Description}</Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            <DataTable.Pagination
              page={currentSem}
              numberOfPages={numberOfSems}
              onPageChange={(page) => setCurrentSem(page)}
              style={styles.dataTablePagination}
              label={
                <Text variant="labelMedium" style={styles.dataTableHeader}>
                  {semLabel(sems.at(currentSem))}
                </Text>
              }
              showFastPaginationControls
            />
          </DataTable>
        </Surface>
      </ScrollView>
      <Snackbar
        visible={hasError}
        onDismiss={dismissError}
        content={errorMessage ?? "Unknown error encountered"}
      />
      <Portal>
        <SubjectInfo
          subject={currentSubject}
          visible={subjectDialogShown}
          onDismiss={() => {
            showSubjectDialog(false);
          }}
        />
      </Portal>
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
  dataTableHeader: {
    color: "#0c0a0999",
  },
  dataTableShort: {
    flexGrow: 0,
    flexShrink: 1,
    flexBasis: 64,
  },
  dataTablePagination: {
    flexWrap: "nowrap",
  },
  dataTableRight: {
    justifyContent: "flex-end",
  },
  dataTableThickBorder: {
    borderBottomWidth: 2,
  },
});
