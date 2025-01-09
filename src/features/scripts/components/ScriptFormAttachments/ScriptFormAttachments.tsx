import { ChangeEventHandler, FC } from "react";
import { ScriptFormValues } from "../../types";
import {
  Button,
  Icon,
  ICONS,
  Input,
  Tooltip,
} from "@canonical/react-components";

interface ScriptFormAttachmentsProps {
  attachments: ScriptFormValues["attachments"];
  attachmentsToRemove: string[];
  getFileInputError: (
    key: keyof ScriptFormValues["attachments"],
  ) => string | undefined;
  initialAttachments: string[];
  onFileInputChange: (
    key: keyof ScriptFormValues["attachments"],
  ) => ChangeEventHandler<HTMLInputElement>;
  onInitialAttachmentDelete: (attachment: string) => void;
}

const ScriptFormAttachments: FC<ScriptFormAttachmentsProps> = ({
  attachments,
  attachmentsToRemove,
  getFileInputError,
  initialAttachments,
  onFileInputChange,
  onInitialAttachmentDelete,
}) => {
  return (
    <>
      {Object.keys(attachments).map((attachmentsKey, index) => {
        const key = attachmentsKey as keyof ScriptFormValues["attachments"];
        const initialAttachment = initialAttachments[index];

        return !initialAttachment ||
          attachmentsToRemove.includes(initialAttachment) ? (
          <Input
            key={key}
            type="file"
            label={`${key} attachment`}
            labelClassName="u-off-screen"
            onChange={onFileInputChange(key)}
            error={getFileInputError(key)}
          />
        ) : (
          <div key={key} style={{ marginBottom: "1rem" }}>
            <span>{initialAttachment}</span>
            <Button
              type="button"
              hasIcon
              appearance="base"
              className="u-no-margin--bottom"
              aria-label={`Remove ${initialAttachment} attachment`}
              onClick={() => {
                onInitialAttachmentDelete(initialAttachment);
              }}
            >
              <Tooltip message="Remove" position="top-center">
                <Icon name={ICONS.delete} />
              </Tooltip>
            </Button>
          </div>
        );
      })}
    </>
  );
};

export default ScriptFormAttachments;
