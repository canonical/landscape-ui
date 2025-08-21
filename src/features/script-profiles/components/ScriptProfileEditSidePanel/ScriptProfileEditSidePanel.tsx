import SidePanel from "@/components/layout/SidePanel";
import useNotify from "@/hooks/useNotify";
import type { FC } from "react";
import { useEditScriptProfile } from "../../api";
import useGetPageScriptProfile from "../../api/useGetPageScriptProfile";
import type { ScriptProfileFormSubmitValues } from "../ScriptProfileForm";
import ScriptProfileForm from "../ScriptProfileForm";
import { getScriptProfileEditFormInitialValues } from "./helpers";

const ScriptProfileEditSidePanel: FC = () => {
  const { notify } = useNotify();

  const { scriptProfile: profile, isGettingScriptProfile } =
    useGetPageScriptProfile();
  const { editScriptProfile, isEditingScriptProfile } = useEditScriptProfile();

  if (isGettingScriptProfile) {
    return <SidePanel.LoadingState />;
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
    <>
      <SidePanel.Header>Edit {profile.title}</SidePanel.Header>
      <SidePanel.Content>
        <ScriptProfileForm
          disabledFields={{
            script_id: true,
            trigger_type: true,
          }}
          initialValues={getScriptProfileEditFormInitialValues(profile)}
          onSubmit={handleSubmit}
          onSuccess={(values) => {
            notify.success({
              title: `You have successfully saved changes for ${values.title}`,
              message: "The changes will be applied to this profile.",
            });
          }}
          submitButtonText="Save changes"
          submitting={isEditingScriptProfile}
        />
      </SidePanel.Content>
    </>
  );
};

export default ScriptProfileEditSidePanel;
