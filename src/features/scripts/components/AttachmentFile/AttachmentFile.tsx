import { Button, Icon, ICONS, Tooltip } from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import { useGetSingleScriptAttachment } from "../../api";
import classes from "./AttachmentFile.module.scss";

interface AttachmentFileProps {
  readonly attachmentId: number;
  readonly filename: string;
  readonly onInitialAttachmentDelete?: () => void;
  readonly scriptId?: number;
  readonly className?: string;
}

const AttachmentFile: FC<AttachmentFileProps> = ({
  attachmentId,
  filename,
  onInitialAttachmentDelete,
  scriptId,
  className,
}) => {
  const { isScriptAttachmentsLoading, refetch } = useGetSingleScriptAttachment(
    { attachmentId, scriptId: scriptId || 0 },
    { enabled: false },
  );

  const handleDownload = async () => {
    const { data } = await refetch();
    if (!data) {
      return;
    }

    const blob = new Blob([data.data], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <span className={classNames(classes.attachment, className)}>
      <span>{filename}</span>
      <div className={classes.attachmentActions}>
        {scriptId ? (
          <Tooltip message="Download" position="top-center">
            <Button
              className={classNames(
                "u-no-margin--bottom u-no-margin--right",
                classes.actionButton,
              )}
              hasIcon
              type="button"
              onClick={handleDownload}
              disabled={isScriptAttachmentsLoading}
              appearance="base"
              aria-label={`Download ${filename}`}
            >
              <Icon name="begin-downloading" />
            </Button>
          </Tooltip>
        ) : null}
        {onInitialAttachmentDelete ? (
          <Tooltip message="Remove" position="top-center">
            <Button
              type="button"
              hasIcon
              appearance="base"
              className={classNames(
                "u-no-margin--bottom u-no-margin--right",
                classes.actionButton,
              )}
              aria-label={`Remove ${filename} attachment`}
              onClick={onInitialAttachmentDelete}
            >
              <Icon name={ICONS.delete} />
            </Button>
          </Tooltip>
        ) : null}
      </div>
    </span>
  );
};

export default AttachmentFile;
