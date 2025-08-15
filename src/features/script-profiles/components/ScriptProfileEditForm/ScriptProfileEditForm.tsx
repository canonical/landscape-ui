import SidePanel from "@/components/layout/SidePanel";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import moment from "moment";
import type { FC } from "react";
import { useEditScriptProfile } from "../../api";
import ScriptProfileForm from "../ScriptProfileForm";
import type { ScriptProfileFormSubmitValues } from "../ScriptProfileForm/ScriptProfileForm";
import type { ScriptProfileSidePanelComponentProps } from "../ScriptProfileSidePanel";
import ScriptProfileSidePanel from "../ScriptProfileSidePanel";

interface ScriptProfileEditFormProps {
  readonly hasBackButton?: boolean;
}

const Component: FC<
  ScriptProfileEditFormProps & ScriptProfileSidePanelComponentProps
> = ({ hasBackButton, scriptProfile: profile }) => {
  const { notify } = useNotify();

  const { editScriptProfile, isEditingScriptProfile } = useEditScriptProfile();

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
      </SidePanel.Content>
    </>
  );
};

const ScriptProfileEditForm: FC<ScriptProfileEditFormProps> = (props) => (
  <ScriptProfileSidePanel
    Component={(componentProps) => <Component {...props} {...componentProps} />}
  />
);

export default ScriptProfileEditForm;
