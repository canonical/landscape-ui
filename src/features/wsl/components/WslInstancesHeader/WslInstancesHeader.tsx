import type { FC } from "react";
import { lazy, Suspense } from "react";
import {
  Button,
  ConfirmationButton,
  Form,
  Input,
} from "@canonical/react-components";
import LoadingState from "@/components/layout/LoadingState";
import useDebug from "@/hooks/useDebug";
import useInstances from "@/hooks/useInstances";
import useSidePanel from "@/hooks/useSidePanel";
import type { WslInstanceWithoutRelation } from "@/types/Instance";
import { useWsl } from "../../hooks";
import classes from "./WslInstancesHeader.module.scss";
import HeaderWithSearch from "@/components/form/HeaderWithSearch";
import { useFormik } from "formik";
import { TableFilterChips } from "@/components/filter";

const WslInstanceInstallForm = lazy(
  async () => import("../WslInstanceInstallForm"),
);

interface WslInstancesHeaderProps {
  readonly selectedInstances: WslInstanceWithoutRelation[];
}

const WslInstancesHeader: FC<WslInstancesHeaderProps> = ({
  selectedInstances,
}) => {
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

  const formik = useFormik({
    initialValues: {
      confirmationText: "",
    },
    onSubmit: async () => handleRemoveInstances(),
  });

  const getIsWrongConfirmationText = () => {
    if (selectedInstances.length === 1) {
      return (
        formik.values.confirmationText !==
        `remove ${selectedInstances[0].title}`
      );
    }
    return formik.values.confirmationText !== "remove instances";
  };

  const isWrongConfirmationText = getIsWrongConfirmationText();

  return (
    <>
      <HeaderWithSearch
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
                    children: (
                      <Form noValidate onSubmit={formik.handleSubmit}>
                        {selectedInstances.length !== 1 ? (
                          <>
                            <p>
                              This will remove the selected instances from
                              Landscape. They will remain on the parent machine.
                              You can re-register them to Landscape at any time.
                            </p>
                            <p>
                              Type <b>remove instances</b> to confirm.
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              This will remove the instance{" "}
                              <b>{selectedInstances[0].title}</b> from
                              Landscape. It will remain on the parent machine.
                              You can re-register it to Landscape at any time.
                            </p>
                            <p>
                              Type <b>remove {selectedInstances[0].title}</b> to
                              confirm.
                            </p>
                          </>
                        )}
                        <Input
                          type="text"
                          {...formik.getFieldProps("confirmationText")}
                        />
                      </Form>
                    ),

                    confirmButtonLabel: "Remove",
                    confirmButtonAppearance: "negative",
                    confirmButtonDisabled:
                      isRemoving || isWrongConfirmationText,
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
      <TableFilterChips filtersToDisplay={["search"]} />
    </>
  );
};

export default WslInstancesHeader;
