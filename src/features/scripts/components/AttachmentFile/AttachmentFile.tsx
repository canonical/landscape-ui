import { Tooltip } from "@canonical/react-components";
import { Button } from "@canonical/react-ds-global";
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
            <Button
              type="button"
              importance="tertiary"
              icon="download"
              loading={isScriptAttachmentsLoading}
              aria-label={`Download ${filename}`}
              onClick={handleDownload}
            />
          </Tooltip>
        ) : null}
        {onInitialAttachmentDelete ? (
          <Tooltip message="Remove" position="top-center">
            <Button
              type="button"
              importance="tertiary"
              icon="delete"
              aria-label={`Remove ${filename} attachment`}
              onClick={onInitialAttachmentDelete}
            />
          </Tooltip>
        ) : null}
      </div>
    </span>
  );
};

export default AttachmentFile;
