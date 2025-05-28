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
            <Tooltip message="Download">
              <Icon name="begin-downloading" />
            </Tooltip>
          </Button>
        ) : null}
        {onInitialAttachmentDelete ? (
          <Button
            type="button"
            hasIcon
            appearance="base"
            className={classNames("u-no-margin--bottom", classes.actionButton)}
            aria-label={`Remove ${filename} attachment`}
            onClick={onInitialAttachmentDelete}
          >
            <Tooltip message="Remove" position="top-center">
              <Icon name={ICONS.delete} />
            </Tooltip>
          </Button>
        ) : null}
      </div>
    </span>
  );
};

export default AttachmentFile;
