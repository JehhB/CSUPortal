import useAuth from "@/auth/useAuth";
import ScrollView from "@/shared/components/ScrollView";
import Surface from "@/shared/components/Surface";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { useCallback, useEffect } from "react";
import useStudentSchedule from "@/student/schedule/useStudentSchedule";
import Snackbar from "@/shared/components/Snackbar";
import useShowQueryError from "@/shared/hooks/useShowQueryError";
import { StyleSheet } from "react-native";
import common from "@/shared/constants/common";
import { Text } from "react-native-paper";
import ClassSchedule from "@/graphs/ClassSchedule";

export default function HomeScreen() {
  const { accessToken } = useAuth();
  const { scheduleQuery } = useStudentSchedule(accessToken);

  const navigation = useNavigation<BottomTabNavigationProp<ParamListBase>>();

  const refetch = useCallback(
    () => {
      scheduleQuery.refetch();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [scheduleQuery.refetch],
  );

  const { hasError, dismissError, errorMessage } = useShowQueryError([
    scheduleQuery,
  ]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("tabLongPress", () => {
      refetch();
    });

    return unsubscribe;
  }, [refetch, navigation]);

  return (
    <>
      <ScrollView refreshing={scheduleQuery.isRefetching} onRefresh={refetch}>
        <Surface>
          <Text variant="titleLarge" style={styles.titles}>
            Class Schedule
          </Text>
          <ClassSchedule classSchedule={scheduleQuery.data} maxWidth={350} />
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
  ...common,
});
