import { FC, lazy, Suspense } from "react";
import { Button, ConfirmationButton } from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useSidePanel from "@/hooks/useSidePanel";
import { InstanceWithoutRelation } from "@/types/Instance";
import { useWsl } from "../../hooks";
import classes from "./WslInstancesHeader.module.scss";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { usePageParams } from "@/hooks/usePageParams";

const WslInstanceInstallForm = lazy(() => import("../WslInstanceInstallForm"));

interface WslInstancesHeaderProps {
  selectedInstances: InstanceWithoutRelation[];
}

const WslInstancesHeader: FC<WslInstancesHeaderProps> = ({
  selectedInstances,
}) => {
  const { setPageParams } = usePageParams();
  const debug = useDebug();
  const { setSidePanelContent } = useSidePanel();
  const { deleteChildInstancesQuery } = useWsl();
  const { removeInstancesQuery } = useInstances();

  const { mutateAsync: deleteChildInstances, isPending: isDeleting } =
    deleteChildInstancesQuery;
  const { mutateAsync: removeInstances, isPending: isRemoving } =
    removeInstancesQuery;

  const handleDeleteChildInstances = async () => {
    try {
      await deleteChildInstances({
        computer_ids: selectedInstances.map(({ id }) => id),
      });
    } catch (error) {
      debug(error);
    }
  };

  const handleRemoveInstances = async () => {
    try {
      await removeInstances({
        computer_ids: selectedInstances.map(({ id }) => id),
      });
    } catch (error) {
      debug(error);
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

  const handleSearch = (searchText: string) => {
    setPageParams({ search: searchText });
  };

  return (
    <HeaderWithSearch
      onSearch={handleSearch}
      actions={
        <div className={classes.cta}>
          <Button type="button" onClick={handleWslInstanceInstall}>
            <span>Create new instance</span>
          </Button>

          <div className="p-segmented-control">
            <div className="p-segmented-control__list">
              <ConfirmationButton
                type="button"
                className="p-segmented-control__button"
                disabled={selectedInstances.length === 0}
                confirmationModalProps={{
                  title:
                    selectedInstances.length !== 1
                      ? "Delete instances"
                      : "Delete instance",
                  children:
                    selectedInstances.length !== 1 ? (
                      <p>
                        This will permanently delete selected instances from
                        both the Windows host machine and Landscape.
                      </p>
                    ) : (
                      <p>
                        This will permanently delete the instance{" "}
                        <b>{selectedInstances[0].title}</b> from both the
                        Windows host machine and Landscape.
                      </p>
                    ),
                  confirmButtonLabel: "Delete",
                  confirmButtonAppearance: "negative",
                  confirmButtonDisabled: isDeleting,
                  confirmButtonLoading: isDeleting,
                  onConfirm: handleDeleteChildInstances,
                }}
              >
                Delete instance
              </ConfirmationButton>

              <ConfirmationButton
                type="button"
                className="p-segmented-control__button"
                disabled={selectedInstances.length === 0}
                confirmationModalProps={{
                  title:
                    selectedInstances.length !== 1
                      ? "Remove instances from Landscape"
                      : "Remove instance from Landscape",
                  children:
                    selectedInstances.length !== 1 ? (
                      <>
                        <p>
                          This will remove the selected instances from
                          Landscape.
                          <br />
                          <br />
                          They will remain on the parent machine. You can
                          re-register them to Landscape at any time.
                        </p>
                      </>
                    ) : (
                      <p>
                        This will remove the instance{" "}
                        <b>{selectedInstances[0].title}</b> from Landscape.
                        <br />
                        <br />
                        It will remain on the parent machine. You can
                        re-register it to Landscape at any time.
                      </p>
                    ),
                  confirmButtonLabel: "Remove",
                  confirmButtonAppearance: "negative",
                  confirmButtonDisabled: isRemoving,
                  confirmButtonLoading: isRemoving,
                  onConfirm: handleRemoveInstances,
                }}
              >
                Remove from Landscape
              </ConfirmationButton>
            </div>
          </div>
        </div>
      }
    />
  );
};

export default WslInstancesHeader;
