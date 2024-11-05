import ScrollView from "@/shared/components/ScrollView";
import Surface from "@/shared/components/Surface";
import { Text } from "react-native-paper";

export default function HomeScreen() {
  return (
    <ScrollView
      onRefresh={(v) => {
        v.startRefreshing();
        console.log("started refreshing");
        window.setTimeout(() => {
          console.log("ended refreshing");
          v.endRefreshing();
        }, 2000);
      }}
    >
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
      <Surface>
        <Text variant="bodyMedium">test test</Text>
      </Surface>
    </ScrollView>
  );
}
