import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import type { ReactNode } from "react";
import type { PublicationTargetWithPublications } from "../types";
import usePublicationTargets from "./usePublicationTargets";

interface DeleteModalResult {
  deleteModalTitle: string;
  deleteModalButtonLabel: string;
  deleteModalBody: ReactNode;
  isRemoving: boolean;
  onConfirmDelete: () => Promise<void>;
}

interface DeleteModalProps {
  target: PublicationTargetWithPublications | null;
  afterSuccess: () => void;
}

export const useDeleteTargetModal = ({
  target,
  afterSuccess,
}: DeleteModalProps): DeleteModalResult => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { removePublicationTargetQuery } = usePublicationTargets();
  const { mutateAsync: removeTarget, isPending: isRemoving } =
    removePublicationTargetQuery;

  if (!target) {
    return {
      deleteModalTitle: "",
      deleteModalButtonLabel: "",
      deleteModalBody: <></>,
      isRemoving: false,
      onConfirmDelete: () => Promise.resolve(),
    };
  }

  const handleDelete = async (): Promise<void> => {
    try {
      await removeTarget({ name: target.name });
      notify.success({
        message: `"${target.display_name}" publication target removed successfully`,
        title: "Publication target removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      afterSuccess();
    }
  };

  const commonModalFields = {
    deleteModalTitle: `Remove ${target.display_name}`,
    isRemoving,
    onConfirmDelete: handleDelete,
  };

  if (target.publications.length === 0) {
    return {
      ...commonModalFields,
      deleteModalButtonLabel: "Remove target",
      deleteModalBody: (
        <p>
          Removing this publication target will cause these publications to no longer be able to publish to it.
          <b>This action is irreversible</b>.
        </p>
      ),
    };
  }

  return {
    ...commonModalFields,
    deleteModalButtonLabel: "Delete target and publications",
    deleteModalBody: (
      <>
        <p>
          This publication target has the following associated publications:
        </p>
        <ul>
          {target.publications.map((pub) => (
            <li key={pub.publication_id}>{pub.display_name}</li>
          ))}
        </ul>
        <p>
          Deleting this target will also remove its associated publications.
          <br />
          This action is <b>irreversible</b>.
        </p>
      </>
    ),
  };
};
