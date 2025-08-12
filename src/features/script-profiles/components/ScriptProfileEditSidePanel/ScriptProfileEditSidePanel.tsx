import SidePanel from "@/components/layout/SidePanel";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import usePageParams from "@/hooks/usePageParams";
import moment from "moment";
import type { FC } from "react";
import { useEditScriptProfile, useGetScriptProfile } from "../../api";
import ScriptProfileForm from "../ScriptProfileForm";
import type { ScriptProfileFormSubmitValues } from "../ScriptProfileForm/ScriptProfileForm";

interface ScriptProfileEditSidePanelProps {
  readonly hasBackButton?: boolean;
}

const ScriptProfileEditSidePanel: FC<ScriptProfileEditSidePanelProps> = ({
  hasBackButton,
}) => {
  const { notify } = useNotify();
  const { scriptProfile: scriptProfileId } = usePageParams();

  const { editScriptProfile, isEditingScriptProfile } = useEditScriptProfile();
  const {
    isGettingScriptProfile,
    scriptProfile: profile,
    scriptProfileError,
  } = useGetScriptProfile({ id: scriptProfileId });

  if (isGettingScriptProfile) {
    return <SidePanel.LoadingState />;
  }

  if (!profile) {
    throw scriptProfileError;
  }

  const handleSubmit = async (values: ScriptProfileFormSubmitValues) => {
    await editScriptProfile({
      id: profile.id,
      all_computers: values.all_computers,
      tags: values.tags,
      time_limit: values.time_limit,
      title: values.title,
      trigger: values.trigger,
      username: values.username,
    });
  };

  return (
    <SidePanel.Body title={`Edit ${profile.title}`}>
      <ScriptProfileForm
        disabledFields={{
          script_id: true,
          trigger_type: true,
        }}
        initialValues={{
          ...profile,
          interval: "",
          ...profile.trigger,
          start_after:
            profile.trigger.trigger_type == "recurring"
              ? moment(profile.trigger.start_after)
                  .utc()
                  .format(INPUT_DATE_TIME_FORMAT)
              : "",
          timestamp:
            profile.trigger.trigger_type == "one_time"
              ? moment(profile.trigger.timestamp)
                  .utc()
                  .format(INPUT_DATE_TIME_FORMAT)
              : "",
        }}
        onSubmit={handleSubmit}
        onSuccess={(values) => {
          notify.success({
            title: `You have successfully saved changes for ${values.title}`,
            message: "The changes will be applied to this profile.",
          });
        }}
        submitButtonText="Save changes"
        submitting={isEditingScriptProfile}
        hasBackButton={hasBackButton}
      />
    </SidePanel.Body>
  );
};

export default ScriptProfileEditSidePanel;
