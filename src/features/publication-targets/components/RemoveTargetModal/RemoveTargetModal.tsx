import type { TextConfirmationModalProps } from "@/components/form/TextConfirmationModal";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import useDebug from "@/hooks/useDebug";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import type { FC } from "react";
import useGetPublicationsByTarget from "../../api/useGetPublicationsByTarget";
import useRemovePublicationTarget from "../../api/useRemovePublicationTarget";
import { AssociatedPublicationsList } from "@/features/publications";
import type { PublicationTarget } from "@canonical/landscape-openapi";

interface RemoveTargetModalProps extends Pick<
  TextConfirmationModalProps,
  "close" | "isOpen"
> {
  readonly target: PublicationTarget;
}

const PAGE_SIZE = 5;

const RemoveTargetModal: FC<RemoveTargetModalProps> = ({
  close,
  isOpen,
  target,
}) => {
  const debug = useDebug();
  const { notify } = useNotify();
  const { closeSidePanel } = usePageParams();
  const { removePublicationTargetQuery } = useRemovePublicationTarget();
  const { mutateAsync: removeTarget, isPending: isRemoving } =
    removePublicationTargetQuery;
  const { publications, isGettingPublications } = useGetPublicationsByTarget(
    target.publicationTargetId,
  );

  const hasPublications = !isGettingPublications && publications.length > 0;

  const handleRemoveTarget = async () => {
    try {
      if (!target.name) return;

      closeSidePanel();
      await removeTarget({ name: target.name });

      notify.success({
        message: `You have successfully removed ${target.displayName}`,
        title: "Publication target removed",
      });
    } catch (error) {
      debug(error);
    } finally {
      close();
    }
  };

  return (
    <TextConfirmationModal
      isOpen={isOpen}
      title={`Remove ${target.displayName}`}
      confirmButtonLabel="Remove target"
      confirmButtonAppearance="negative"
      confirmButtonLoading={isRemoving}
      confirmButtonDisabled={isRemoving}
      confirmationText={`remove ${target.displayName}`}
      onConfirm={handleRemoveTarget}
      close={close}
      renderInPortal
    >
      {hasPublications && (
        <>
          <p>
            This publication target is currently being used by the following
            publications:
          </p>
          <AssociatedPublicationsList
            publications={publications}
            pageSize={PAGE_SIZE}
            openInNewTab
          />
        </>
      )}
      <p>
        Removing this publication target will cause publications to no longer be
        able to publish to it. <b>This action is irreversible</b>.
      </p>
    </TextConfirmationModal>
  );
};

export default RemoveTargetModal;
