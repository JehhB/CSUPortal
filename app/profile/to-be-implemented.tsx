import ScrollView from "@/shared/components/ScrollView";
import { router } from "expo-router";
import { Banner } from "react-native-paper";

export default function ToBeImplemented() {
  return (
    <ScrollView>
      <Banner
        visible
        icon="progress-clock"
        actions={[
          { label: "Go back", onPress: () => router.navigate("/home") },
        ]}
      >
        This feature is not available yet but will be implemented soon. Stay
        tuned for updates!
      </Banner>
    </ScrollView>
  );
}
