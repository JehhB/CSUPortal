import useScanEvents from "@/scan/useScanEvents";
import ScrollView from "@/shared/components/ScrollView";
import Surface from "@/shared/components/Surface";
import {
  FAB,
  DataTable,
  Portal,
  Text,
  Menu,
  Button,
  TouchableRipple,
} from "react-native-paper";
import { TextInput as NativeTextInput } from "react-native";
import Dialog from "@/shared/components/Dialog";
import common from "@/shared/constants/common";
import { useCallback, useMemo, useRef, useState } from "react";
import { theme } from "@/shared/constants/themes";
import TextInput from "@/shared/components/TextInput";
import { randomUUID } from "expo-crypto";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import eventSlug from "@/scan/eventSlug";
import { router } from "expo-router";
import QRCode from "react-native-qrcode-svg";
import useStudentProfile from "@/student/profile/useStudentProfile";
import useAuth from "@/auth/useAuth";
import CameraDialog from "@/shared/components/CameraDialog";
import { Event } from "@/scan/EventsProvider";
import sortedUniqBy from "lodash/sortedUniqBy";
import throttle from "lodash/throttle";
import orderBy from "lodash/orderBy";

const EVENT_PER_PAGE = 5;

function formatTimestamp(time: number) {
  const date = new Date(time);
  const formattedDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  return formattedDate;
}

async function parseEvent(
  json: string,
  owner: string | null,
): Promise<Event | null> {
  try {
    const parsed = JSON.parse(json);

    if (
      typeof parsed.id === "string" &&
      typeof parsed.creator === "string" &&
      typeof parsed.name === "string" &&
      typeof parsed.dateCreated === "number"
    ) {
      const event = parsed as Event;
      event.owner = owner;

      return await eventSlug.slugify(parsed);
    }

    return null;
  } catch (e) {
    console.warn(e);
    return null;
  }
}

