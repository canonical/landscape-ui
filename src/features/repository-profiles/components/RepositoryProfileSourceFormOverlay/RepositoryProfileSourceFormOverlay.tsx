import type { APTSource } from "../../types";
import type { FC } from "react";
import RepositoryProfileSourceForm from "../RepositoryProfileSourceForm";
import classes from "./RepositoryProfileSourceFormOverlay.module.scss";

interface RepositoryProfileSourceFormOverlayProps {
  readonly onClose: () => void;
  readonly onSourceAdded: (source: APTSource) => void;
  readonly sourceToEdit?: APTSource | null;
}

const RepositoryProfileSourceFormOverlay: FC<
  RepositoryProfileSourceFormOverlayProps
> = ({ onClose, onSourceAdded, sourceToEdit }) => {
  const derivedInitialValues = sourceToEdit
    ? {
        name: sourceToEdit.name,
        deb_line: sourceToEdit.line,
        gpg_key_name: sourceToEdit.gpg_key?.name ?? "",
      }
    : undefined;

  return (
    <div className={classes.overlay} data-testid="source-form-overlay">
      <div className={classes.content}>
        <RepositoryProfileSourceForm
          onSuccess={onSourceAdded}
          onBack={onClose}
          initialValues={derivedInitialValues}
        />
      </div>
    </div>
  );
};

export default RepositoryProfileSourceFormOverlay;
