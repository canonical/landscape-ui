export interface ModalConfirmationFormProps {
  deliver_after: string;
  deliverImmediately: boolean;
  action: "reboot" | "shutdown" | null;
}
