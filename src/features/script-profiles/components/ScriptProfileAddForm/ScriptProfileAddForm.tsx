import SidePanel from "@/components/layout/SidePanel";
import useNotify from "@/hooks/useNotify";
import type { FC } from "react";
import { useAddScriptProfile } from "../../api";
import ScriptProfileForm from "../ScriptProfileForm";
import { SCRIPT_PROFILE_ADD_FORM_INITIAL_VALUES } from "./constants";

const ScriptProfileAddForm: FC = () => {
  const { notify } = useNotify();

  const { addScriptProfile, isAddingScriptProfile } = useAddScriptProfile();

  return (
    <>
      <SidePanel.Header>Add script profile</SidePanel.Header>
      <SidePanel.Content>
        <ScriptProfileForm
          initialValues={SCRIPT_PROFILE_ADD_FORM_INITIAL_VALUES}
          onSubmit={async (values) => {
            await addScriptProfile({
              all_computers: values.all_computers,
              script_id: values.script_id,
              tags: values.tags,
              time_limit: values.time_limit,
              title: values.title,
              trigger: values.trigger,
              username: values.username,
            });
          }}
          onSuccess={(values) => {
            notify.success({
              title: `You have successfully created ${values.title}`,
              message:
                "The profile has been created and associated to the defined instances.",
            });
          }}
          submitButtonText="Add profile"
          submitting={isAddingScriptProfile}
        />
      </SidePanel.Content>
    </>
  );
};

export default ScriptProfileAddForm;
