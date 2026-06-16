import {
  ActionButton,
  Button,
  Icon,
  ICONS,
  Tooltip,
} from "@canonical/react-components";
import classNames from "classnames";
import type { FC } from "react";
import useDebug from "@/hooks/useDebug";
import { downloadBlob } from "@/utils/browserDownload";
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
  const debug = useDebug();

  const { isScriptAttachmentsLoading, refetch } = useGetSingleScriptAttachment(
    { attachmentId, scriptId: scriptId || 0 },
    { enabled: false },
  );

  const handleDownload = async () => {
    try {
      const { data } = await refetch();
      if (!data || data.data === null || data.data === undefined) {
        return;
      }

      downloadBlob(data.data, filename);
    } catch (error) {
      debug(error);
    }
  };

  return (
    <span className={classNames(classes.attachment, className)}>
      <span>{filename}</span>
      <div className={classes.attachmentActions}>
        {scriptId ? (
          <Tooltip message="Download" position="top-center">
            <ActionButton
              className={classNames(
                "u-no-margin--bottom u-no-margin--right",
                classes.actionButton,
              )}
              hasIcon
              type="button"
              onClick={handleDownload}
              loading={isScriptAttachmentsLoading}
              appearance="base"
              aria-label={`Download ${filename}`}
            >
              <Icon name="begin-downloading" />
            </ActionButton>
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
