import LoadingState from "@/components/layout/LoadingState";
import NoData from "@/components/layout/NoData";
import { ROUTES } from "@/libs/routes";
import { ConfirmationModal, ModularTable } from "@canonical/react-components";
import type { FC } from "react";
import { Link } from "react-router";
import type { CellProps } from "react-table";
import { useGetAssociatedScriptProfiles } from "../../api";
import type { Script, TruncatedScriptProfile } from "../../types";
import { pluralizeWithCount } from "@/utils/_helpers";

interface EditScriptConfirmationModalProps {
  readonly script: Script;
  readonly confirmButtonLabel: string;
  readonly isConfirming: boolean;
  readonly onConfirm: () => void;
  readonly onClose: () => void;
}

const EditScriptConfirmationModal: FC<EditScriptConfirmationModalProps> = ({
  script,
  confirmButtonLabel,
  isConfirming,
  onConfirm,
  onClose,
}) => {
  const { associatedScriptProfiles, isAssociatedScriptProfilesLoading } =
    useGetAssociatedScriptProfiles(script.id);

  const modalContent = () => {
    if (isAssociatedScriptProfilesLoading) {
      return <LoadingState />;
    }

    if (associatedScriptProfiles.length === 0) {
      return (
        <p>
          All future script runs will be done using the latest version of the
          code.
        </p>
      );
    }

    return (
      <>
        <p>
          All future script runs will be done using the latest version of the
          code. Submitting these changes will affect the following profiles:
        </p>
        <ModularTable
          columns={[
            {
              Header: "active profiles",
              accessor: "title",
              Cell: ({ row }: CellProps<TruncatedScriptProfile>) => (
                <Link
                  to={ROUTES.scripts.root({ tab: "profiles" })}
                  state={{ scriptProfileId: row.original.id }}
                  target="_blank"
                >
                  {row.original.title}
                </Link>
              ),
            },
            {
              Header: "associated instances",
              Cell: ({ row }: CellProps<TruncatedScriptProfile>) => {
                const associatedProfile = associatedScriptProfiles.find(
                  (profile) => profile.id === row.original.id,
                );

                const associatedComputers =
                  associatedProfile?.computers.num_associated_computers;

                return associatedComputers ? (
                  <Link
                    to={ROUTES.instances.root({
                      tags: associatedProfile?.tags,
                    })}
                    target="_blank"
                  >
                    {pluralizeWithCount(associatedComputers, "instance")}
                  </Link>
                ) : (
                  <NoData />
                );
              },
            },
          ]}
          data={script.script_profiles}
        />
      </>
    );
  };

  return (
    <ConfirmationModal
      renderInPortal
      title={`Submit new version of "${script.title}"`}
      confirmButtonLabel={confirmButtonLabel}
      onConfirm={onConfirm}
      confirmButtonAppearance="positive"
      confirmButtonDisabled={isConfirming}
      confirmButtonLoading={isConfirming}
      close={onClose}
      confirmButtonProps={{ type: "button" }}
    >
      {modalContent()}
    </ConfirmationModal>
  );
};

export default EditScriptConfirmationModal;
