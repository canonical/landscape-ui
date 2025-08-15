import SidePanel from "@/components/layout/SidePanel";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import moment from "moment";
import type { FC } from "react";
import { useAddScriptProfile } from "../../api";
import ScriptProfileForm from "../ScriptProfileForm";

const ScriptProfileAddSidePanel: FC = () => {
  const { notify } = useNotify();

  const { addScriptProfile, isAddingScriptProfile } = useAddScriptProfile();

  return (
    <>
      <SidePanel.Header>Add script profile</SidePanel.Header>

      <SidePanel.Content>
        <ScriptProfileForm
          initialValues={{
            all_computers: false,
            interval: "",
            start_after: moment().utc().format(INPUT_DATE_TIME_FORMAT),
            tags: [],
            time_limit: 300,
            timestamp: moment().utc().format(INPUT_DATE_TIME_FORMAT),
            title: "",
            trigger_type: "",
            username: "root",
            script: null,
          }}
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

export default ScriptProfileAddSidePanel;
