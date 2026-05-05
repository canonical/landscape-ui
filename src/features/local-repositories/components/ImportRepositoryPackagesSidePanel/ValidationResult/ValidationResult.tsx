import type { FC } from "react";
import { Notification } from "@canonical/react-components";
import type { PackagesValidationState } from "@/features/operations";
import LocalRepositoryPackagesList from "../../LocalRepositoryPackagesList";

interface ValidationResultProps {
  readonly validationTask: PackagesValidationState;
}

const ValidationResult: FC<ValidationResultProps> = ({ validationTask }) => {
  if (validationTask.error?.code === 4) {
    return (
      <Notification
        severity="caution"
        title="Fetching packages timed out"
        borderless
      >
        <span>
          You can still proceed to import packages, although this process may
          fail if we can&apos;t fetch the packages from the source provided.
        </span>
      </Notification>
    );
  }

  if (validationTask.status === "failed") {
    return (
      <Notification
        severity="negative"
        title="Could not fetch packages"
        borderless
      >
        <span>
          {validationTask.error?.message ??
            "An unknown error occurred. Please try again later."}
        </span>
      </Notification>
    );
  }

  if (!validationTask.count) {
    return (
      <Notification
        severity="negative"
        title="No packages available from the URL provided"
        borderless
      />
    );
  }

  return (
    <>
      {validationTask.count > 100 && (
        <Notification
          severity="caution"
          title={`Only the first 100 packages of ${validationTask.count} are displayed`}
          borderless
        >
          <span>
            If you proceed with the import, all {validationTask.count} packages
            will be imported.
          </span>
        </Notification>
      )}
      <LocalRepositoryPackagesList
        packages={validationTask.response}
        header="Packages to import"
      />
    </>
  );
};

export default ValidationResult;
