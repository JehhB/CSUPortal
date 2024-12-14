import { RobotoMedium, RobotoRegular, theme } from "@/shared/constants/themes";
import {
  ProfilePictureResponse,
  StudentProfile,
} from "@/student/profile/profileService";
import { useCallback, useEffect, useMemo, useState } from "react";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import { Image, Line, Rect, Svg, Text } from "react-native-svg";
import QRCode from "react-native-qrcode-svg";
import { G } from "react-native-svg";
import { Button, Portal, TouchableRipple } from "react-native-paper";
import Dialog from "@/shared/components/Dialog";
import profileQr from "@/student/profile/profileQr";

export type StudentIdProps = {
  profile: StudentProfile | null;
  pictures: ProfilePictureResponse | null;
};

const DPI = 130;
const WIDTH = 2.63 * DPI;
const HEIGHT = 3.88 * DPI;
const ASPECT_RATIO = WIDTH / HEIGHT;

const ID_SCALE = 0.8;
const ID_WIDTH = 1.4 * ID_SCALE * DPI;
const ID_HEIGHT = 1.8 * ID_SCALE * DPI;
const QR_SIZE = 1.6 * ID_SCALE * DPI;

const PADDING = 8;

export default function StudentId({ profile, pictures }: StudentIdProps) {
  const [dim, setDim] = useState([WIDTH, HEIGHT]);
  const [dialogWidth, setDialogWidth] = useState(0);
  const [qrValue, setQrValue] = useState<string | null>(null);

  useEffect(() => {
    profileQr.generate(profile).then((value) => {
      setQrValue(value);
    });
  }, [profile]);

  const onContainerLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const containerWidth = e.nativeEvent.layout.width;
      if (containerWidth === 0) return;
      if (containerWidth < WIDTH)
        return setDim([containerWidth, containerWidth / ASPECT_RATIO]);
      return setDim([WIDTH, HEIGHT]);
    },
    [setDim],
  );

  const name = useMemo(() => {
    if (profile === null) return null;

    return `${profile.LastName}, ${profile.FirstName}, ${profile.MiddleName[0]}.`.toUpperCase();
  }, [profile]);

  const [showQrEnlarge, setShowQrEnlarge] = useState(false);

  return (
    <View onLayout={onContainerLayout} style={[styles.centered]}>
      <View style={styles.card}>
        <Svg
          width={dim[0]}
          height={dim[1]}
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          onPress={() => {
            setShowQrEnlarge(true);
          }}
        >
          <Text
            x={WIDTH / 2}
            y={24}
            textAnchor="middle"
            fontSize={16}
            fontFamily={RobotoMedium}
          >
            CAGAYAN STATE UNIVERSITY
          </Text>
          <Text
            x={WIDTH / 2}
            y={40}
            textAnchor="middle"
            fontSize={12}
            fontFamily={RobotoRegular}
          >
            Carig Campus, Tuguegarao City
          </Text>

          <Line
            x1={PADDING}
            y1={52}
            x2={WIDTH - PADDING}
            y2={52}
            strokeWidth={3}
            strokeLinecap="round"
            stroke={theme.colors.outline}
          />

          <Rect
            x={PADDING - 1}
            y={71}
            width={ID_WIDTH + 2}
            height={ID_HEIGHT + 2}
            stroke={theme.colors.outline}
            strokeWidth={1}
            fill="transparent"
          />
          <Image
            x={PADDING}
            y={72}
            href={
              pictures?.profpic
                ? { uri: pictures.profpic }
                : require("@@/assets/images/no-profile.png")
            }
            width={ID_WIDTH}
            height={ID_HEIGHT}
          />

          {qrValue !== null && (
            <G
              transform={`translate(${WIDTH - QR_SIZE - PADDING}, ${72 + (ID_HEIGHT - QR_SIZE) / 2})`}
            >
              <QRCode
                value={qrValue}
                size={QR_SIZE}
                color={theme.colors.primary}
                logo={require("@@/assets/images/icon.png")}
                logoSize={QR_SIZE * 0.275}
                logoMargin={4}
              />
            </G>
          )}

          <Text
            textAnchor="middle"
            x={WIDTH / 2}
            y={312}
            fontFamily={RobotoRegular}
            fontSize={16}
          >
            {name}
          </Text>

          <Line
            x1={1.5 * PADDING}
            y1={320}
            x2={WIDTH - 3 * PADDING}
            y2={320}
            strokeWidth={1}
            strokeLinecap="round"
            stroke={theme.colors.outline}
          />

          <Text
            textAnchor="middle"
            x={WIDTH / 2}
            y={336}
            fontFamily={RobotoRegular}
            fontSize={12}
          >
            Name
          </Text>

          {pictures?.esig && (
            <Image
              x={0}
              y={348}
              width={WIDTH}
              height={52}
              href={{ uri: pictures.esig }}
            />
          )}

          <Line
            x1={1.5 * PADDING}
            y1={404}
            x2={WIDTH - 3 * PADDING}
            y2={404}
            strokeWidth={1}
            strokeLinecap="round"
            stroke={theme.colors.outline}
          />

          <Text
            textAnchor="middle"
            x={WIDTH / 2}
            y={420}
            fontFamily={RobotoRegular}
            fontSize={12}
          >
            Signature
          </Text>

          {profile !== null && (
            <>
              <Rect
                x={0}
                y={440}
                width={WIDTH}
                height={40}
                fill={profile.CollegeColor}
              />
              <Text
                fill="white"
                x={WIDTH / 2}
                textAnchor="middle"
                y={462}
                fontSize={12}
                fontFamily={RobotoRegular}
              >
                {profile.College}
              </Text>

              <Text
                x={WIDTH / 2}
                y={496}
                fontSize={10}
                fontFamily={RobotoRegular}
                textAnchor="middle"
              >
                {profile.IDNumber}
              </Text>
            </>
          )}
        </Svg>
      </View>
      <Portal>
        <Dialog
          visible={showQrEnlarge}
          onDismiss={() => setShowQrEnlarge(false)}
        >
          <Dialog.Title>Enlarged QR Code</Dialog.Title>
          <Dialog.Content
            style={styles.centered}
            onLayout={(e) => {
              setDialogWidth(Math.min(e.nativeEvent.layout.width, 400));
            }}
          >
            {qrValue && (
              <TouchableRipple onPress={() => setShowQrEnlarge(false)}>
                <QRCode
                  size={dialogWidth - 16}
                  value={qrValue}
                  color={theme.colors.primary}
                  backgroundColor="transparent"
                />
              </TouchableRipple>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => {
                setShowQrEnlarge(false);
              }}
            >
              Minimize
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    alignItems: "center",
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: theme.roundness,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: theme.colors.outlineVariant,
    marginTop: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 1, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
