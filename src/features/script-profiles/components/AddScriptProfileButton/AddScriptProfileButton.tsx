import LoadingState from "@/components/layout/LoadingState";
import { INPUT_DATE_TIME_FORMAT } from "@/constants";
import useNotify from "@/hooks/useNotify";
import useSidePanel from "@/hooks/useSidePanel";
import { Button, Icon } from "@canonical/react-components";
import moment from "moment";
import type { ComponentProps } from "react";
import { lazy, Suspense, type FC } from "react";
import {
  useAddScriptProfile,
  useGetScriptProfileLimits,
  useGetScriptProfiles,
} from "../../api";

const ScriptProfileForm = lazy(async () => import("../ScriptProfileForm"));

interface AddScriptProfileButtonProps {
  readonly appearance?: ComponentProps<typeof Button>["appearance"];
}

const AddScriptProfileButton: FC<AddScriptProfileButtonProps> = ({
  appearance,
}) => {
  const { notify } = useNotify();
  const { setSidePanelContent } = useSidePanel();
  const { addScriptProfile, isAddingScriptProfile } = useAddScriptProfile();

  const { scriptProfilesCount: activeScriptProfilesCount } =
    useGetScriptProfiles({ listenToUrlParams: false }, { archived: "active" });
  const { scriptProfileLimits } = useGetScriptProfileLimits();

  const addProfile = () => {
    setSidePanelContent(
      "Add script profile",
      <Suspense fallback={<LoadingState />}>
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
      </Suspense>,
    );
  };

  return (
    <Button
      type="button"
      appearance={appearance}
      onClick={addProfile}
      className="u-no-margin--bottom"
      hasIcon
      disabled={
        (activeScriptProfilesCount ?? 0) >=
        (scriptProfileLimits?.max_num_profiles ?? 0)
      }
    >
      <Icon name="plus" light={appearance === "positive"} />
      <span>Add profile</span>
    </Button>
  );
};

export default AddScriptProfileButton;
