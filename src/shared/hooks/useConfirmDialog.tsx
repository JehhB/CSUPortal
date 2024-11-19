import { ReactNode, SetStateAction, useCallback, useState } from "react";
import { ButtonProps, DialogProps } from "react-native-paper";
import ConfirmDialog from "../components/ConfirmDialog";

export type ConfirmDialogConfig = {
  title: ReactNode;
  description: ReactNode;
  confirm: ButtonProps;
};

export default function useConfirmDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<ConfirmDialogConfig>({
    title: "",
    description: "",
    confirm: { children: "Confirm" },
  });

  const showConfirmDialog = useCallback(
    (config: SetStateAction<ConfirmDialogConfig>) => {
      setDialogConfig(config);
      setIsOpen(true);
    },
    [setDialogConfig, setIsOpen],
  );

  const dismissDialog = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const _ConfirmDialog = useCallback(
    (props: Omit<DialogProps, "children" | "visible" | "onDismiss">) => (
      <ConfirmDialog
        visible={isOpen}
        onDismiss={() => dismissDialog()}
        {...dialogConfig}
        {...props}
      />
    ),
    [isOpen, dialogConfig, dismissDialog],
  );

  return {
    showConfirmDialog,
    dismissDialog,
    ConfirmDialog: _ConfirmDialog,
  };
}
