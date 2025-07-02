import { TableFilterChips } from "@/components/filter";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import TextConfirmationModal from "@/components/form/TextConfirmationModal";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useSidePanel from "@/hooks/useSidePanel";
import type { WslInstanceWithoutRelation } from "@/types/Instance";
import { Button } from "@canonical/react-components";
import type { FC } from "react";
import { lazy, Suspense, useState } from "react";
import { useWsl } from "../../hooks";
import classes from "./WslInstancesHeader.module.scss";
import useNotify from "@/hooks/useNotify";
import { pluralize } from "@/utils/_helpers";

const WslInstanceInstallForm = lazy(
  async () => import("../WslInstanceInstallForm"),
);

interface WslInstancesHeaderProps {
  readonly selectedInstances: WslInstanceWithoutRelation[];
}

const WslInstancesHeader: FC<WslInstancesHeaderProps> = ({
  selectedInstances,
}) => {
  const [modalOpen, setModalOpen] = useState("");

  const { notify } = useNotify();
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { deleteChildInstancesQuery } = useWsl();
  const { removeInstancesQuery } = useInstances();

  const { mutateAsync: deleteChildInstances, isPending: isDeleting } =
    deleteChildInstancesQuery;
  const { mutateAsync: removeInstances, isPending: isRemoving } =
    removeInstancesQuery;

  const handleOpenModal = (modal: string) => {
    setModalOpen(modal);
  };

  const handleCloseModal = () => {
    setModalOpen("");
  };

  const handleDeleteChildInstances = async () => {
    try {
      await deleteChildInstances({
        computer_ids: selectedInstances.map(({ id }) => id),
      });

      notify.success({
        title: `You queued ${selectedInstances.length} ${pluralize(selectedInstances.length, "instance")} to be deleted.`,
        message: `${selectedInstances.length} ${pluralize(selectedInstances.length, "instance")} will be deleted.`,
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleRemoveInstances = async () => {
    try {
      await removeInstances({
        computer_ids: selectedInstances.map(({ id }) => id),
      });

      notify.success({
        title: `You have successfully removed ${selectedInstances.length} ${pluralize(selectedInstances.length, "instance")}.`,
        message: pluralize(
          selectedInstances.length,
          `${selectedInstances.length} instance has been removed from Landscape. To manage it again, you will need to re-register it in Landscape.`,
          `${selectedInstances.length} instances have been removed from Landscape. To manage them again, you will need to re-register them in Landscape.`,
        ),
      });
    } catch (error) {
      debug(error);
    } finally {
      handleCloseModal();
    }
  };

  const handleWslInstanceInstall = () => {
    setSidePanelContent(
      "Install new WSL instance",
      <Suspense fallback={<LoadingState />}>
        <WslInstanceInstallForm />
      </Suspense>,
    );
  };

  return (
    <>
      <HeaderWithSearch
        actions={
          <div className={classes.cta}>
            <Button
              type="button"
              onClick={handleWslInstanceInstall}
              className="u-no-margin--bottom"
            >
              <span>Create new instance</span>
            </Button>

            <div className="p-segmented-control">
              <div className="p-segmented-control__list">
                <Button
                  type="button"
                  className="p-segmented-control__button u-no-margin--bottom"
                  disabled={selectedInstances.length === 0}
                  onClick={() => {
                    handleOpenModal("delete");
                  }}
                >
                  Delete instance
                </Button>

                <Button
                  type="button"
                  className="p-segmented-control__button u-no-margin--bottom"
                  disabled={selectedInstances.length === 0}
                  onClick={() => {
                    handleOpenModal("remove");
                  }}
                >
                  Remove from Landscape
                </Button>
              </div>
            </div>
          </div>
        }
      />
      <TableFilterChips filtersToDisplay={["search"]} />

      <TextConfirmationModal
        isOpen={modalOpen === "remove"}
        close={handleCloseModal}
        onConfirm={handleRemoveInstances}
        title={`Remove ${pluralize(selectedInstances.length, "instance")} from Landscape`}
        confirmButtonLabel="Remove"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isRemoving}
        confirmButtonLoading={isRemoving}
        confirmationText={pluralize(
          selectedInstances.length,
          `remove ${selectedInstances[0]?.title ?? "instance"}`,
          "remove instances",
        )}
      >
        {selectedInstances.length !== 1 ? (
          <p>
            This will remove the selected instances from Landscape. They will
            remain on the parent machine. You can re-register them to Landscape
            at any time.
          </p>
        ) : (
          <p>
            This will remove the instance <b>{selectedInstances[0]?.title}</b>{" "}
            from Landscape. It will remain on the parent machine. You can
            re-register it to Landscape at any time.
          </p>
        )}
      </TextConfirmationModal>

      <TextConfirmationModal
        isOpen={modalOpen === "delete"}
        close={handleCloseModal}
        onConfirm={handleDeleteChildInstances}
        title={`Delete ${pluralize(selectedInstances.length, "instance")}`}
        confirmButtonLabel="Delete"
        confirmButtonAppearance="negative"
        confirmButtonDisabled={isDeleting}
        confirmButtonLoading={isDeleting}
        confirmationText={pluralize(
          selectedInstances.length,
          `delete ${selectedInstances[0]?.title ?? ""}`,
          "delete instances",
        )}
      >
        {selectedInstances.length !== 1 ? (
          <p>
            This will permanently delete the selected instances from both the
            Windows host machine and Landscape.
          </p>
        ) : (
          <p>
            This will permanently delete the instance{" "}
            <b>{selectedInstances[0]?.title ?? ""}</b> from both the Windows
            host machine and Landscape.
          </p>
        )}
      </TextConfirmationModal>
    </>
  );
};

export default WslInstancesHeader;
