import eventSlug from "@/scan/eventSlug";
import useScanEvents from "@/scan/useScanEvents";
import { ParamListBase, useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Redirect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ScrollView from "@/shared/components/ScrollView";
import Surface from "@/shared/components/Surface";
import common from "@/shared/constants/common";
import { DataTable, FAB, Portal, Text } from "react-native-paper";
import useScanAttendances from "@/scan/useAttendances";
import CameraDialog from "@/shared/components/CameraDialog";
import { StyleSheet } from "react-native";
import { theme } from "@/shared/constants/themes";
import profileQr from "@/student/profile/profileQr";
import orderBy from "lodash/orderBy";
import throttle from "lodash/throttle";
import useAuth from "@/auth/useAuth";
import useStudentProfile from "@/student/profile/useStudentProfile";
import { randomUUID } from "expo-crypto";

const ATTENDANCES_PER_PAGE = 10;

function formatTimestamp(timestamp: number) {
  const date = new Date(timestamp);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedMonth = month.toString().padStart(2, "0");
  const formattedDay = day.toString().padStart(2, "0");
  return `${formattedMonth}/${formattedDay} ${hours}:${minutes} ${ampm}`;
}

export default function Event() {
  const { event: eventParam } = useLocalSearchParams();

  const { events } = useScanEvents();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();

  const event = useMemo(() => {
    if (eventParam === undefined) return null;
    const slug = typeof eventParam === "string" ? eventParam : eventParam[0];
    return eventSlug.get(events, slug);
  }, [eventParam, events]);

  useEffect(() => {
    if (event === null) return;
    navigation.setOptions({ title: event.name });
  }, [event, navigation]);

  const { attendances, setAttendances } = useScanAttendances(event);

  const [currentPage, setCurrentPage] = useState(0);
  const numberOfPage = Math.max(
    Math.ceil(attendances.length / ATTENDANCES_PER_PAGE),
    1,
  );
  const offset = currentPage * ATTENDANCES_PER_PAGE;
  const currentAttendances = useMemo(
    () =>
      attendances.filter(
        (_, i) => i >= offset && i < offset + ATTENDANCES_PER_PAGE,
      ),
    [attendances, offset],
  );

  const { accessToken } = useAuth();
  const { profileQuery } = useStudentProfile(accessToken);

  const [openCamera, setOpenCamera] = useState(false);
  const [scanError, setScanError] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);

  const onSuccess = useCallback(
    (profile: {
      idNumber: string;
      lastName: string;
      firstName: string;
      idCreatedAt: number;
    }) => {
      for (const attendance of attendances) {
        if (Date.now() - attendance.scannedAt > 5000) break;
        if (
          attendance.idNumber === profile.idNumber &&
          attendance.idCreatedAt === profile.idCreatedAt
        ) {
          return;
        }
      }

      setScanSuccess(true);
      setScanError(false);
      setAttendances((prev) => {
        if (!profileQuery.data || !event) return prev;
        const temp = [
          {
            id: randomUUID(),
            ...profile,
            eventId: event.id,
            scannedAt: Date.now(),
            scannedBy: `${profileQuery.data.FirstName} ${profileQuery.data.LastName}`,
          },
          ...prev,
        ];
        return orderBy(temp, ["scannedAt"], ["desc"]);
      });
    },
    [event, profileQuery.data, setAttendances, attendances],
  );

  const onError = useCallback(
    throttle(() => {
      setScanSuccess(false);
      setScanError(true);
    }, 500),
    [setScanError, setScanSuccess],
  );

  if (event === null) return <Redirect href="/scan" />;
  return (
    <>
      <ScrollView refreshing={profileQuery.isFetching}>
        <Surface>
          <Text variant="titleLarge" style={common.titles}>
            Attendances
          </Text>
          <DataTable>
            <DataTable.Header style={common.dataTableThickBorder}>
              <DataTable.Title>
                <Text variant="labelMedium" style={common.dataTableHeader}>
                  ID Number
                </Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text variant="labelMedium" style={common.dataTableHeader}>
                  Name
                </Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text variant="labelMedium" style={common.dataTableHeader}>
                  Time scanned
                </Text>
              </DataTable.Title>
            </DataTable.Header>
            {currentAttendances.length === 0 && (
              <DataTable.Row>
                <DataTable.Cell style={common.justifyCenter}>
                  <Text variant="labelMedium" style={common.hint}>
                    No records yet
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            )}
            {currentAttendances.map((attendance, index, array) => (
              <DataTable.Row
                key={attendance.id}
                style={[
                  index === array.length - 1 && common.dataTableThickBorder,
                ]}
              >
                <DataTable.Cell>
                  <Text variant="labelMedium">{attendance.idNumber}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text variant="labelMedium">
                    {attendance.lastName}, {attendance.firstName}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text variant="labelMedium">
                    {formatTimestamp(attendance.scannedAt)}
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
            <DataTable.Pagination
              page={currentPage}
              numberOfPages={numberOfPage}
              onPageChange={(page) => setCurrentPage(page)}
              style={common.dataTablePagination}
              label={
                <Text variant="labelMedium" style={common.dataTableHeader}>
                  Showing page {currentPage + 1} of {numberOfPage}
                </Text>
              }
              showFastPaginationControls
            />
          </DataTable>
        </Surface>
      </ScrollView>
      <Portal>
        <FAB
          theme={{
            colors: {
              primaryContainer: theme.colors.secondary,
              onPrimaryContainer: theme.colors.primary,
            },
          }}
          style={styles.fab}
          onPress={() => {
            setOpenCamera(true);
          }}
          icon="qrcode-scan"
        />
        <CameraDialog
          title="Scan Student ID"
          visible={openCamera}
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          onDismiss={() => setOpenCamera(false)}
          success={scanSuccess}
          onDismissSuccess={() => {
            setScanSuccess(false);
          }}
          error={scanError}
          onDismissError={() => {
            setScanError(false);
          }}
          onBarcodeScanned={(code) => {
            profileQr.verify(code.data).then((profile) => {
              if (profile === null) onError();
              else onSuccess(profile);
            });
          }}
        />
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 16,
    right: 16,
  },
});
