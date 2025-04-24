import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import {
  CodeSnippet,
  ConfirmationModal,
  Form,
} from "@canonical/react-components";
import moment from "moment";
import { useState, type FC } from "react";
import { useEditScript, useGetScriptVersion } from "../../api";
import type { ScriptFormValues, TruncatedScriptVersion } from "../../types";
import useDebug from "@/hooks/useDebug";
import { getEditScriptParams } from "../../helpers";

interface ScriptVersionHistoryDetailsProps {
  readonly isArchived: boolean;
  readonly scriptId: number;
  readonly scriptVersion: TruncatedScriptVersion;
  readonly goBack: () => void;
}

const ScriptVersionHistoryDetails: FC<ScriptVersionHistoryDetailsProps> = ({
  scriptId,
  scriptVersion,
  goBack,
  isArchived,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const debug = useDebug();

  const { version, isVersionLoading } = useGetScriptVersion({
    scriptId: scriptId,
    versionId: scriptVersion.version_number,
  });

  const { editScript, isEditing } = useEditScript();

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const code = `#!${version?.interpreter}` + "\n" + version?.code;

  const handleSubmit = async () => {
    try {
      if (version) {
        const values = {
          code,
          title: version.title,
        } as ScriptFormValues;

        const params = getEditScriptParams({
          scriptId: scriptId,
          values: values,
        });

        await editScript(params);

        goBack();
      }
    } catch (error) {
      setModalOpen(false);
      debug(error);
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <InfoItem
        label="author"
        value={`${moment(scriptVersion.created_at).format(DISPLAY_DATE_TIME_FORMAT)}, by ${scriptVersion.created_by.name}`}
      />

      {isVersionLoading ? (
        <LoadingState />
      ) : (
        <CodeSnippet
          blocks={[
            {
              title: "Code",
              code: code || "",
              wrapLines: true,
              appearance: "numbered",
            },
          ]}
        />
      )}

      <SidePanelFormButtons
        hasActionButtons={!isArchived}
        submitButtonAppearance="secondary"
        submitButtonText="Use as new version"
        onSubmit={handleOpenModal}
        hasBackButton
        onBackButtonPress={goBack}
      />

      {modalOpen && (
        <ConfirmationModal
          title={`Submit new version of ${scriptVersion.title}`}
          confirmButtonLabel="Submit new version"
          close={handleCloseModal}
          confirmButtonAppearance="positive"
          confirmButtonLoading={isEditing}
          confirmButtonDisabled={isEditing}
          onConfirm={handleSubmit}
          confirmButtonProps={{
            type: "button",
          }}
        >
          <p>
            All future script runs will be done using the latest version of the
            code.
          </p>
        </ConfirmationModal>
      )}
    </Form>
  );
};

export default ScriptVersionHistoryDetails;
