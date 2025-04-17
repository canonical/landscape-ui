import CodeEditor from "@/components/form/CodeEditor";
import SidePanelFormButtons from "@/components/form/SidePanelFormButtons";
import InfoItem from "@/components/layout/InfoItem";
import LoadingState from "@/components/layout/LoadingState";
import { DISPLAY_DATE_TIME_FORMAT } from "@/constants";
import { ConfirmationModal, Form } from "@canonical/react-components";
import moment from "moment";
import { useState, type FC } from "react";
import { useGetScriptVersion } from "../../api";
import { useScripts } from "../../hooks";
import type { ScriptVersion } from "../../types";

interface ScriptVersionHistoryDetailsProps {
  readonly scriptVersion: ScriptVersion;
  readonly goBack: () => void;
}

const ScriptVersionHistoryDetails: FC<ScriptVersionHistoryDetailsProps> = ({
  scriptVersion,
  goBack,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { version, isVersionLoading } = useGetScriptVersion({
    scriptId: scriptVersion.script_id,
    versionId: scriptVersion.id,
  });

  const { editScriptQuery } = useScripts();
  const { mutateAsync: editScript, isPending: isEditing } = editScriptQuery;

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSubmit = async () => {
    if (version) {
      await editScript({
        script_id: scriptVersion.script_id,
        code: version.code,
      });
      goBack();
    }
  };

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <InfoItem
        label="author"
        value={`${moment(scriptVersion.created_at).format(DISPLAY_DATE_TIME_FORMAT)}, by ${scriptVersion.creator_name}`}
      />

      {isVersionLoading ? (
        <LoadingState />
      ) : (
        <CodeEditor
          label="Code"
          value={version?.code ?? ""}
          options={{ readOnly: true }}
          language={version?.interpreter ?? ""}
        />
      )}

      <SidePanelFormButtons
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
