import IgnorableNotifcation from "@/components/layout/IgnorableNotification";
import LoadingState from "@/components/layout/LoadingState";
import type { FC } from "react";
import { useBoolean } from "usehooks-ts";
import { useGetAutoinstallFile, useUpdateAutoinstallFile } from "../../api";
import type { AutoinstallFile } from "../../types";
import AutoinstallFileForm from "../AutoinstallFileForm";
import { EDIT_AUTOINSTALL_FILE_NOTIFICATION } from "../AutoinstallFilesList/constants";

interface AutoinstallFileEditFormProps {
  readonly autoinstallFile: AutoinstallFile;
}

const AutoinstallFileEditForm: FC<AutoinstallFileEditFormProps> = ({
  autoinstallFile,
}) => {
  const {
    autoinstallFile: autoinstallFileWithMetadata,
    isAutoinstallFileLoading: isAutoinstallWithMetadataFileLoading,
  } = useGetAutoinstallFile({
    id: autoinstallFile.id,
    with_metadata: true,
  });
  const { updateAutoinstallFile } = useUpdateAutoinstallFile();

  const { value: isNotificationIgnored, setTrue: ignoreNotifification } =
    useBoolean(false);

  if (isAutoinstallWithMetadataFileLoading || !autoinstallFileWithMetadata) {
    return <LoadingState />;
  }

  return (
    <>
      {autoinstallFileWithMetadata.metadata.max_versions <=
        autoinstallFileWithMetadata.version &&
        !isNotificationIgnored && (
          <IgnorableNotifcation
            inline
            title="Edit history limit reached:"
            severity="caution"
            hide={ignoreNotifification}
            storageKey="_landscape_isAuditModalIgnored"
            modalProps={{
              title: "Dismiss edit history limit acknowledgment",
              confirmButtonAppearance: "positive",
              confirmButtonLabel: "Dismiss",
              checkboxProps: {
                label:
                  "I understand and acknowledge this policy. Don't show this message again.",
              },
            }}
          >
            <p>
              You&apos;ve reached the maximum of{" "}
              {autoinstallFileWithMetadata.metadata.max_versions} saved edits
              for this file. To continue editing, the system will remove the
              oldest version to make space for your new changes. This ensures
              that the most recent{" "}
              {autoinstallFileWithMetadata.metadata.max_versions}
              versions are always retained in the history.
            </p>
          </IgnorableNotifcation>
        )}

      <AutoinstallFileForm
        buttonText="Save changes"
        description={`The duplicated ${autoinstallFileWithMetadata.filename} will inherit the employee group assignments of the original file.`}
        initialFile={autoinstallFileWithMetadata}
        notification={EDIT_AUTOINSTALL_FILE_NOTIFICATION}
        onSubmit={async ({ contents }) => {
          await updateAutoinstallFile({
            id: autoinstallFileWithMetadata.id,
            contents,
          });
        }}
      />
    </>
  );
};

export default AutoinstallFileEditForm;
