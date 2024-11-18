import { AdvisedSubject } from "@/student/checklist/checklistService";
import { Button, DialogProps, Text } from "react-native-paper";
import Dialog from "./Dialog";
import { StyleSheet, View } from "react-native";
import { RopaSansRegularItalic } from "../constants/themes";
import semLabel from "@/student/checklist/semLabel";
import periodLabel from "@/student/periods/periodLabel";

export type SubjectInfoProps = Omit<DialogProps, "children"> & {
  subject: AdvisedSubject | null;
};
export default function SubjectInfo(props: SubjectInfoProps) {
  const { subject, ...dialogProps } = props;

  if (subject === null) return null;

  return (
    <Dialog {...dialogProps}>
      <Dialog.Title>
        {subject.SubjectDescription} ({subject.SubjectCode})
      </Dialog.Title>
      <Dialog.Content>
        <View style={styles.details}>
          <Text variant="titleMedium" style={styles.detailsLabel}>
            Prerequisite:
          </Text>
          <Text variant="titleMedium" style={styles.detailsInfo}>
            None
          </Text>
        </View>

        <View style={styles.details}>
          <Text variant="titleMedium" style={styles.detailsLabel}>
            Teacher:
          </Text>
          <Text variant="titleMedium" style={styles.detailsInfo}>
            {subject.Teacher}
          </Text>
        </View>

        <View style={styles.details}>
          <Text variant="titleMedium" style={styles.detailsLabel}>
            Units:
          </Text>
          <Text variant="titleMedium" style={styles.detailsInfo}>
            {subject.Units}
          </Text>
        </View>

        <View style={styles.details}>
          <Text variant="titleMedium" style={styles.detailsLabel}>
            Semester:
          </Text>
          <Text variant="titleMedium" style={styles.detailsInfo}>
            {semLabel(subject)}
          </Text>
        </View>

        <View style={styles.details}>
          <Text variant="titleMedium" style={styles.detailsLabel}>
            Period Taken:
          </Text>
          <Text variant="titleMedium" style={styles.detailsInfo}>
            {periodLabel(subject.PeriodTaken ?? null)}
          </Text>
        </View>

        <View style={styles.details}>
          <Text variant="titleMedium" style={styles.detailsLabel}>
            Remark:
          </Text>
          <Text variant="titleMedium" style={styles.detailsInfo}>
            {subject.Grade
              ? `${subject.Grade} (${subject.Description})`
              : subject.Description}
          </Text>
        </View>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={props.onDismiss}>Dismiss</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

const styles = StyleSheet.create({
  details: {
    flexDirection: "row",
    flexWrap: "nowrap",
    alignItems: "center",
  },
  detailsLabel: {
    marginStart: 8,
  },
  detailsInfo: {
    fontFamily: RopaSansRegularItalic,
    color: "#44403c",
    marginStart: 8,
  },
});
