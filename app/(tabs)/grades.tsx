import useAuth from "@/auth/useAuth";
import ScrollView from "@/shared/components/ScrollView";
import SubjectInfo from "@/shared/components/SubjectInfo";
import Surface from "@/shared/components/Surface";
import { theme } from "@/shared/constants/themes";
import useShowQueryError from "@/shared/hooks/useShowQueryError";
import { AdvisedSubject } from "@/student/checklist/checklistService";
import useStudentChecklist from "@/student/checklist/useStudentChecklist";
import useStudentPeriod from "@/student/periods/useStudentPeriod";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { DataTable, Portal, Text } from "react-native-paper";
import Snackbar from "@/shared/components/Snackbar";
import periodLabel from "@/student/periods/periodLabel";

export default function Grades() {
  const [currentSubject, setCurrentSubject] = useState<AdvisedSubject | null>(
    null,
  );
  const [subjectDialogShown, showSubjectDialog] = useState(false);
  const [periodIndex, setPeriodIndex] = useState(0);

  const { accessToken } = useAuth();
  const { periodQuery } = useStudentPeriod(accessToken);
  const { checklistQuery } = useStudentChecklist(accessToken);

  const navigation = useNavigation<BottomTabNavigationProp<ParamListBase>>();

  const { hasError, dismissError, errorMessage } = useShowQueryError([
    periodQuery,
    checklistQuery,
  ]);

  const refetch = useCallback(() => {
    periodQuery.refetch();
    checklistQuery.refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checklistQuery.refetch, periodQuery.refetch]);

  const isRefetching = periodQuery.isRefetching || checklistQuery.isRefetching;

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabLongPress", () => {
      refetch();
    });

    return unsubscribe;
  }, [refetch, navigation]);

  const periods = useMemo(
    () => [...(periodQuery.data ?? [])].reverse(),
    [periodQuery.data],
  );

  useEffect(() => {
    setPeriodIndex(periods.length - 1);
  }, [periods]);

  const currentPeriod = useMemo(
    () => periods.at(periodIndex) ?? null,
    [periods, periodIndex],
  );

  const currentSubjects = useMemo(() => {
    const subjects = checklistQuery.data;
    if (subjects === null || subjects === undefined) return [];
    return subjects.filter(
      (subj) => currentPeriod !== null && subj.PeriodTaken === currentPeriod,
    );
  }, [currentPeriod, checklistQuery.data]);

  const { average, units } = useMemo(() => {
    const { grade, units } = currentSubjects.reduce(
      (a, b) => {
        try {
          const grade = Number.parseFloat(b.Grade ?? "0") * b.Units;
          return { grade: grade + a.grade, units: a.units + b.Units };
        } catch (error) {
          console.warn(error);
          return a;
        }
      },
      { grade: 0, units: 0 },
    );

    if (units === 0) return { average: 0, units: 0 };
    return { average: grade / units, units };
  }, [currentSubjects]);

  const numberOfPeriods = useMemo(
    () => periodQuery.data?.length ?? 0,
    [periodQuery.data],
  );

  return (
    <>
      <ScrollView refreshing={isRefetching} onRefresh={refetch}>
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
                  Grade
                </Text>
              </DataTable.Title>
            </DataTable.Header>
            {currentSubjects.map((subject, index, arr) => (
              <DataTable.Row
                key={subject.SubjectCode}
                onPress={() => {
                  setCurrentSubject(subject);
                  showSubjectDialog(true);
                }}
                style={[
                  index === arr.length - 1 && styles.dataTableThickBorder,
                ]}
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
                  <Text variant="labelMedium">
                    {subject.Grade ?? "NO GRADE"}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            <DataTable.Row
              style={styles.dataTableThickBorder}
              pointerEvents="none"
            >
              <DataTable.Cell style={styles.dataTableRight}>
                <Text
                  variant="labelMedium"
                  style={[styles.dataTableHeader, styles.pointerEventNone]}
                >
                  Weighted Average
                </Text>
              </DataTable.Cell>
              <DataTable.Cell
                style={[
                  styles.dataTableShort,
                  styles.dataTableRight,
                  styles.pointerEventNone,
                ]}
              >
                <Text variant="labelMedium">{units}</Text>
              </DataTable.Cell>
              <DataTable.Cell
                style={[
                  styles.dataTableShort,
                  styles.dataTableRight,
                  styles.pointerEventNone,
                ]}
              >
                <Text variant="labelMedium">{average.toFixed(2)}</Text>
              </DataTable.Cell>
            </DataTable.Row>

            <DataTable.Pagination
              page={periodIndex}
              numberOfPages={numberOfPeriods}
              onPageChange={(page) => setPeriodIndex(page)}
              style={styles.dataTablePagination}
              label={
                <Text variant="labelMedium" style={styles.dataTableHeader}>
                  {periodLabel(currentPeriod)}
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
  pointerEventNone: {
    pointerEvents: "none",
  },
});
