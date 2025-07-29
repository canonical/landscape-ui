import LoadingState from "@/components/layout/LoadingState";
import { pluralize } from "@/utils/_helpers";
import { Notification } from "@canonical/react-components";
import type { FC } from "react";
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

  if (isAutoinstallWithMetadataFileLoading || !autoinstallFileWithMetadata) {
    return <LoadingState />;
  }

  return (
    <>
      {autoinstallFileWithMetadata.metadata.max_versions <=
        autoinstallFileWithMetadata.version && (
        <Notification
          inline
          title="Edit history limit reached:"
          severity="caution"
        >
          <p>
            You&apos;ve reached the limit of{" "}
            {autoinstallFileWithMetadata.metadata.max_versions} saved{" "}
            {pluralize(
              autoinstallFileWithMetadata.metadata.max_versions,
              "edit",
            )}
            . To save your new change, the oldest version will be automatically
            removed, keeping the most recent{" "}
            {autoinstallFileWithMetadata.metadata.max_versions}{" "}
            {pluralize(
              autoinstallFileWithMetadata.metadata.max_versions,
              "version",
            )}{" "}
            in history.
          </p>
        </Notification>
      )}

      <AutoinstallFileForm
        buttonText="Save changes"
        description={`The duplicated ${autoinstallFileWithMetadata.filename} will be assigned to the same user groups in the identity provider as the original file.`}
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
