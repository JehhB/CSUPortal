import { Button, DialogProps, Text } from "react-native-paper";
import { ConfirmDialogConfig } from "../hooks/useConfirmDialog";
import Dialog from "./Dialog";

export type ConfirmDialogProps = Omit<DialogProps, "children"> &
  ConfirmDialogConfig;

export default function ConfirmDialog(props: ConfirmDialogProps) {
  const { title, description, confirm, ...dialogProps } = props;
  return (
    <Dialog {...dialogProps}>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Content>
        <Text variant="bodyMedium">{description}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button
          onPress={() => dialogProps.onDismiss && dialogProps.onDismiss()}
        >
          Cancel
        </Button>
        <Button {...confirm} />
      </Dialog.Actions>
    </Dialog>
  );
}
