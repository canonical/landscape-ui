import type { APTSource } from "@/features/apt-sources";
import { Button, Icon } from "@canonical/react-components";
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
      <div className={classes.header}>
        <Button
          appearance="base"
          hasIcon
          type="button"
          onClick={onClose}
          aria-label="Back"
        >
          <Icon name="chevron-left" />
        </Button>
        <p className={classes.title}>Add repository profile / Add Source</p>
      </div>
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