export default function ScanIndex() {
  const { accessToken } = useAuth();
  const { profileQuery } = useStudentProfile(accessToken);
  const inputRef = useRef<NativeTextInput | null>(null);
  const { events, setEvents } = useScanEvents();
  const [currentPage, setCurrentPage] = useState(0);

  const me = useMemo(
    () =>
      profileQuery.data
        ? {
            name: `${profileQuery.data.FirstName} ${profileQuery.data.LastName}`,
            id: profileQuery.data.IDNumber,
          }
        : { name: null, id: null },
    [profileQuery.data],
  );

  const numberOfPage = Math.max(Math.ceil(events.length / EVENT_PER_PAGE), 1);
  const offset = currentPage * EVENT_PER_PAGE;
  const currentEvents = useMemo(
    () =>
      events
        .filter((e) => e.owner === me.id)
        .filter((_, i) => i >= offset && i < offset + EVENT_PER_PAGE),
    [events, offset, me],
  );

  const [eventName, setEventName] = useState("");
  const [inputState, setInputState] = useState({
    visible: false,
    title: "Create new event",
    action: "Create",
    onPress: (data: string) => {},
  });
  const [menuState, setMenuState] = useState({
    visible: false,
    x: 0,
    y: 0,
    eventId: null as string | null,
    eventName: "",
  });

  const dismissMenu = useCallback(() => {
    setMenuState((p) => ({ ...p, visible: false }));
  }, [setMenuState]);
  const [deleteDialog, setDeleteDialog] = useState({
    visible: false,
    target: null as string | null,
  });

  const [qrState, setQrState] = useState({
    visible: false,
    width: 500,
    value: "",
  });

  const createEvent = useCallback(() => {
    setEventName("");
    setInputState({
      visible: true,
      title: "Create new event",
      action: "Create",
      onPress: (data) => {
        eventSlug
          .slugify({
            creator: me.name,
            owner: me.id,
            id: randomUUID(),
            name: data,
            dateCreated: Date.now(),
          })
          .then((newEvent) => {
            setEvents((events) => [newEvent, ...events]);
          });
      },
    });
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [setEventName, setInputState, setEvents, me]);

  const [showCamera, setShowCamera] = useState(false);
  const [scanError, setScanError] = useState(false);
  const [isFabOpen, setIsFabOpen] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggerError = useCallback(
    throttle(() => setScanError(true), 2500),
    [setScanError],
  );

  return (
    <>
      <ScrollView
        refreshing={profileQuery.isFetching}
        onRefresh={() => profileQuery.refetch()}
      >
        <Surface>
          <Text variant="titleLarge" style={common.titles}>
            Events
          </Text>
          <DataTable>
            <DataTable.Header style={common.dataTableThickBorder}>
              <DataTable.Title>
                <Text variant="labelMedium" style={common.dataTableHeader}>
                  Event Name
                </Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text variant="labelMedium" style={common.dataTableHeader}>
                  Creator
                </Text>
              </DataTable.Title>
              <DataTable.Title>
                <Text variant="labelMedium" style={common.dataTableHeader}>
                  Date Created
                </Text>
              </DataTable.Title>
            </DataTable.Header>
            {currentEvents.length === 0 && (
              <DataTable.Row>
                <DataTable.Cell style={common.justifyCenter}>
                  <Text variant="labelMedium" style={common.hint}>
                    Add event to get started
                  </Text>
                </DataTable.Cell>
              </DataTable.Row>
            )}
            {currentEvents.map((event, index, array) => (
              <DataTable.Row
                key={event.id}
                style={[
                  index === array.length - 1 && common.dataTableThickBorder,
                ]}
                onPress={() => {
                  if (!event.slug) return;
                  router.replace(`/scan/${event.slug}`);
                }}
                onLongPress={(e) => {
                  setMenuState({
                    visible: true,
                    x: e.nativeEvent.pageX,
                    y: e.nativeEvent.pageY,
                    eventId: event.id,
                    eventName: event.name,
                  });
                }}
              >
                <DataTable.Cell>
                  <Text variant="labelMedium">{event.name}</Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text variant="labelMedium">
                    {event.creator === null
                      ? "Anonymous"
                      : event.creator === me.name
                        ? "me"
                        : event.creator}
                  </Text>
                </DataTable.Cell>
                <DataTable.Cell>
                  <Text variant="labelMedium">
                    {formatTimestamp(event.dateCreated)}
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
        <FAB.Group
          theme={{
            colors: {
              primaryContainer: theme.colors.secondary,
              onPrimaryContainer: theme.colors.primary,
              secondary: theme.colors.primary,
            },
          }}
          open={isFabOpen}
          icon={isFabOpen ? "close" : "plus"}
          onStateChange={({ open }) => {
            setIsFabOpen(open);
          }}
          actions={[
            {
              icon: "qrcode-scan",
              label: "Join",
              onPress: () => {
                setShowCamera(true);
              },
            },
            {
              icon: "plus",
              label: "Create",
              onPress: () => {
                createEvent();
              },
            },
          ]}
          visible
        />
        <Dialog visible={inputState.visible}>
          <Dialog.Title>{inputState.title}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              ref={inputRef}
              label="Name of event"
              value={eventName}
              onChangeText={(text) => setEventName(text)}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setInputState((p) => ({ ...p, visible: false }))}
            >
              Dismiss
            </Button>
            <Button
              onPress={() => {
                inputState.onPress(eventName);
                setInputState((p) => ({ ...p, visible: false }));
              }}
            >
              {inputState.action}
            </Button>
          </Dialog.Actions>
        </Dialog>
        <ConfirmDialog
          visible={deleteDialog.visible}
          onDismiss={() => setDeleteDialog((p) => ({ ...p, visible: false }))}
          title="Delete event"
          description="Are you sure you want to delete event? Event data and records cannot be retreive after."
          confirm={{
            children: "Confirm",
            onPress: () => {
              setDeleteDialog((p) => ({ ...p, visible: false }));
              setEvents((events) =>
                events.filter((e) => e.id !== deleteDialog.target),
              );
            },
          }}
        />
        <Menu
          visible={menuState.visible}
          anchor={menuState}
          onDismiss={dismissMenu}
        >
          <Menu.Item
            dense
            title="Edit"
            leadingIcon="pencil"
            onPress={() => {
              setMenuState((p) => ({ ...p, visible: false }));
              setEventName(menuState.eventName);
              setInputState({
                visible: true,
                title: "Edit event",
                action: "Save",
                onPress: (data) => {
                  const event = events.find((e) => e.id === menuState.eventId);
                  if (event === undefined) return;
                  eventSlug
                    .slugify({ ...event, name: data })
                    .then((editedEvent) => {
                      setEvents((events) =>
                        events.map((e) =>
                          e.id === editedEvent.id ? editedEvent : e,
                        ),
                      );
                    });
                },
              });
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
          />
          <Menu.Item
            dense
            title="Share"
            leadingIcon="qrcode"
            onPress={() => {
              const event = events.find((e) => e.id === menuState.eventId);
              if (!event) return;
              const qr = {
                creator: me,
                name: event.name,
                id: event.id,
                dateCreated: event.dateCreated,
              };

              setMenuState((p) => ({ ...p, visible: false }));
              setQrState({
                visible: true,
                width: 400,
                value: JSON.stringify(qr),
              });
            }}
          />
          <Menu.Item
            dense
            title="Delete"
            leadingIcon="trash-can"
            onPress={() => {
              setMenuState((p) => ({ ...p, visible: false }));
              setDeleteDialog({ visible: true, target: menuState.eventId });
            }}
          />
        </Menu>
        <Dialog visible={qrState.visible}>
          <Dialog.Title>Add as event manager</Dialog.Title>
          <Dialog.Content
            style={common.itemsCenter}
            onLayout={(e) => {
              if (e.nativeEvent.layout.width === 0) return;
              setQrState((p) => ({
                ...p,
                width: Math.min(e.nativeEvent.layout.width, 400),
              }));
            }}
          >
            {qrState.value && (
              <TouchableRipple
                onPress={() => setQrState((p) => ({ ...p, visible: false }))}
              >
                <QRCode
                  size={qrState.width - 16}
                  value={qrState.value}
                  color={theme.colors.primary}
                  backgroundColor="transparent"
                />
              </TouchableRipple>
            )}
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              onPress={() => setQrState((p) => ({ ...p, visible: false }))}
            >
              Minimize
            </Button>
          </Dialog.Actions>
        </Dialog>
        <CameraDialog
          visible={showCamera}
          onDismiss={() => setShowCamera(false)}
          title="Scan event's QR Code"
          barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          error={scanError}
          onDismissError={() => setScanError(false)}
          onBarcodeScanned={(code) => {
            parseEvent(code.data, me.id).then((event) => {
              if (event === null) {
                triggerError();
                return;
              }
              setShowCamera(false);
              setEvents((prev) => {
                const events = [event, ...prev];
                orderBy(events, ["dateCreated"], ["desc"]);
                return sortedUniqBy(events, "id");
              });
            });
          }}
        />
      </Portal>
    </>
  );
}
