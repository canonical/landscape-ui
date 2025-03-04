import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import { useDeleteEmployeeGroups } from "../api";
import type { EmployeeGroup } from "../types";
import { getRemoveEmployeeGroupsModalTexts } from "./helpers";

interface UseRemoveEmployeeGroupsModalProps {
  readonly selectedEmployeeGroups: EmployeeGroup[];
  readonly onSuccess?: () => void;
}

const useRemoveEmployeeGroupsModal = ({
  selectedEmployeeGroups,
  onSuccess,
}: UseRemoveEmployeeGroupsModalProps) => {
  const { notify } = useNotify();
  const debug = useDebug();

  const { deleteEmployeeGroups, isPending } = useDeleteEmployeeGroups();

  const { title, body, notificationText, notificationTitle } =
    getRemoveEmployeeGroupsModalTexts(selectedEmployeeGroups);

  const handleDeleteEmployeeGroups = async () => {
    try {
      await deleteEmployeeGroups({
        ids: selectedEmployeeGroups.map((group) => group.id),
      });

      notify.success({
        title: notificationTitle,
        message: notificationText,
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      debug(error);
    }
  };

  return {
    body,
    confirmButtonLabel: "Remove",
    confirmButtonAppearance: "negative",
    deleteEmployeeGroups: handleDeleteEmployeeGroups,
    isLoading: isPending,
    title,
  };
};

export default useRemoveEmployeeGroupsModal;
