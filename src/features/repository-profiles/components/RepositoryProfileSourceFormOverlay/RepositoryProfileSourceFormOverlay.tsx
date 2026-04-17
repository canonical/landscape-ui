import type { APTSource } from "@/features/apt-sources";
import type { FC } from "react";
import RepositoryProfileSourceForm from "../RepositoryProfileSourceForm";
import classes from "./RepositoryProfileSourceFormOverlay.module.scss";

interface RepositoryProfileSourceFormOverlayProps {
  readonly onClose: () => void;
  readonly onSourceAdded: (source: APTSource) => void;
}

const RepositoryProfileSourceFormOverlay: FC<
  RepositoryProfileSourceFormOverlayProps
> = ({ onClose, onSourceAdded }) => {
  return (
    <div className={classes.overlay}>
      <div className={classes.content}>
        <RepositoryProfileSourceForm
          onSuccess={onSourceAdded}
          onCancel={onClose}
        />
      </div>
    </div>
  );
};

export default RepositoryProfileSourceFormOverlay;
